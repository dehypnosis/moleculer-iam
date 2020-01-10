"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const index_1 = require("../index");
const styles_1 = require("../../styles");
/* sub pages */
const hook_1 = require("../hook");
exports.LoginInteractionRegisterComplete = ({ oidc }) => {
    // states
    const context = index_1.useOIDCInteractionContext();
    const { loading, errors, setErrors, withLoading } = hook_1.useWithLoading();
    const handleNext = withLoading(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const { redirect } = oidc;
        if (redirect) {
            window.location.assign(redirect);
            yield new Promise(() => { });
        }
        else {
            console.error("stuck to handle interaction:", oidc);
        }
    }), []);
    // render
    const { email } = oidc.interaction.data;
    return (<index_1.OIDCInteractionPage title={"Congratulations"} subtitle={email} buttons={[
        {
            primary: true,
            text: "Let's go",
            onClick: handleNext,
            loading,
            autoFocus: true,
            tabIndex: 1,
        },
    ]} error={errors.global}>
      <styles_1.Text>From now on, you can use all of the services of plco with this single ID. So don't forget it please. 🙂</styles_1.Text>
    </index_1.OIDCInteractionPage>);
};
//# sourceMappingURL=register-complete.js.map