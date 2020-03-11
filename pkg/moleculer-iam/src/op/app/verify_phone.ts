import * as _ from "lodash";
import moment from "moment";
import { IAMErrors, Identity } from "../../idp";
import { Logger } from "../../helper/logger";
import { ProviderConfigBuilder } from "../proxy";
import { ApplicationErrors } from "./error";
import { ApplicationBuildOptions } from "./index";

export type IdentityPhoneVerificationArgs = {
  phoneNumber: string;
  secret: string;
  language: string;
  logger: Logger;
}

export type IdentityPhoneVerificationOptions = {
  timeoutSeconds?: number;
  send?(args: IdentityPhoneVerificationArgs): Promise<void>;
}

async function defaultSend({ logger, ...args }: IdentityPhoneVerificationArgs) {
  logger.warn("should implement op.app.verifyPhone.send option to send phone verification message", args);
}

export function buildVerifyPhoneRoutes(builder: ProviderConfigBuilder, opts: ApplicationBuildOptions): void {

  const options = _.defaultsDeep(opts || {}, {
    timeoutSeconds: 180,
    send: defaultSend,
  }) as IdentityPhoneVerificationOptions;

  builder.app.router
    // render
    .get("/verify_phone", ctx => {
      return ctx.op.render("verify_phone");
    })

    // validate phone number
    .post("/verify_phone/check_phone", async ctx => {
      // 'registered' means verifying already registered phone number
      const { registered = false, phone_number = "" } = ctx.request.body;
      const claims = { phone_number };

      ctx.idp.validateEmailOrPhoneNumber(claims); // normalize phone number

      // assert user with the phone number
      const user = await ctx.idp.find({ claims: { phone_number: claims.phone_number || "" } });
      if (registered && !user) {
        throw new IAMErrors.IdentityNotExists();
      } else if (!registered && user) {
        throw new IAMErrors.IdentityAlreadyExists();
      }

      // update session
      if (!ctx.op.sessionPublicState.verifyPhone
        || ctx.op.sessionPublicState.verifyPhone.phoneNumber !== claims.phone_number
        || ctx.op.sessionPublicState.verifyPhone.verified
      ) {
        ctx.op.setSessionPublicState(prevState => ({
          ...prevState,
          verifyPhone: {
            phoneNumber: claims.phone_number,
            registered,
          },
        }));

        ctx.op.setSessionSecretState(prevState => ({
          ...prevState,
          verifyPhone: undefined,
        }));
      }

      return ctx.op.end();
    })

    // send/resend verification code
    .post("/verify_phone/send", async ctx => {
      const { phone_number } = ctx.request.body;
      const claims = { phone_number };

      await ctx.idp.validateEmailOrPhoneNumber(claims); // normalized phone number

      // check too much resend
      const publicState = ctx.op.sessionPublicState;
      if (publicState && publicState.verifyPhone) {
        const verifyState = publicState.verifyPhone;

        if (verifyState.phoneNumber === claims.phone_number && verifyState.expiresAt && moment().isBefore(verifyState.expiresAt)) {
          throw new ApplicationErrors.TooMuchVerificationCodeRequest();
        }
      }

      // create and send code
      const expiresAt = moment().add(options.timeoutSeconds!, "s").toISOString();
      let secret = "";
      for(let i=0; i<6; i++) secret += Math.floor((Math.random()*10)%10).toString();

      // send sms via adapter props
      await options.send!({ logger: builder.logger, language: ctx.locale.language, phoneNumber: claims.phone_number, secret });

      // store the secret
      ctx.op.setSessionSecretState(prev => ({
        ...prev,
        verifyPhone: {
          secret,
        },
      }));

      // store the state
      ctx.op.setSessionPublicState(prevState => ({
        ...prevState,
        verifyPhone: {
          phoneNumber: claims.phone_number,
          expiresAt,
        },

        // show secret on dev
        ...(builder.dev ? ({
          dev: {
            ...prevState.dev,
            verifyPhoneSecret: secret,
          },
        }) : {})
      }));

      return ctx.op.end();
    })

    // verify
    .get("/verify_phone/verify", ctx => {
      if (!ctx.op.sessionPublicState.verifyPhone) {
        return ctx.op.redirect("/verify_phone");
      }
      return ctx.op.render("verify_phone");
    })

    .post("/verify_phone/verify", async ctx => {
      const { phone_number, secret = "", callback = "" } = ctx.request.body;
      const claims = { phone_number };

      await ctx.idp.validateEmailOrPhoneNumber(claims); // normalized phone number

      // check secret
      const publicState = ctx.op.sessionPublicState.verifyPhone || {};
      const secretState = ctx.op.sessionSecretState.verifyPhone || {};
      if (publicState.phoneNumber !== claims.phone_number || moment().isAfter(publicState.expiresAt) || secretState.secret !== secret) {
        throw new ApplicationErrors.InvalidVerificationCode();
      }

      ctx.op.setSessionPublicState(prevState => ({
        ...prevState,
        verifyPhone: {
          ...prevState.verifyPhone,
          verified: true,
        }
      }));

      // update verification state if registered phone number
      let identity: Identity|undefined;
      if (publicState.registered) {
        identity = await ctx.idp.findOrFail({ claims });
        await identity.updateClaims({ phone_number_verified: true });
      }

      // process callback
      switch (callback) {
        case "find_email":
          if (!identity) {
            identity = await ctx.idp.findOrFail({ claims });
          }
          const identityClaims = await ctx.op.getPublicUserProps(identity);
          ctx.op.setSessionPublicState(prevState => ({
            ...prevState,
            findEmail: {
              user: identityClaims,
            },
          }));
          break;
      }

      return ctx.op.end();
    })

    // end
    .get("/verify_phone/end", ctx => {
      if (!ctx.op.sessionPublicState.verifyPhone || !ctx.op.sessionPublicState.verifyPhone.verified) {
        return ctx.op.redirect("/verify_phone");
      }
      return ctx.op.render("verify_phone");
    })
}
