import Router, { IMiddleware } from "koa-router";
import bodyParser from "koa-bodyparser";
import noCache from "koajs-nocache";
import Validator, { ValidationSchema } from "fastest-validator";
import PhoneNumber from "awesome-phonenumber";
import { Identity, IdentityProvider } from "../../identity";
import { Logger } from "../../logger";
import { KoaContextWithOIDC, Provider, Configuration, Interaction, Client, interactionPolicy } from "../provider";
import { ClientApplicationError, ClientApplicationRenderer } from "./render";
import { getPublicClientProps, getPublicUserProps } from "./util";
import moment from "moment";

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

    // handle error
    router.use(async (ctx: KoaContextWithOIDC, next) => {
      try {
        await next();
      } catch (error) {
        if (typeof error.status === "undefined" || error.status >= 500) {
          logger.error(error);
        }

        // delegate error handling
        return render(ctx, {error});
      }
    });

    const parseContext: IMiddleware = async (ctx: KoaContextWithOIDC, next) => {
      // fetch interaction details
      const interaction = await provider.interactionDetails(ctx.req, ctx.res);

      // fetch identity and client
      const user = interaction.session ? (await idp.find(interaction.session!.accountId)) : undefined;
      const client = interaction.params.client_id ? (await provider.Client.find(interaction.params.client_id)) : undefined;
      const locals: InteractionRequestContext = {interaction, user, client};
      ctx.locals = locals;

      return next();
    };

    // 1. abort interactions
    router.post("/abort", parseContext, async ctx => {
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
    router.get("/login", parseContext, async ctx => {
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
            resetPassword: {
              url: url(`/verify_email`),
              method: "POST",
              data: {
                email: interaction.params.login_hint || "",
                callback: "reset_password",
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
              url: url(`/verify_phone`),
              method: "POST",
              data: {
                phone: "",
                callback: "login",
                test: true,
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
    router.post("/login", parseContext, async ctx => {
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
              resetPassword: {
                url: url(`/verify_email`),
                method: "POST",
                data: {
                  email,
                  callback: "reset_password",
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

    // 2.3. handle verify phone submit
    const phoneVerificationTimeoutSeconds = 180;
    router.post("/verify_phone", parseContext, async ctx => {
      const {client, interaction} = ctx.locals as InteractionRequestContext;

      // will not send message when 'test'
      const {test = false} = ctx.request.body;

      // 1. validate body
      ctx.request.body.phone = ctx.request.body.phone ? ctx.request.body.phone.replace(/[^0-9+]/g, " ").split(" ").filter((s: string) => !!s).join("") : "";
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

      // now number is formatted like: +82 10-1234-1234
      ctx.request.body.phone = phoneNumber!.getNumber("international");

      // 2. assert user with the phone number
      const {callback, phone} = ctx.request.body;
      const user = await idp.findByPhone(phone);
      if (!user) {
        ctx.throw(400, "Not a registered phone number.");
      }

      // 3. check too much resend
      if (!test && interaction && interaction.result && interaction.result.verifyPhone) {
        const old = interaction.result.verifyPhone;

        if (old.phone === phone && old.expiresAt && moment().isBefore(old.expiresAt)) {
          ctx.throw(400, "Cannot resend a message before previous one expires.");
        }
      }

      // 4. create code
      const expiresAt = moment().add(phoneVerificationTimeoutSeconds, "s").toISOString();
      const code = Math.floor(Math.random() * 1000000).toString();

      if (!test) {
        // TODO: 4. send sms via adaptor props

        // 5. extend TTL and store the code
        await interaction.save(moment().isAfter((interaction.exp/1000) + 60*10, "s") ? interaction.exp + 60*10 : undefined);
        await provider.interactionResult(ctx.req, ctx.res, {
          verifyPhone: {
            phone,
            callback,
            code,
            expiresAt,
          },
        }, {
          mergeWithLastSubmission: true,
        });
      }

      // 5. render with submit, resend endpoint
      return render(ctx, {
        interaction: {
          name: "verify_phone",
          action: {
            submit: {
              url: url(`/verify_phone_callback`),
              method: "POST",
              data: {
                code: "",
              },
            },
            send: {
              url: url(`/verify_phone`),
              method: "POST",
              data: {
                ...ctx.request.body,
                test: false,
              },
            },
          },
          data: {
            phone,
            timeoutSeconds: phoneVerificationTimeoutSeconds,
            // TODO: remove this
            debug: {
              code,
            },
          },
        },
      });
    });

    // 2.4. handle verify_phone code submit
    router.post("/verify_phone_callback", parseContext, async ctx => {
      const {client, interaction} = ctx.locals as InteractionRequestContext;
      ctx.assert(interaction && interaction.result.verifyPhone && interaction.result.verifyPhone.code, "Phone number verification session has been expired.");

      const {callback, phone, code, expiresAt} = interaction.result.verifyPhone;

      // 1. check expiration
      if (!callback || !code || !expiresAt || moment().isAfter(expiresAt)) {
        ctx.throw(400, "Verification code has expired.");
      }

      // 2. check code
      await new Promise(resolve => setTimeout(resolve, 1000)); // prevent brute force attack
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

      // TODO: 3. find user and update identity phone_verified
      const user = await idp.findByPhone(phone);
      ctx.assert(user);

      // 4. process callback interaction
      switch (callback) {
        case "login":
          // make it user signed in
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
          ctx.throw(`Unimplemented verify_phone_callback: ${callback}`);
      }
    });

    // 2.5. handle verify_email submit
    const emailVerificationTimeoutSeconds = 60 * 30;
    router.post("/verify_email", parseContext, async ctx => {
      const {client, interaction} = ctx.locals as InteractionRequestContext;
      ctx.assert(interaction.prompt.name === "login" || interaction.prompt.name === "consent", "Invalid Request.");

      // 1. validate body
      validate(ctx, {
        email: "email",
      });

      // 2. assert user with the email
      const {callback, email} = ctx.request.body;
      const user = await idp.findByEmail(email);
      if (!user) {
        ctx.throw(400, "Not a registered email address.");
      }

      // 3. check too much resend
      if (interaction && interaction.result && interaction.result.verifyEmail) {
        const old = interaction.result.verifyEmail;

        if (old.email === email && old.expiresAt && moment().isBefore(old.expiresAt)) {
          ctx.throw(400, "Cannot resend an email before previous one expires.");
        }
      }

      // 4. create code and link
      const expiresAt = moment().add(emailVerificationTimeoutSeconds, "s").toISOString();
      const payload = {
        email,
        callback,
        user: await getPublicUserProps(user),
        url: `${url("/verify_email_callback")}/${interaction.uid}`,
        expiresAt,
      };

      // TODO: 5. send email which includes (callbackURL) with adaptor props
      console.log(payload);

      // 6. extend TTL and store the state
      await interaction.save(moment().isAfter((interaction.exp/1000) + 60*10, "s") ? interaction.exp + 60*10 : undefined);
      await provider.interactionResult(ctx.req, ctx.res, {
        verifyEmail: {
          callback,
          email,
          expiresAt,
        },
      }, {
        mergeWithLastSubmission: true,
      });

      // 5. render with submit, resend endpoint
      return render(ctx, {
        interaction: {
          name: "verify_email",
          action: {
            resend: {
              url: url(`/verify_email`),
              method: "POST",
              data: ctx.request.body,
            },
          },
          data: {
            email,
            timeoutSeconds: emailVerificationTimeoutSeconds,
            // TODO: remove this
            debug: {
              payload,
            },
          },
        },
      });
    });

    // 2.5. handle verify_email_callback link
    router.get("/verify_email_callback/:interaction_uid", async ctx => {
      // 1. find interaction and check expiration
      const interaction = (await provider.Interaction.find(ctx.params.interaction_uid))!;
      if (!interaction || !interaction.result || !interaction.result.verifyEmail || !interaction.result.verifyEmail.expiresAt || moment().isAfter(interaction.result.verifyEmail.expiresAt)) {
        ctx.throw(400, "This email verification link has expired.");
      }

      // 2. assert user with the email
      const {email, callback} = interaction.result.verifyEmail;
      const user = await idp.findByEmail(email);
      ctx.assert(user);
      // TODO: update identity email_verified as true

      // 3. process callback interaction
      switch (callback) {
        case "reset_password":
          // mark reset password is ready
          interaction.result.resetPassword = {
            email,
          };
          await interaction.save();

          return render(ctx, {
            interaction: {
              name: "reset_password",
              action: {
                submit: {
                  url: url(`/reset_password/${interaction.uid}`),
                  method: "POST",
                  data: {
                    email,
                  },
                },
              },
              data: {
                user: await getPublicUserProps(user),
              },
            },
          });

        default:
          ctx.throw(`Unimplemented verify_email_callback: ${callback}`);
      }
    });

    // 2.6. handle reset_password submit
    router.post("/reset_password/:interaction_uid", async ctx => {
      // 1. find interaction and check is ready to reset password
      const interaction = (await provider.Interaction.find(ctx.params.interaction_uid))!;
      ctx.assert(interaction && interaction.result && interaction.result.resetPassword);

      // 2. assert user with the email
      const user = await idp.findByEmail(interaction.result.resetPassword.email);
      ctx.assert(user);

      // 3. validate and update credentials
      validate(ctx, {
        password: {
          type: "string",
          empty: false,
        },
      });
      await idp.updateCredentials(user, {password: ctx.request.body.password});

      // 4. forget verifyEmail state
      interaction.result.verifyEmail = null;
      await interaction.save();

      // 5. return to initial redirection
      return render(ctx, {
        interaction: {
          name: "reset_password_end",
          action: {},
          data: {
            user: await getPublicUserProps(user),
          },
        },
      });
    });

    // 2.6. handle register submit
    router.post("/register", async ctx => {
      const {user, client, interaction} = ctx.locals as InteractionRequestContext;
      ctx.assert(interaction.prompt.name === "login" || interaction.prompt.name === "consent", "Invalid Request.");

      // extend TTL
      await interaction.save(moment().isAfter((interaction.exp/1000) + 60*30, "s") ? interaction.exp + 60*30 : undefined);

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
