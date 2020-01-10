"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const __1 = require("../");
const styles_1 = require("../../styles");
const hook_1 = require("../hook");
const verify_phone_number_1 = require("./verify-phone-number");
exports.LoginInteractionFindEmail = ({ oidc }) => {
    // states
    const context = __1.useOIDCInteractionContext();
    const [phoneNumber, setPhoneNumber] = react_1.useState("");
    const { loading, errors, setErrors, withLoading } = hook_1.useWithLoading();
    const handleNext = withLoading(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const result = yield __1.requestOIDCInteraction(oidc.interaction.action.findEmail, {
            phone_number: phoneNumber,
        });
        const { error } = result;
        if (error) {
            if (error.status === 422) {
                setErrors(error.detail);
            }
            else {
                setErrors({ phone_number: error.message });
            }
        }
        else {
            context.push(<verify_phone_number_1.LoginInteractionVerifyPhoneNumber oidc={result}/>);
        }
    }), [phoneNumber]);
    const handleCancel = withLoading(() => context.pop(), []);
    // render
    return (<__1.OIDCInteractionPage title={`Find your email`} subtitle={`Enter your phone number`} buttons={[
        {
            primary: true,
            text: "Next",
            onClick: handleNext,
            loading,
            tabIndex: 2,
        },
        {
            text: "Cancel",
            onClick: handleCancel,
            loading,
            tabIndex: 3,
        },
    ]} error={errors.global}>
      <styles_1.Text>
        Do you have a registered phone number? You can find your ID if you have one.
      </styles_1.Text>
      <styles_1.TextField label="Phone number" type="tel" inputMode="tel" placeholder="Enter your mobile phone number" autoFocus tabIndex={1} value={phoneNumber} errorMessage={errors.phone_number} onChange={(e, v) => setPhoneNumber(v || "")} onKeyUp={e => e.key === "Enter" && handleNext()} styles={styles_1.TextFieldStyles.bold}/>
    </__1.OIDCInteractionPage>);
};
//# sourceMappingURL=find-email.js.map