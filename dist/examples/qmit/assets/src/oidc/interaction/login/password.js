"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const __1 = require("../");
const styles_1 = require("../../styles");
const hook_1 = require("../hook");
const reset_password_1 = require("./reset-password");
exports.LoginInteractionEnterPassword = ({ oidc }) => {
    // states
    const context = __1.useOIDCInteractionContext();
    const [password, setPassword] = react_1.useState("");
    const { loading, errors, setErrors, withLoading } = hook_1.useWithLoading();
    const handleLogin = withLoading(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const result = yield __1.requestOIDCInteraction(oidc.interaction.action.submit, {
            email: oidc.interaction.data.user.email,
            password,
        });
        const { error, redirect } = result;
        if (error) {
            if (error.status === 422) {
                setErrors(error.detail);
            }
            else {
                setErrors({ password: error.message });
            }
        }
        else if (redirect) {
            window.location.assign(redirect);
            yield new Promise(() => { });
        }
        else {
            console.error("stuck to handle interaction:", oidc);
        }
    }), [password]);
    const handleResetPassword = withLoading(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        context.push(<reset_password_1.LoginInteractionResetPassword oidc={oidc}/>);
    }), []);
    // render
    const { user, client } = oidc.interaction.data;
    return (<__1.OIDCInteractionPage title={`Hi, ${user.name}`} subtitle={user.email} buttons={[
        {
            primary: true,
            text: "Login",
            onClick: handleLogin,
            loading,
            tabIndex: 2,
        },
        {
            text: "Cancel",
            onClick: () => context.pop(),
            tabIndex: 3,
        },
    ]} error={errors.global}>
      <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
        <input type="text" name="username" value={user.email} style={{ display: "none" }} readOnly/>
        <styles_1.TextField label="Password" autoComplete="password" name="password" type="password" inputMode="text" placeholder="Enter your password" autoFocus tabIndex={1} value={password} errorMessage={errors.password} onChange={(e, v) => setPassword(v || "")} onKeyUp={e => e.key === "Enter" && handleLogin()} styles={styles_1.TextFieldStyles.bold}/>
      </form>
      <styles_1.Link tabIndex={4} onClick={handleResetPassword} variant="small" style={{ marginTop: "10px" }}>Forgot password?</styles_1.Link>
    </__1.OIDCInteractionPage>);
};
//# sourceMappingURL=password.js.map