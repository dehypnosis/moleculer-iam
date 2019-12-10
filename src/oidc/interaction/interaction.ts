import Router from "koa-router";
import bodyParser from "koa-bodyparser";
import noCache from "koajs-nocache";
import Validator, { ValidationSchema } from "fastest-validator";
import PhoneNumber from "awesome-phonenumber";
import { Identity, IdentityProvider } from "../../identity";
import { Logger } from "../../logger";
import { KoaContextWithOIDC, Provider, Configuration, Interaction, Client, interactionPolicy } from "../provider";
import { ClientApplicationError, ClientApplicationRenderer } from "./render";
import { getPublicClientProps, getPublicUserProps } from "./util";

/*
* can add more user interactive features (prompts) into base policy which includes login, consent prompts
* INTERACTION:  https://github.com/panva/node-oidc-provider/blob/cd9bbfb653ddfb99c574ea3d4519b6f834274e86/docs/README.md#user-flows
* PROMPT:       https://github.com/panva/node-oidc-provider/tree/master/lib/helpers/interaction_policy/prompts
* ROUTE:        https://github.com/panva/node-oidc-provider/blob/06940e52ec5281d33bac2208fc014ac5ac741d5a/example/routes/koa.js
*/

export type InteractionFactoryProps = {
  idp: IdentityProvider;
  renderer: ClientApplicationRenderer;
  logger: Logger;
};

export type InteractionRequestContext = {
  interaction: Interaction,
  user?: Identity,
  client?: Client,
};

export class InteractionFactory {
  private readonly validator: Validator;
  private readonly router: Router<any, any>;

  constructor(protected readonly props: InteractionFactoryProps) {
    // create router
    this.router = new Router({
      prefix: "/interaction",
      sensitive: true,
      strict: false,
    });

    // apply router middleware
    this.router.use(
      noCache(),
      bodyParser(),
    );

    // create validator
    this.validator = new Validator();
  }

  // validate body with given schema then throw error on error
  private validate(ctx: KoaContextWithOIDC, schema: ValidationSchema) {
    const errors = this.validator.validate(ctx.request.body, schema);
    if (errors !== true && errors.length > 0) {
      const error: ClientApplicationError = {
        name: "validation_failed",
        message: "Failed to validate request params.",
        status: 422,
        detail: errors.reduce((fields, err) => {
          if (!fields[err.field]) fields[err.field] = [];
          const {field, message} = err;
          fields[field].push(message);
          return fields;
        }, {} as any),
        /*
          detail: {
            username: [{"type": "required", "message": "The 'username' field is required.",}],
            ...
          }
         */
      };

      throw error;
    }
  }

  public interactions(): Configuration["interactions"] {
    const {Prompt, Check, base} = interactionPolicy;
    const defaultPrompts = base();
    return {
      async url(ctx, interaction) {
        return `/interaction/${interaction.prompt.name}`;
      },
      policy: [
        // can modify policy and add prompt like: MFA, captcha, ...
        defaultPrompts.get("login"),
        defaultPrompts.get("consent"),
      ],
    };
  }

  /* create interaction routes */
  public routes(provider: Provider) {

    function url(path: string) {
      return `${provider.issuer}/interaction${path}`;
    }

    const {idp, renderer, logger} = this.props;
    const router = this.router;
    const validate = this.validate.bind(this);
    const render = renderer.render.bind(renderer);

    // common action endpoints
    const actions = {
      abort: {
        url: url(`/abort`),
        method: "POST",
        data: {},
      },
    };

    // prepare common data and handle error
    router.use(async (ctx: KoaContextWithOIDC, next) => {
      try {
        // fetch interaction details
        const interaction = await provider.interactionDetails(ctx.req, ctx.res);

        // fetch identity and client
        const user = interaction.session ? (await idp.find(interaction.session!.accountId)) : undefined;
        const client = interaction.params.client_id ? (await provider.Client.find(interaction.params.client_id)) : undefined;
        const locals: InteractionRequestContext = {interaction, user, client};
        ctx.locals = locals;

        await next();
      } catch (error) {
        if (typeof error.status === "undefined" || error.status >= 500) {
          logger.error(error);
        }

        // delegate error handling
        return render(ctx, {error});
      }
    });

    // 1. abort interactions
    router.post("/abort", async ctx => {
      const redirect = await provider.interactionResult(ctx.req, ctx.res, {
        error: "access_denied",
        error_description: "end-user aborted interaction",
      }, {
        mergeWithLastSubmission: false,
      });

      return render(ctx, {
        redirect,
      });
    });

    // 2. handle login
    router.get("/login", async ctx => {
      const {user, client, interaction} = ctx.locals as InteractionRequestContext;

      // already signed in
      if (user && interaction.prompt.name !== "login" && !ctx.request.query.change) {
        const redirect = await provider.interactionResult(ctx.req, ctx.res, {
          // authentication/login prompt got resolved, omit if no authentication happened, i.e. the user
          // cancelled
          login: {
            account: user.id,
            remember: true,
            // acr: string, // acr value for the authentication
            // remember: boolean, // true if provider should use a persistent cookie rather than a session one, defaults to true
            // ts: number, // unix timestamp of the authentication, defaults to now()
          },
        }, {
          mergeWithLastSubmission: true,
        });
        return render(ctx, {redirect});
      }

      return render(ctx, {
        interaction: {
          name: "login",
          action: {
            submit: {
              url: url(`/login`),
              method: "POST",
              data: {
                email: interaction.params.login_hint || "",
              },
            },
            federate: {
              url: url(`/federate`),
              method: "POST",
              data: {
                provider: "", // google, facebook, kakaotalk, ...
              },
              urlencoded: true,
            },
            findEmail: {
              url: url(`/find-email`),
              method: "POST",
              data: {
                phone: "", // mobile phone number
              },
            },
            resetPassword: {
              url: url(`/reset-password`),
              method: "POST",
              data: {
                email: "", // mobile phone number
              },
            },
            register: {
              url: url(`/register`),
              method: "POST",
            },
            ...actions,
          },
          data: {
            user: user && !ctx.request.query.change ? await getPublicUserProps(user) : undefined,
            client: client ? await getPublicClientProps(client) : undefined,
          },
        },
      });
    });

    // 2.1. handle login submit
    router.post("/login", async ctx => {
      const {client, interaction} = ctx.locals as InteractionRequestContext;
      const {email, password} = ctx.request.body;

      // 1. user enter email only
      if (typeof password === "undefined") {

        // 2. server validate email
        validate(ctx, {email: "email"});

        // 3. fetch identity
        // tslint:disable-next-line:no-shadowed-variable
        const user = await idp.findByEmail(email);
        return render(ctx, {
          interaction: {
            name: "login",
            action: {
              submit: {
                url: url(`/login`),
                method: "POST",
                data: {
                  email,
                  password: "",
                },
              },
              ...actions,
            },
            data: {
              user: user ? await getPublicUserProps(user) : undefined,
              client: client ? await getPublicClientProps(client) : undefined,
            },
          },
        });
      }

      // 4. user get the next page and enter password and server validate it
      validate(ctx, {
        email: "email",
        password: "string|empty:false",
      });

      // 5. check account password
      const user = await idp.findByEmail(email);
      await idp.assertCredentials(user, {password});

      // 6. finish interaction and give redirection uri
      const login = {
        account: user.id,
        remember: true,
        // acr: string, // acr value for the authentication
        // remember: boolean, // true if provider should use a persistent cookie rather than a session one, defaults to true
        // ts: number, // unix timestamp of the authentication, defaults to now()
      };

      const redirect = await provider.interactionResult(ctx.req, ctx.res, {
        // authentication/login prompt got resolved, omit if no authentication happened, i.e. the user
        // cancelled
        login,
      }, {
        mergeWithLastSubmission: true,
      });

      // overwrite session for consent -> change account -> login
      await provider.setProviderSession(ctx.req, ctx.res, login);

      return render(ctx, {redirect});
    });

    // 2.2. handle find-email submit
    router.post("/find-email", async ctx => {
      const {user, client, interaction} = ctx.locals as InteractionRequestContext;
      ctx.assert(interaction.prompt.name === "login" || interaction.prompt.name === "consent", "Invalid Request.");

      // 1. validate body
      ctx.request.body.phone = ctx.request.body.phone.replace(/[^0-9+]/g, " ").split(" ").filter((s: string) => !!s).join("");
      let phoneNumber: PhoneNumber;
      validate(ctx, {
        phone: {
          type: "custom",
          types: ["mobile", "fixed-line-or-mobile"],
          check(value, schema) {
            phoneNumber = new PhoneNumber(value, "KR"); // TODO: country code from context
            return phoneNumber.isPossible() && schema.types.includes(phoneNumber.getType()) || [{
              type: "phoneInvalid",
              field: "phone",
              message: `Invalid mobile phone number format.`,
              actual: value,
            }];
          },
        },
      });

      // formatted: +82 10-1234-1234
      const phone = phoneNumber!.getNumber("international");

      // 2. extend TTL and store phone number in session
      await interaction.save(Math.floor(new Date().getTime()/1000) + 60 * 10);

      await provider.interactionResult(ctx.req, ctx.res, {
        verifyPhone: {
          phone,
          callback: "find_email",
          code: null,
          sentAt: null,
        },
      }, {
        mergeWithLastSubmission: true,
      });

      return render(ctx, {
        interaction: {
          name: "find_email",
          action: {
            submit: {
              url: url(`/verify-phone`),
              method: "POST",
            },
          },
          data: {
            phone,
          },
        },
      });
    });

    // 2.3. handle verify phone submit
    const verificationTimeoutSeconds = 180;
    router.post("/verify-phone", async ctx => {
      const {user, client, interaction} = ctx.locals as InteractionRequestContext;
      ctx.assert(interaction && interaction.result.verifyPhone && interaction.result.verifyPhone.phone, "Phone number verification session has been expired.");

      const {callback, phone, code, sentAt} = interaction.result.verifyPhone;

      // 1. check too much resend
      if (sentAt && new Date().getTime() - new Date(sentAt).getTime() < verificationTimeoutSeconds * 1000) {
        ctx.throw("Cannot resend code before previous one expires.", 400);
      }

      // 2. create code
      const newCode = Math.floor(Math.random() * 1000000).toString();

      // TODO: 3. send sms via adaptor props

      // 4. extend TTL and store the code
      await interaction.save(Math.floor(new Date().getTime()/1000) + 60 * 10);

      await provider.interactionResult(ctx.req, ctx.res, {
        verifyPhone: {
          phone,
          callback,
          code: "123123",// newCode,
          sentAt: new Date().toString(),
        },
      }, {
        mergeWithLastSubmission: true,
      });

      // 5. render with submit, resend endpoint
      return render(ctx, {
        interaction: {
          name: "verify_phone",
          action: {
            submit: {
              url: url(`/verify-phone-enter-code`),
              method: "POST",
              data: {
                code: "",
              },
            },
            resend: {
              url: url(`/verify-phone`),
              method: "POST",
            },
          },
          data: {
            phone,
            timeoutSeconds: verificationTimeoutSeconds,
          },
        },
      });
    });

    // 2.4. handle verify phone code submit
    router.post("/verify-phone-enter-code", async ctx => {
      const {client, interaction} = ctx.locals as InteractionRequestContext;
      ctx.assert(interaction && interaction.result.verifyPhone && interaction.result.verifyPhone.code, "Phone number verification session has been expired.");

      const {callback, phone, code, sentAt} = interaction.result.verifyPhone;

      // 1. check expiration
      if (!code || !sentAt || new Date().getTime() - new Date(sentAt).getTime() > verificationTimeoutSeconds * 1000) {
        ctx.throw("Verification code has expired.", 400);
      }

      // 2. check code
      validate(ctx, {
        code: {
          type: "custom",
          check(value) {
            return value === code || [{
              type: "codeIncorrect",
              field: "code",
              message: `Incorrect verification code.`,
              actual: value,
            }];
          },
        },
      });

      // TODO: 3. update identity phone_verified

      // 4. process callback interaction
      switch (callback) {
        case "find_email":
          // make it user signed in
          const user = await idp.findByPhone(phone);
          const redirect = await provider.interactionResult(ctx.req, ctx.res, {
            login: {
              account: user.id,
              remember: true,
              // acr: string, // acr value for the authentication
              // remember: boolean, // true if provider should use a persistent cookie rather than a session one, defaults to true
              // ts: number, // unix timestamp of the authentication, defaults to now()
            },
            verifyPhone: null,
          }, {
            mergeWithLastSubmission: true,
          });
          return render(ctx, {redirect});

        default:
          ctx.throw("unimplemented");
      }
    });

    // 2.5. handle reset password submit
    router.post("/reset-password", async ctx => {
      const {user, client, interaction} = ctx.locals as InteractionRequestContext;
      ctx.assert(user && interaction.prompt.name === "login" || interaction.prompt.name === "consent", "Invalid Request.");

      // TODO: 1. send email with adaptor smtp options
      // console.log(user!.claims());
    });

    // 2.6. handle register submit
    router.post("/register", async ctx => {
      const {user, client, interaction} = ctx.locals as InteractionRequestContext;
      ctx.assert(interaction.prompt.name === "login" || interaction.prompt.name === "consent", "Invalid Request.");

      // extend TTL
      await interaction.save(Math.floor(new Date().getTime()/1000) + 60 * 10);

      return render(ctx, {
        interaction: {
          name: "register",
          action: {
            submit: {
              url: url(`/register`),
              method: "POST",
              data: {
                email: "",
                password: "",
                confirmPassword: "",
              },
            },
          },
        },
      });
    });

    // 3. handle consent
    router.get("/consent", async ctx => {
      const {user, client, interaction} = ctx.locals as InteractionRequestContext;
      ctx.assert(interaction.prompt.name === "consent", "Invalid Request.");

      const data = {
        user: user ? await getPublicUserProps(user) : undefined,
        client: client ? await getPublicClientProps(client) : undefined,
      };

      return render(ctx, {
        interaction: {
          name: "consent",
          action: {
            submit: {
              url: url(`/consent`),
              method: "POST",
              data: {
                rejectedScopes: [], // array of strings, scope names the end-user has not granted
                rejectedClaims: [], // array of strings, claim names the end-user has not granted
              },
            },
            changeAccount: {
              url: url(`/login`),
              method: "GET",
              data: {
                change: true,
              },
              urlencoded: true,
            },
            ...actions,
          },
          data: {
            // client, user
            ...data,

            // consent data (scopes, claims)
            consent: interaction.prompt.details,
          },
        },
      });
    });

    router.post("/consent", async ctx => {
      const {user, client, interaction} = ctx.locals as InteractionRequestContext;
      ctx.assert(interaction.prompt.name === "consent", "Invalid request.");

      // 1. validate body
      validate(ctx, {
        rejectedScopes: {
          type: "array",
          items: "string",
        },
        rejectedClaims: {
          type: "array",
          items: "string",
        },
      });

      // 2. finish interaction and give redirection uri
      const redirect = await provider.interactionResult(ctx.req, ctx.res, {
        // consent was given by the user to the client for this session
        consent: ctx.request.body,
      }, {
        mergeWithLastSubmission: true,
      });
      return render(ctx, {redirect});
    });

    return router.routes();
  }
}
