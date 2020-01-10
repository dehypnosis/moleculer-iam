"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const __1 = require("../");
const styles_1 = require("../../styles");
const hook_1 = require("../hook");
/* sub-pages */
const register_complete_1 = require("./register-complete");
exports.LoginInteractionVerifyPhoneNumberEnterCode = ({ oidc }) => {
    // states
    const context = __1.useOIDCInteractionContext();
    const { loading, errors, setErrors, withLoading } = hook_1.useWithLoading();
    const [code, setCode] = react_1.useState("");
    // props
    const { phoneNumber, timeoutSeconds } = oidc.interaction.data;
    const [remainingSeconds, setRemainingSeconds] = react_1.useState(timeoutSeconds);
    // update timeout
    react_1.useEffect(() => {
        if (remainingSeconds === 0)
            return;
        setTimeout(() => {
            setRemainingSeconds(remainingSeconds - 1);
        }, 1000);
    }, [remainingSeconds]);
    // handlers
    const handleVerify = withLoading(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const result = yield __1.requestOIDCInteraction(oidc.interaction.action.submit, {
            code,
        });
        const { error, redirect, interaction } = result;
        if (error) {
            if (error.status === 422) {
                setErrors(error.detail);
            }
            else {
                setErrors({ code: error.message });
            }
        }
        else if (redirect) {
            window.location.assign(redirect);
            yield new Promise(() => {
            });
        }
        else if (interaction) {
            const result2 = yield __1.requestOIDCInteraction(interaction.action.submit);
            // tslint:disable-next-line:no-shadowed-variable
            const { error, redirect } = result2;
            if (error) {
                setErrors({ global: error.message });
            }
            else if (redirect) {
                context.push(<register_complete_1.LoginInteractionRegisterComplete oidc={result2}/>);
            }
            else {
                console.error("stuck to handle interaction:", result2);
            }
        }
        else {
            console.error("stuck to handle interaction:", result);
        }
    }), [code]);
    const handleResend = withLoading(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const result = yield __1.requestOIDCInteraction(oidc.interaction.action.send);
        const { error, interaction } = result;
        console.log(interaction);
        if (error) {
            setErrors({ code: error.message });
        }
        else {
            setRemainingSeconds(interaction.data.timeoutSeconds);
        }
    }), []);
    const handleCancel = withLoading(() => context.pop(2), []);
    // render
    return (<__1.OIDCInteractionPage title={`Verify your phone number`} subtitle={phoneNumber} buttons={[
        {
            primary: true,
            text: "Verify",
            onClick: handleVerify,
            loading,
            tabIndex: 2,
        },
        {
            text: "Resend",
            onClick: handleResend,
            loading,
            tabIndex: 3,
        },
        {
            text: "Cancel",
            onClick: handleCancel,
            loading,
            tabIndex: 4,
        },
    ]} error={errors.global}>
      <styles_1.Text>
        Enter the received 6-digit verification code.
      </styles_1.Text>
      <styles_1.TextField label="Verification code" type="tel" inputMode="tel" placeholder="Enter the verification code" autoFocus tabIndex={1} value={code} errorMessage={errors.code} description={`${(Math.floor(remainingSeconds / 60)).toString().padStart(2, "0")}:${(remainingSeconds % 60).toString().padStart(2, "0")}`} onChange={(e, v) => setCode(v || "")} onKeyUp={e => e.key === "Enter" && handleVerify()} styles={styles_1.TextFieldStyles.bold}/>
    </__1.OIDCInteractionPage>);
};
//# sourceMappingURL=verify-phone-number-enter-code.js.map