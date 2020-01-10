"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const __1 = require("../");
const styles_1 = require("../../styles");
const hook_1 = require("../hook");
const verify_phone_number_svg_1 = tslib_1.__importDefault(require("./verify-phone-number.svg"));
const verify_phone_number_enter_code_1 = require("./verify-phone-number-enter-code");
exports.LoginInteractionVerifyPhoneNumber = ({ oidc }) => {
    // states
    const context = __1.useOIDCInteractionContext();
    const { loading, errors, setErrors, withLoading } = hook_1.useWithLoading();
    // props
    const { phoneNumber } = oidc.interaction.data;
    // handlers
    const handleSend = withLoading(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const result = yield __1.requestOIDCInteraction(oidc.interaction.action.send);
        const { error, interaction } = result;
        if (error) {
            if (error.status === 422) {
                setErrors(error.detail);
            }
            else {
                setErrors({ global: error.message });
            }
        }
        else {
            console.log(interaction);
            context.push(<verify_phone_number_enter_code_1.LoginInteractionVerifyPhoneNumberEnterCode oidc={result}/>);
        }
    }), []);
    const handleCancel = withLoading(() => context.pop(), []);
    // render
    return (<__1.OIDCInteractionPage title={`Verify your phone number`} subtitle={phoneNumber} buttons={[
        {
            primary: true,
            text: "Send",
            onClick: handleSend,
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
        To make sure the phone number is yours, we will send a text message with a verification code.
      </styles_1.Text>
      <styles_1.Image src={verify_phone_number_svg_1.default} styles={{ root: { minHeight: "270px" }, image: { width: "100%" } }}/>
    </__1.OIDCInteractionPage>);
};
//# sourceMappingURL=verify-phone-number.js.map