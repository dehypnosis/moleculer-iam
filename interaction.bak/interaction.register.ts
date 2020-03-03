import moment from "moment";
import { Errors } from "../../identity/error";
import { InteractionMiddleware, InteractionRequestContext } from "./interaction";

export const useRegisterInteraction: InteractionMiddleware = ({ idp, provider, url, router }) => {

  // 2.7. handle register submit
  router.post("/register", async ctx => {
    const { client, interaction } = ctx.locals as InteractionRequestContext;
    ctx.assert(interaction.prompt.name === "login" || interaction.prompt.name === "consent", "Invalid Request.");

    // 1. extend TTL
    await interaction.save(moment().isAfter((interaction.exp / 1000) + 60 * 30, "s") ? interaction.exp + 60 * 30 : undefined);

    // 2. enter email, name, password, password_confirmation
    if (!interaction.result || !interaction.result.register || interaction.result.register.email || typeof ctx.request.body.email !== "undefined") {
      // 2.1. assert user not exists
      const user = await idp.find({ claims: { email: ctx.request.body.email || "" } });
      if (user) {
        throw new Errors.IdentityAlreadyExistsError();
      }

      // 2.2. validate claims
      const { email, name, password, password_confirmation } = ctx.request.body;
      // tslint:disable-next-line:no-shadowed-variable
      const claims = { email, name };
      // tslint:disable-next-line:no-shadowed-variable
      const credentials = { password, password_confirmation };
      await idp.validate({ scope: ["email", "profile"], claims, credentials });

      // 2.3. store claims temporarily
      await provider.interactionResult(ctx.req, ctx.res, {
        ...interaction.result,
        // consent was given by the user to the client for this session
        register: {
          claims,
          credentials,
        },
      }, {
        mergeWithLastSubmission: true,
      });

      return ctx.body = {
        interaction: {
          name: "register",
          action: {
            submit: {
              url: url(`/register`),
              method: "POST",
              data: {
                phone_number: "",
                birthdate: "",
                gender: "",
              },
            },
          },
          data: {
            ...claims,
          },
        },
      };
    }

    ctx.assert(interaction.result.register);

    // 3. enter phone_number, birthdate, gender
    // tslint:disable-next-line:prefer-const
    let { claims, credentials } = interaction.result.register;
    if (!claims.birthdate || !claims.gender || typeof ctx.request.body.birthdate !== "undefined") {
      // 3.1. validate claims
      const { phone_number, birthdate, gender } = ctx.request.body;
      claims = { ...claims, birthdate, gender };
      if (phone_number) {
        const user = await idp.find({ claims: { phone_number } });
        if (user) {
          throw new Errors.ValidationError([{
            type: "duplicatePhoneNumber",
            field: "phone_number",
            message: `Already registered phone number.`,
          }]);
        }
        claims.phone_number = phone_number;
      }
      await idp.validate({ scope: ["email", "profile", "birthdate", "gender"].concat(phone_number ? ["phone"] : []), claims, credentials });

      // 3.2. store claims temporarily
      await provider.interactionResult(ctx.req, ctx.res, {
        ...interaction.result,
        // consent was given by the user to the client for this session
        register: {
          claims,
          credentials,
        },
      }, {
        mergeWithLastSubmission: true,
      });
    }

    // 3.3. let verify phone number or submit
    const shouldVerifyPhoneNumber = claims.phone_number && claims.phone_number_verified !== true;
    if (shouldVerifyPhoneNumber) {
      return ctx.body = {
        interaction: {
          name: "verify_phone_number",
          action: {
            send: {
              url: url(`/verify_phone_number`),
              method: "POST",
              data: {
                phone_number: claims.phone_number,
                callback: "register",
                registered: false,
              },
            },
          },
          data: {
            phoneNumber: claims.phone_number,
          },
        },
      };
    }

    // 4. finish registration
    let redirect: string | undefined;
    if (ctx.request.body.save) {
      // 4.1. create user
      const identity = await idp.create({
        scope: ["email", "profile", "birthdate", "gender"].concat(claims.phone_number ? ["phone"] : []),
        claims,
        credentials,
        metadata: {},
      });

      // 4.2. let signed in
      const login = {
        account: identity.id,
        remember: true,
        // acr: string, // acr value for the authentication
        // remember: boolean, // true if provider should use a persistent cookie rather than a session one, defaults to true
        // ts: number, // unix timestamp of the authentication, defaults to now()
      };

      redirect = await provider.interactionResult(ctx.req, ctx.res, {
        ...interaction.result,
        login,
        register: null,
      }, {
        mergeWithLastSubmission: true,
      });

      // overwrite session
      await provider.setProviderSession(ctx.req, ctx.res, login);

      // TODO: 5. send email which includes (email verification link) with adapter props
    }

    return ctx.body = {
      redirect,
      interaction: {
        name: "register",
        action: {
          submit: {
            url: url(`/register`),
            method: "POST",
            data: {
              save: true,
            },
          },
        },
        data: {
          email: claims.email,
          name: claims.name,
        },
      },
    };
  });
};
