"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const _ = tslib_1.__importStar(require("lodash"));
const moment_1 = tslib_1.__importDefault(require("moment"));
async function defaultSend({ logger, ...args }) {
    logger.warn("should implement op.interaction.verifyPhone.send option to send phone verification message", args);
}
function buildVerifyPhoneRoutes(builder, opts, actions) {
    const { timeoutSeconds, send } = _.defaultsDeep(opts || {}, {
        timeoutSeconds: 180,
        send: defaultSend,
    });
    builder.interaction.router
        // send/resend verification code
        .post("/verify_phone/send", async (ctx) => {
        const { session, setSessionState } = ctx.op;
        // if 'register' is true, should try registration with 'register' payload after verification
        // else if 'login' is true, should try login after verification
        const { register, login, phone_number } = ctx.request.body;
        const claims = { phone_number };
        await ctx.idp.validateEmailOrPhoneNumber(claims);
        const phoneNumber = claims.phone_number; // normalized phone number
        // assert user with the phone number
        const user = await ctx.idp.find({ claims: { phone_number: phoneNumber || "" } });
        if (!register && !user) {
            ctx.throw(400, "Not a registered phone number.");
        }
        else if (register && user) {
            ctx.throw(400, "Already registered phone number.");
        }
        // check too much resend
        if (session.state && session.state.phoneVerification) {
            const state = session.state.phoneVerification;
            if (state.phoneNumber === phoneNumber && state.expiresAt && moment_1.default().isBefore(state.expiresAt)) {
                ctx.throw(400, "Cannot resend a phone verification code until previous one expires.");
            }
        }
        // create and send code
        const expiresAt = moment_1.default().add(timeoutSeconds, "s").toISOString();
        const secret = Math.floor(Math.random() * 1000000).toString();
        // send sms via adapter props
        await send({ logger: builder.logger, language: ctx.locale.language, phoneNumber, secret });
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
    });
}
exports.buildVerifyPhoneRoutes = buildVerifyPhoneRoutes;
//# sourceMappingURL=routes.verify_phone.js.map