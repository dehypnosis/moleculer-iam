import * as _ from "lodash";
import moment from "moment";
import { Logger } from "../../logger";
import { ProviderConfigBuilder } from "../proxy";
import { InteractionBuildOptions } from "./bootstrap";
import { InteractionActionEndpointGroups } from "./routes";

export type IdentityPhoneVerificationSendArgs = {
  phoneNumber: string;
  secret: string;
  language: string;
  logger: Logger;
}

export type IdentityPhoneVerificationOptions = {
  timeoutSeconds?: number;
  send?(args: IdentityPhoneVerificationSendArgs): Promise<void>;
}

async function defaultSend({ logger, ...args }: IdentityPhoneVerificationSendArgs) {
  logger.warn("should implement op.interaction.verifyPhone.send option to send phone verification message", args);
}

export function buildVerifyPhoneRoutes(builder: ProviderConfigBuilder, opts: InteractionBuildOptions, actions: InteractionActionEndpointGroups): void {

  const { timeoutSeconds, send } = _.defaultsDeep(opts || {}, {
    timeoutSeconds: 180,
    send: defaultSend,
  }) as IdentityPhoneVerificationOptions;

  builder.interaction.router
    // send/resend verification code
    .post("/verify_phone/send", async ctx => {
      const { session, setSessionState } = ctx.op;

      // if 'register' is true, should try registration with 'register' payload after verification
      // else if 'login' is true, should try login after verification
      const { register, login, phone_number } = ctx.request.body;
      const claims = { phone_number };

      await ctx.idp.validateEmailOrPhoneNumber(claims);
      const phoneNumber = claims.phone_number;  // normalized phone number

      // assert user with the phone number
      const user = await ctx.idp.find({ claims: { phone_number: phoneNumber || "" } });
      if (!register && !user) {
        ctx.throw(400, "Not a registered phone number.");
      } else if (register && user) {
        ctx.throw(400, "Already registered phone number.");
      }

      // check too much resend
      if (session.state && session.state.phoneVerification) {
        const state = session.state.phoneVerification;

        if (state.phoneNumber === phoneNumber && state.expiresAt && moment().isBefore(state.expiresAt)) {
          ctx.throw(400, "Cannot resend a phone verification code until previous one expires.");
        }
      }

      // create and send code
      const expiresAt = moment().add(timeoutSeconds!, "s").toISOString();
      const secret = Math.floor(Math.random() * 1000000).toString();

      // send sms via adapter props
      await send!({ logger: builder.logger, language: ctx.locale.language, phoneNumber, secret });

      // store the state and secret
      await setSessionState(prevState => ({
        ...prevState,
        phoneVerification: {
          phoneNumber,
          secret,
          register,
          login,
          expiresAt,
        },
      }));

      return ctx.body = {
        phone_number: phoneNumber,
        timeout_seconds: timeoutSeconds,
        register,
        login,
        ...(builder.dev ? { debug: { secret } } : {}),
      };
    })
}
