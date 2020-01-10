"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const __1 = require("../");
const styles_1 = require("../../styles");
const hook_1 = require("../hook");
const reset_password_svg_1 = tslib_1.__importDefault(require("./reset-password.svg"));
const reset_password_sent_1 = require("./reset-password-sent");
exports.LoginInteractionResetPassword = ({ oidc }) => {
    // states
    const context = __1.useOIDCInteractionContext();
    const { loading, errors, setErrors, withLoading } = hook_1.useWithLoading();
    // props
    const { user, client } = oidc.interaction.data;
    // handlers
    const handleSend = withLoading(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const result = yield __1.requestOIDCInteraction(oidc.interaction.action.resetPassword, {
            email: user.email,
        });
        // done...
        const { error, interaction } = result;
        if (error) {
            setErrors({ global: error.message });
        }
        else {
            // request to send automatically
            console.log(interaction);
            context.push(<reset_password_sent_1.LoginInteractionResetPasswordSent oidc={result}/>);
        }
    }), []);
    const handleCancel = withLoading(() => context.pop(), []);
    // render
    return (<__1.OIDCInteractionPage title={`Reset your password`} subtitle={user.email} buttons={[
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
        We will send an email with a link to guide you to reset your password.
      </styles_1.Text>
      <styles_1.Image src={reset_password_svg_1.default} styles={{ root: { minHeight: "270px" }, image: { width: "100%" } }}/>
    </__1.OIDCInteractionPage>);
};
//# sourceMappingURL=reset-password.js.map