import moment from "moment";
import { Errors } from "../../identity/error";
import { InteractionMiddleware, InteractionRequestContext } from "./interaction";

export const useVerifyPhoneInteraction: InteractionMiddleware = ({ url, idp, provider, router, devModeEnabled }) => {

  // 2.3. handle verify phone number submit
  const phoneNumberVerificationTimeoutSeconds = 180;
  router.post("/verify_phone_number", async ctx => {
    const { client, interaction } = ctx.locals as InteractionRequestContext;

    // 'registered' means verifying already registered phone number
    const { registered = false, callback, ...claims } = ctx.request.body;

    idp.validateEmailOrPhoneNumber(claims); // normalize phone number

    // 1. assert user with the phone number
    const user = await idp.find({ claims: { phone_number: claims.phone_number || "" } });
    if (registered && !user) {
      ctx.throw(400, "Not a registered phone number.");
    } else if (!registered && user) {
      ctx.throw(400, "Already registered phone number.");
    }

    // 3. check too much resend
    if (interaction && interaction.result && interaction.result.verifyPhoneNumber) {
      const old = interaction.result.verifyPhoneNumber;

      if (old.phoneNumber === claims.phone_number && old.expiresAt && moment().isBefore(old.expiresAt)) {
        ctx.throw(400, "Cannot resend a message before previous one expires.");
      }
    }

    // 4. create and send code
    const expiresAt = moment().add(phoneNumberVerificationTimeoutSeconds, "s").toISOString();
    const code = Math.floor(Math.random() * 1000000).toString();

    // TODO: send sms via adaptor props

    // 5. extend TTL and store the code
    await interaction.save(moment().isAfter((interaction.exp / 1000) + 60 * 10, "s") ? interaction.exp + 60 * 10 : undefined);
    await provider.interactionResult(ctx.req, ctx.res, {
      ...interaction.result,
      verifyPhoneNumber: {
        phoneNumber: claims.phone_number,
        callback,
        code,
        expiresAt,
      },
    }, {
      mergeWithLastSubmission: true,
    });

    // 5. render with submit, resend endpoint
    return ctx.body = {
      interaction: {
        name: "verify_phone_number",
        action: {
          submit: {
            url: url(`/verify_phone_number_callback`),
            method: "POST",
            data: {
              code: "",
            },
          },
          send: {
            url: url(`/verify_phone_number`),
            method: "POST",
            data: {
              ...ctx.request.body,
            },
          },
        },
        data: {
          phoneNumber: claims.phone_number,
          timeoutSeconds: phoneNumberVerificationTimeoutSeconds,
          ...(devModeEnabled ? { debug: { code } } : {}),
        },
      },
    };
  });

  // 2.4. handle verify_phone_number code submit
  router.post("/verify_phone_number_callback", async ctx => {
    const { client, interaction } = ctx.locals as InteractionRequestContext;
    ctx.assert(interaction && interaction.result.verifyPhoneNumber && interaction.result.verifyPhoneNumber.code, "Phone number verification session has been expired.");

    const { callback, phoneNumber, code, expiresAt } = interaction.result.verifyPhoneNumber;

    // 1. check expiration
    if (!callback || !code || !expiresAt || moment().isAfter(expiresAt)) {
      ctx.throw(400, "Verification code has expired.");
    }

    // 2. check code
    await new Promise(resolve => setTimeout(resolve, 1000)); // prevent brute force attack
    if (ctx.request.body.code !== code) {
      throw new Errors.ValidationError([{
        type: "incorrectVerificationCode",
        field: "code",
        message: `Incorrect verification code.`,
      }]);
    }

    // 3. process callback interaction
    switch (callback) {
      case "login":
        // find user and update identity phone_number_verified
        const user = await idp.findOrFail({ claims: { phone_number: phoneNumber || "" } });
        await user.updateClaims({ phone_number_verified: true }, "phone");

        const login = {
          account: user.id,
          remember: true,
          // acr: string, // acr value for the authentication
          // remember: boolean, // true if provider should use a persistent cookie rather than a session one, defaults to true
          // ts: number, // unix timestamp of the authentication, defaults to now()
        };

        // make it user signed in
        const redirect = await provider.interactionResult(ctx.req, ctx.res, {
          ...interaction.result,
          login,
          verifyPhoneNumber: null,
        }, {
          mergeWithLastSubmission: true,
        });

        // overwrite session
        await provider.setProviderSession(ctx.req, ctx.res, login);

        return ctx.body = { redirect };

      case "register":
        ctx.assert(interaction.result.register && interaction.result.register.claims && interaction.result.register.claims.phone_number);
        const { claims } = interaction.result.register;

        // store verified state
        await provider.interactionResult(ctx.req, ctx.res, {
          ...interaction.result,
          register: {
            ...interaction.result.register,
            claims: {
              ...claims,
              phone_number_verified: true,
            },
          },
          verifyPhoneNumber: null,
        }, {
          mergeWithLastSubmission: true,
        });

        // to complete register
        return ctx.body = {
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

      default:
        ctx.throw(`Unimplemented verify_phone_number_callback: ${callback}`);
    }
  });
};
