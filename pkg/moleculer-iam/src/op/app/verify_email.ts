import * as _ from "lodash";
import moment from "moment";
import { IAMErrors, Identity } from "../../idp";
import { Logger } from "../../lib/logger";
import { ProviderConfigBuilder } from "../proxy";
import { ApplicationErrors } from "./error";
import { ApplicationBuildOptions } from "./index";

export type IdentityEmailVerificationArgs = {
  email: string;
  secret: string;
  language: string;
  region: string;
  logger: Logger;
}

export type IdentityEmailVerificationOptions = {
  timeoutSeconds?: number;
  send?(args: IdentityEmailVerificationArgs): Promise<void>;
}

async function defaultSend({ logger, ...args }: IdentityEmailVerificationArgs) {
  logger.warn("should implement op.app.verifyEmail.send option to send email verification mail", args);
}

export function buildVerifyEmailRoutes(builder: ProviderConfigBuilder, opts: ApplicationBuildOptions): void {

  const options = _.defaultsDeep(opts || {}, {
    timeoutSeconds: 180,
    send: defaultSend,
  }) as IdentityEmailVerificationOptions;

  builder.app.router
    // render
    .get("/verify_email", ctx => {
      return ctx.op.render("verify_email");
    })

    // validate email
    .post("/verify_email/check_email", async ctx => {
      // 'registered' means verifying already registered email
      const { registered = false, email = "" } = ctx.request.body;
      const claims = { email };

      ctx.idp.validateEmailOrPhoneNumber(claims); // normalize email

      // assert user with the email
      const user = await ctx.idp.find({ claims: { email: claims.email || "" } });
      if (registered && !user) {
        throw new IAMErrors.IdentityNotExists();
      } else if (!registered && user) {
        throw new IAMErrors.IdentityAlreadyExists();
      }

      // update session
      if (!ctx.op.sessionPublicState.verifyEmail
        || ctx.op.sessionPublicState.verifyEmail.email !== claims.email
        || ctx.op.sessionPublicState.verifyEmail.verified
      ) {
        ctx.op.setSessionPublicState(prevState => ({
          ...prevState,
          verifyEmail: {
            email: claims.email,
            registered,
          },
        }));

        ctx.op.setSessionSecretState(prevState => ({
          ...prevState,
          verifyEmail: undefined,
        }));
      }

      return ctx.op.end();
    })

    // send/resend verification code
    .post("/verify_email/send", async ctx => {
      const { email } = ctx.request.body;
      const claims = { email };

      await ctx.idp.validateEmailOrPhoneNumber(claims); // normalized email

      // check too much resend
      const publicState = ctx.op.sessionPublicState;
      if (publicState && publicState.verifyEmail) {
        const verifyState = publicState.verifyEmail;

        if (verifyState.email === claims.email && verifyState.expiresAt && moment().isBefore(verifyState.expiresAt)) {
          throw new ApplicationErrors.TooMuchVerificationCodeRequest();
        }
      }

      // create and send code
      const expiresAt = moment().add(options.timeoutSeconds!, "s").toISOString();
      let secret = "";
      for(let i=0; i<6; i++) secret += Math.floor((Math.random()*10)%10).toString();

      // send email via adapter props
      await options.send!({ logger: builder.logger, language: ctx.locale.language, region: ctx.locale.region, email: claims.email, secret });

      // store the secret
      ctx.op.setSessionSecretState(prev => ({
        ...prev,
        verifyEmail: {
          secret,
        },
      }));

      // store the state
      ctx.op.setSessionPublicState(prevState => ({
        ...prevState,
        verifyEmail: {
          email: claims.email,
          expiresAt,
        },

        // show secret on dev
        ...(builder.dev ? ({
          dev: {
            ...prevState.dev,
            verifyEmailSecret: secret,
          },
        }) : {})
      }));

      return ctx.op.end();
    })

    // verify
    .get("/verify_email/verify", ctx => {
      if (!ctx.op.sessionPublicState.verifyEmail) {
        return ctx.op.redirect("/verify_email");
      }
      return ctx.op.render("verify_email");
    })

    .post("/verify_email/verify", async ctx => {
      const { email, secret = "", callback = "" } = ctx.request.body;
      const claims = { email };

      await ctx.idp.validateEmailOrPhoneNumber(claims); // normalized email

      // check secret
      const publicState = ctx.op.sessionPublicState.verifyEmail || {};
      const secretState = ctx.op.sessionSecretState.verifyEmail || {};
      if (publicState.email !== claims.email || moment().isAfter(publicState.expiresAt) || secretState.secret !== secret) {
        throw new ApplicationErrors.InvalidVerificationCode();
      }

      ctx.op.setSessionPublicState(prevState => ({
        ...prevState,
        verifyEmail: {
          ...prevState.verifyEmail,
          verified: true,
        }
      }));

      // update verification state if registered email
      let identity: Identity|undefined;
      if (publicState.registered) {
        identity = await ctx.idp.findOrFail({ claims });
        await identity.updateClaims({ email_verified: true });
      }

      // process callback
      switch (callback) {
        case "reset_password":
          if (!identity) {
            identity = await ctx.idp.findOrFail({ claims });
          }
          const expiresAt = moment().add(options.timeoutSeconds!, "s").toISOString();
          const identityClaims = await ctx.op.getPublicUserProps(identity);
          ctx.op.setSessionPublicState(prevState => ({
            ...prevState,
            resetPassword: {
              user: identityClaims,
              expiresAt,
            },
          }));
          break;
      }

      return ctx.op.end();
    })

    // end
    .get("/verify_email/end", ctx => {
      if (!ctx.op.sessionPublicState.verifyEmail || !ctx.op.sessionPublicState.verifyEmail.verified) {
        return ctx.op.redirect("/verify_email");
      }
      return ctx.op.render("verify_email");
    })
}
