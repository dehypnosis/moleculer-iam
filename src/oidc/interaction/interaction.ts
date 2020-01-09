import Router, { IMiddleware } from "koa-router";
import bodyParser from "koa-bodyparser";
import noCache from "koajs-nocache";
import moment from "moment";
import { Identity, IdentityProvider } from "../../identity";
import { Logger } from "../../logger";
import { KoaContextWithOIDC, Provider, Configuration, Interaction, Client, interactionPolicy } from "../provider";
import { ClientApplicationError, ClientApplicationRenderer } from "./app";
import { getPublicClientProps, getPublicUserProps } from "./util";
import { Errors } from "../../identity/error";
import { IdentityFederationManager, IdentityFederationManagerOptions } from "./federation";

/*
* can add more user interactive features (prompts) into base policy which includes login, consent prompts
* INTERACTION:  https://github.com/panva/node-oidc-provider/blob/cd9bbfb653ddfb99c574ea3d4519b6f834274e86/docs/README.md#user-flows
* PROMPT:       https://github.com/panva/node-oidc-provider/tree/master/lib/helpers/interaction_policy/prompts
* ROUTE:        https://github.com/panva/node-oidc-provider/blob/06940e52ec5281d33bac2208fc014ac5ac741d5a/example/routes/koa.js
*/

/*
TODO: refactor all this mess into the IDP methods
 */

export type InteractionFactoryProps = {
  idp: IdentityProvider;
  app: ClientApplicationRenderer;
  logger: Logger;
};

export type InteractionFactoryOptions = {
  federation: IdentityFederationManagerOptions;
  devModeEnabled?: boolean;
};

export type InteractionRequestContext = {
  interaction: Interaction,
  user?: Identity,
  client?: Client,
};

export class InteractionFactory {
  private readonly router: Router<any, any>;

  constructor(protected readonly props: InteractionFactoryProps, protected readonly opts: Partial<InteractionFactoryOptions> = {}) {
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

    const {idp, app, logger} = this.props;
    const router = this.router;
    const render = app.render.bind(app);

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
      } catch (err) {
        let error: any;
        if (err instanceof Errors.ValidationError) {
          error = {
            name: err.error,
            message: err.error_description,
            status: 422,
            detail: err.fields.reduce((fields, e) => {
              const {field, message} = e;
              if (!fields[field]) {
                fields[field] = [];
              }
              fields[field].push(message);
              return fields;
            }, {} as { [fieldName: string]: string[] }),
            /*
              detail: {
                username: [{"type": "required", "message": "The 'username' field is required.",}],
                ...
              }
             */
          } as ClientApplicationError;
        } else if (err instanceof Errors.IdentityProviderError) {
          error = {
            name: err.error,
            message: err.error_description,
            status: err.status || err.statusCode,
            detail: err.error_detail,
          } as ClientApplicationError;
        } else {
          error = err;
          logger.error(error);
        }

        // delegate error handling
        return render(ctx, {error});
      }
    });

    const parseContext: IMiddleware = async (ctx: any, next) => {
      // fetch interaction details
      const interaction = await provider.interactionDetails(ctx.req, ctx.res);

      // fetch identity and client
      const user = interaction.session && interaction.session.accountId ? (await idp.findOrFail({id: interaction.session.accountId})) : undefined;
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
      const changeAccount = ctx.request.query.change_account || (interaction.params.change_account === true || interaction.params.change_account === "true" || interaction.params.change_account === 1);
      const autoLogin = !changeAccount && user && interaction.prompt.name !== "login";
      if (autoLogin) {
        const login = {
          account: user!.id,
          remember: true,
        };

        const redirect = await provider.interactionResult(ctx.req, ctx.res, {
          ...interaction.result,
          login,
        }, {
          mergeWithLastSubmission: true,
        });

        // overwrite session
        await provider.setProviderSession(ctx.req, ctx.res, login);

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
              url: url(`/verify_phone_number`),
              method: "POST",
              data: {
                phone_number: "",
                callback: "login",
                registered: true,
              },
            },
            register: {
              url: url(`/register`),
              method: "POST",
              data: {
                name: "",
                email: "",
                password: "",
                password_confirmation: "",
              },
            },
            ...actions,
          },
          data: {
            user: user && !changeAccount ? await getPublicUserProps(user!) : undefined,
            client: client ? await getPublicClientProps(client) : undefined,
            federationProviders: federation.availableProviders,
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

        // 2. fetch identity
        // tslint:disable-next-line:no-shadowed-variable
        const user = await idp.findOrFail({claims: {email: email || ""}});
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

      // 4. check account and password
      const user = await idp.findOrFail({claims: {email: email || ""}});
      if (!await user.assertCredentials({password: password || ""})) {
        throw new Errors.InvalidCredentialsError();
      }

      // 6. finish interaction and give redirection uri
      const login = {
        account: user.id,
        remember: true,
        // acr: string, // acr value for the authentication
        // remember: boolean, // true if provider should use a persistent cookie rather than a session one, defaults to true
        // ts: number, // unix timestamp of the authentication, defaults to now()
      };

      const redirect = await provider.interactionResult(ctx.req, ctx.res, {
        ...interaction.result,
        login,
      }, {
        mergeWithLastSubmission: true,
      });

      // overwrite session for consent -> change account -> login
      await provider.setProviderSession(ctx.req, ctx.res, login);

      return render(ctx, {redirect});
    });

    // 2.3. handle verify phone number submit
    const phoneNumberVerificationTimeoutSeconds = 180;
    router.post("/verify_phone_number", parseContext, async ctx => {
      const {client, interaction} = ctx.locals as InteractionRequestContext;

      // 'registered' means verifying already registered phone number
      const {registered = false, callback, ...claims} = ctx.request.body;

      idp.validateEmailOrPhoneNumber(claims); // normalize phone number

      // 1. assert user with the phone number
      const user = await idp.find({claims: {phone_number: claims.phone_number || ""}});
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
      return render(ctx, {
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
            ...(this.opts.devModeEnabled ? {debug: {code}} : {}),
          },
        },
      });
    });

    // 2.4. handle verify_phone_number code submit
    router.post("/verify_phone_number_callback", parseContext, async ctx => {
      const {client, interaction} = ctx.locals as InteractionRequestContext;
      ctx.assert(interaction && interaction.result.verifyPhoneNumber && interaction.result.verifyPhoneNumber.code, "Phone number verification session has been expired.");

      const {callback, phoneNumber, code, expiresAt} = interaction.result.verifyPhoneNumber;

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
          const user = await idp.findOrFail({claims: {phone_number: phoneNumber || ""}});
          await user.updateClaims({phone_number_verified: true}, "phone");

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

          return render(ctx, {redirect});

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
          return render(ctx, {
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
          });

        default:
          ctx.throw(`Unimplemented verify_phone_number_callback: ${callback}`);
      }
    });

    // 2.5. handle verify_email submit
    const emailVerificationTimeoutSeconds = 60 * 30;
    router.post("/verify_email", parseContext, async ctx => {
      const {client, interaction} = ctx.locals as InteractionRequestContext;
      ctx.assert(interaction.prompt.name === "login" || interaction.prompt.name === "consent", "Invalid Request.");

      // 2. assert user with the email
      const {callback, email} = ctx.request.body;
      const user = await idp.find({claims: {email: email || ""}});
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
        user: await getPublicUserProps(user as Identity),
        url: `${url("/verify_email_callback")}/${interaction.uid}`,
        expiresAt,
      };

      // TODO: 5. send email which includes (callbackURL) with adaptor props
      console.log(payload);

      // 6. extend TTL and store the state
      await interaction.save(moment().isAfter((interaction.exp / 1000) + 60 * 10, "s") ? interaction.exp + 60 * 10 : undefined);
      await provider.interactionResult(ctx.req, ctx.res, {
        ...interaction.result,
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
            send: {
              url: url(`/verify_email`),
              method: "POST",
              data: ctx.request.body,
            },
          },
          data: {
            email,
            timeoutSeconds: emailVerificationTimeoutSeconds,
            ...(this.opts.devModeEnabled ? {debug: {payload}} : {}),
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
      const user = await idp.findOrFail({claims: {email: email || ""}});

      // 3. update identity email_verified as true
      await user.updateClaims({email_verified: true}, "email");

      // 4. process callback interaction
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
      const user = await idp.findOrFail({claims: {email: interaction.result.resetPassword.email || ""}});
      ctx.assert(user);

      // 3. validate and update credentials
      const updated = await user.updateCredentials({password: ctx.request.body.password || ""});
      if (!updated) {
        throw new Errors.UnexpectedError("credentials has not been updated.");
      }

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

    // 2.7. handle register submit
    router.post("/register", parseContext, async ctx => {
      const {client, interaction} = ctx.locals as InteractionRequestContext;
      ctx.assert(interaction.prompt.name === "login" || interaction.prompt.name === "consent", "Invalid Request.");

      // 1. extend TTL
      await interaction.save(moment().isAfter((interaction.exp / 1000) + 60 * 30, "s") ? interaction.exp + 60 * 30 : undefined);

      // 2. enter email, name, password, password_confirmation
      if (!interaction.result || !interaction.result.register || interaction.result.register.email || typeof ctx.request.body.email !== "undefined") {
        // 2.1. assert user not exists
        const user = await idp.find({claims: {email: ctx.request.body.email || ""}});
        if (user) {
          throw new Errors.IdentityAlreadyExistsError();
        }

        // 2.2. validate claims
        const {email, name, password, password_confirmation} = ctx.request.body;
        // tslint:disable-next-line:no-shadowed-variable
        const claims = {email, name};
        // tslint:disable-next-line:no-shadowed-variable
        const credentials = {password, password_confirmation};
        await idp.validate({scope: ["email", "profile"], claims, credentials});

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

        return render(ctx, {
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
        });
      }

      ctx.assert(interaction.result.register);

      // 3. enter phone_number, birthdate, gender
      // tslint:disable-next-line:prefer-const
      let {claims, credentials} = interaction.result.register;
      if (!claims.birthdate || !claims.gender || typeof ctx.request.body.birthdate !== "undefined") {
        // 3.1. validate claims
        const {phone_number, birthdate, gender} = ctx.request.body;
        claims = {...claims, birthdate, gender};
        if (phone_number) {
          const user = await idp.find({claims: {phone_number}});
          if (user) {
            throw new Errors.ValidationError([{
              type: "duplicatePhoneNumber",
              field: "phone_number",
              message: `Already registered phone number.`,
            }]);
          }
          claims.phone_number = phone_number;
        }
        await idp.validate({scope: ["email", "profile", "birthdate", "gender"].concat(phone_number ? ["phone"] : []), claims, credentials});

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
        return render(ctx, {
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
        });
      }

      // 4. finish registration
      let redirect: string|undefined;
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

        // TODO: 5. send email which includes (email verification link) with adaptor props
      }

      return render(ctx, {
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
      });
    });

    // 2.8. handle federation
    const federation = new IdentityFederationManager({
      logger,
      idp,
      callbackURL: providerName => url(`/federate/${providerName}`),
    }, this.opts.federation);

    router.post("/federate", parseContext, async (ctx, next) => {
      const {user, client, interaction} = ctx.locals as InteractionRequestContext;
      ctx.assert(interaction.prompt.name === "login" || interaction.prompt.name === "consent", "Invalid Request.");

      await federation.request(ctx.request.body.provider, ctx, next);
    });

    router.get("/federate/:provider", parseContext, async (ctx, next) => {
      const {user, client, interaction} = ctx.locals as InteractionRequestContext;
      ctx.assert(interaction.prompt.name === "login" || interaction.prompt.name === "consent", "Invalid Request.");

      const federatedUser = await federation.callback(ctx.params.provider, ctx, next);
      if (!federatedUser) {
        throw new Errors.IdentityNotExistsError();
      }

      const login = {
        account: federatedUser.id,
        remember: true,
        // acr: string, // acr value for the authentication
        // remember: boolean, // true if provider should use a persistent cookie rather than a session one, defaults to true
        // ts: number, // unix timestamp of the authentication, defaults to now()
      };

      // make user signed in
      const redirect = await provider.interactionResult(ctx.req, ctx.res, {
        ...interaction.result,
        login,
      });

      // overwrite session
      await provider.setProviderSession(ctx.req, ctx.res, login);

      await render(ctx, {redirect});
    });

    // 3. handle consent
    router.get("/consent", parseContext, async ctx => {
      const {user, client, interaction} = ctx.locals as InteractionRequestContext;
      ctx.assert(interaction.prompt.name === "consent", "Invalid Request.");

      // 1. skip consent if client has such property
      if (client && client.skip_consent) {
        const redirect = await provider.interactionResult(ctx.req, ctx.res, {
          ...interaction.result,
          // consent was given by the user to the client for this session
          consent: {
            rejectedScopes: [],
            rejectedClaims: [],
            replace: true,
          },
        }, {
          mergeWithLastSubmission: true,
        });
        return render(ctx, {redirect});
      }

      // 2. or render consent form
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
                replace: true,
              },
            },
            changeAccount: {
              url: url(`/login`),
              method: "GET",
              data: {
                change_account: true,
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

    router.post("/consent", parseContext, async ctx => {
      const {user, client, interaction} = ctx.locals as InteractionRequestContext;
      ctx.assert(interaction.prompt.name === "consent", "Invalid request.");

      // 1. validate body
      // validate(ctx, {
      //   rejectedScopes: {
      //     type: "array",
      //     items: "string",
      //   },
      //   rejectedClaims: {
      //     type: "array",
      //     items: "string",
      //   },
      // });

      // 2. finish interaction and give redirection uri
      const redirect = await provider.interactionResult(ctx.req, ctx.res, {
        ...interaction.result,
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
