"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const index_1 = require("../index");
const styles_1 = require("../../styles");
/* sub pages */
const register_step2_1 = require("./register-step2");
const hook_1 = require("../hook");
exports.LoginInteractionRegister = ({ oidc }) => {
    // states
    const context = index_1.useOIDCInteractionContext();
    const [payload, setPayload] = react_1.useState(() => ({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    }));
    const [passwordVisible, setPasswordVisible] = react_1.useState(false);
    const { loading, errors, setErrors, withLoading } = hook_1.useWithLoading();
    const handleNext = withLoading(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const result = yield index_1.requestOIDCInteraction(oidc.interaction.action.register, Object.assign({}, payload));
        const { error } = result;
        if (error) {
            if (error.status === 422) {
                setErrors(error.detail);
            }
            else {
                setErrors({ global: error.message });
            }
        }
        else {
            context.push(<register_step2_1.LoginInteractionRegisterStep2 oidc={result}/>);
        }
    }), [payload]);
    const handleCancel = withLoading(() => context.pop(), []);
    // render
    return (<index_1.OIDCInteractionPage title={"Sign up"} subtitle={"Create your plco account"} buttons={[
        {
            primary: true,
            text: "Next",
            onClick: handleNext,
            loading,
            tabIndex: 5,
        },
        {
            text: "Cancel",
            onClick: handleCancel,
            loading,
            tabIndex: 6,
        },
    ]} error={errors.global} footer={<>
          <styles_1.Text>When you sign up as a member, you agree to the <styles_1.Link href="/help/tos" target="_blank">terms of service</styles_1.Link> and the <styles_1.Link href="/help/policy" target="_blank">privacy policy</styles_1.Link>.</styles_1.Text>
        </>}>
      <form onSubmit={(e) => {
        e.preventDefault();
        handleNext();
    }}>
        <styles_1.Stack tokens={{ childrenGap: 15 }}>
          <styles_1.TextField label="Name" type="text" inputMode="text" placeholder="Enter your name" autoFocus tabIndex={1} value={payload.name} errorMessage={errors.name} onChange={(e, v) => setPayload(p => (Object.assign(Object.assign({}, p), { name: v })))} onKeyUp={e => e.key === "Enter" && handleNext()} styles={styles_1.TextFieldStyles.bold}/>
          <styles_1.TextField label="Email" type="text" inputMode="email" placeholder="Enter your email" tabIndex={2} value={payload.email} errorMessage={errors.email} onChange={(e, v) => setPayload(p => (Object.assign(Object.assign({}, p), { email: v })))} onKeyUp={e => e.key === "Enter" && handleNext()} styles={styles_1.TextFieldStyles.bold}/>
          <styles_1.TextField label="Password" type={passwordVisible ? "text" : "password"} inputMode="text" placeholder="Enter your password" iconProps={{ iconName: passwordVisible ? "redEye" : "hide", style: { cursor: "pointer" }, onClick: () => setPasswordVisible(!passwordVisible) }} tabIndex={3} value={payload.password} errorMessage={errors.password} onChange={(e, v) => setPayload(p => (Object.assign(Object.assign({}, p), { password: v })))} onKeyUp={e => e.key === "Enter" && handleNext()} styles={styles_1.TextFieldStyles.bold}/>
          <styles_1.TextField label="Confirm" type="password" inputMode="text" placeholder="Confirm your password" tabIndex={4} value={payload.password_confirmation} errorMessage={errors.password_confirmation} onChange={(e, v) => setPayload(p => (Object.assign(Object.assign({}, p), { password_confirmation: v })))} onKeyUp={e => e.key === "Enter" && handleNext()} styles={styles_1.TextFieldStyles.bold}/>
        </styles_1.Stack>
      </form>
    </index_1.OIDCInteractionPage>);
};
//# sourceMappingURL=register.js.map