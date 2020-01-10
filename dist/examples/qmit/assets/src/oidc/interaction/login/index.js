"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const __1 = require("../");
const styles_1 = require("../../styles");
/* sub pages */
const password_1 = require("./password");
const find_email_1 = require("./find-email");
const register_1 = require("./register");
const hook_1 = require("../hook");
exports.LoginInteraction = ({ oidc }) => {
    // states
    const context = __1.useOIDCInteractionContext();
    const [email, setEmail] = react_1.useState(oidc.interaction.data.user ? oidc.interaction.data.user.email : oidc.interaction.action.submit.data.email || "");
    const [optionsVisible, setOptionsVisible] = react_1.useState(false);
    const { loading, errors, setLoading, setErrors, withLoading } = hook_1.useWithLoading();
    const federationProviders = oidc.interaction.data.federationProviders;
    // push password page right after mount when user session is alive
    react_1.useEffect(() => {
        if (oidc.interaction.data.user) {
            context.push(<password_1.LoginInteractionEnterPassword oidc={oidc}/>);
        }
    }, []);
    const handleNext = withLoading(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const result = yield __1.requestOIDCInteraction(oidc.interaction.action.submit, {
            email,
        });
        const { error } = result;
        if (error) {
            if (error.status === 422) {
                setErrors(error.detail);
            }
            else {
                setErrors({ email: error.message });
            }
        }
        else {
            context.push(<password_1.LoginInteractionEnterPassword oidc={result}/>);
        }
    }), [email]);
    const handleSignUp = withLoading(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        context.push(<register_1.LoginInteractionRegister oidc={oidc}/>);
    }), []);
    const handleFindEmail = withLoading(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        context.push(<find_email_1.LoginInteractionFindEmail oidc={oidc}/>);
    }), []);
    const handleFederation = withLoading((provider) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield __1.requestOIDCInteraction(oidc.interaction.action.federate, { provider });
    }), []);
    // render
    return (<__1.OIDCInteractionPage title={"Sign in"} subtitle={"Use your plco account"} buttons={[
        {
            primary: true,
            text: "Next",
            onClick: handleNext,
            loading,
            tabIndex: 2,
        },
        {
            text: "Sign up",
            onClick: handleSignUp,
            loading,
            tabIndex: 3,
        },
    ]} error={errors.global} footer={federationProviders.length > 0 ? (<>
            <styles_1.Separator><span style={{ color: styles_1.ThemeStyles.palette.neutralTertiary }}>OR</span></styles_1.Separator>
            {optionsVisible ? (<styles_1.Stack tokens={{ childrenGap: 15 }}>
                {federationProviders.includes("kakao")
        ? <styles_1.PrimaryButton checked={loading} styles={styles_1.ButtonStyles.largeThin} text={"Login with Kakao"} style={{ flex: "1 1 auto", backgroundColor: "#ffdc00", color: "black" }} onClick={() => handleFederation("kakao")}/>
        : null}
                {federationProviders.includes("facebook")
        ? <styles_1.PrimaryButton checked={loading} styles={styles_1.ButtonStyles.largeThin} text={"Login with Facebook"} style={{ flex: "1 1 auto", backgroundColor: "#1876f2", color: "white" }} onClick={() => handleFederation("facebook")}/>
        : null}
                {federationProviders.includes("google")
        ? <styles_1.Link onClick={() => handleFederation("google")} variant="small" style={{ marginTop: "10px", color: styles_1.ThemeStyles.palette.neutralTertiary }}>Login with Google</styles_1.Link>
        : null}
              </styles_1.Stack>) : (<styles_1.Link style={{ color: styles_1.ThemeStyles.palette.neutralTertiary }} onClick={() => setOptionsVisible(true)}>Find more login options?</styles_1.Link>)}
          </>) : undefined}>
      <form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
        <styles_1.TextField label="Email" name="username" type="text" inputMode="email" autoComplete="username" autoCapitalize="off" autoCorrect="off" autoFocus placeholder="Enter your email" tabIndex={1} value={email} errorMessage={errors.email} onChange={(e, v) => setEmail(v || "")} onKeyUp={e => e.key === "Enter" && handleNext()} styles={styles_1.TextFieldStyles.bold}/>
      </form>
      <styles_1.Link onClick={handleFindEmail} tabIndex={5} variant="small" style={{ marginTop: "10px" }}>Forgot email?</styles_1.Link>
    </__1.OIDCInteractionPage>);
};
//# sourceMappingURL=index.js.map