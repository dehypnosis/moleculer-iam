"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const __1 = require("../");
const styles_1 = require("../../styles");
const hook_1 = require("../hook");
const reset_password_end_1 = require("./reset-password-end");
exports.ResetPasswordInteraction = ({ oidc }) => {
    // states
    const context = __1.useOIDCInteractionContext();
    const [password, setPassword] = react_1.useState("");
    const { loading, errors, setErrors, withLoading } = hook_1.useWithLoading();
    const handleSubmit = withLoading(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const result = yield __1.requestOIDCInteraction(oidc.interaction.action.submit, {
            email: oidc.interaction.data.user.email,
            password,
        });
        const { error, interaction } = result;
        if (error) {
            if (error.status === 422) {
                setErrors(error.detail);
            }
            else {
                setErrors({ password: error.message });
            }
        }
        else if (interaction) {
            context.push(<reset_password_end_1.ResetPasswordInteractionEnd oidc={oidc}/>);
        }
        else {
            console.error("stuck to handle interaction:", oidc);
        }
    }), [password]);
    // render
    const { user } = oidc.interaction.data;
    return (<__1.OIDCInteractionPage title={`Reset Password`} subtitle={user.email} buttons={[
        {
            primary: true,
            text: "Done",
            onClick: handleSubmit,
            loading,
            tabIndex: 2,
        },
    ]} error={errors.global}>
      <styles_1.Text>
        Set a new password for your plco account.
      </styles_1.Text>
      <styles_1.TextField label="Password" type="password" inputMode="text" placeholder="Enter new password" autoFocus tabIndex={1} value={password} errorMessage={errors.password} onChange={(e, v) => setPassword(v || "")} onKeyUp={e => e.key === "Enter" && handleSubmit()} styles={styles_1.TextFieldStyles.bold}/>
    </__1.OIDCInteractionPage>);
};
//# sourceMappingURL=reset-password-set.js.map