"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const __1 = require("../");
const styles_1 = require("../../styles");
const hook_1 = require("../hook");
const reset_password_sent_svg_1 = tslib_1.__importDefault(require("./reset-password-sent.svg"));
exports.LoginInteractionResetPasswordSent = ({ oidc }) => {
    // states
    const context = __1.useOIDCInteractionContext();
    const { loading, errors, setErrors, withLoading } = hook_1.useWithLoading();
    // props
    const { email, timeoutSeconds } = oidc.interaction.data;
    // handlers
    const handleDone = withLoading(() => context.pop(2), []);
    // render
    return (<__1.OIDCInteractionPage title={`An email has been sent to`} subtitle={email} buttons={[
        {
            primary: true,
            text: "Done",
            onClick: handleDone,
            loading,
            tabIndex: 2,
        },
    ]} error={errors.global}>
      <styles_1.Text>
        You could check the email to set a new password within {Math.floor(timeoutSeconds / 60)} minutes.
      </styles_1.Text>
      <styles_1.Image src={reset_password_sent_svg_1.default} styles={{ root: { minHeight: "270px" }, image: { width: "100%" } }}/>
    </__1.OIDCInteractionPage>);
};
//# sourceMappingURL=reset-password-sent.js.map