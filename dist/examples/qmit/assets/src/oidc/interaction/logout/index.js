"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const __1 = require("../");
const hook_1 = require("../hook");
exports.LogoutInteraction = ({ oidc }) => {
    // states
    const { loading, withLoading, errors, setErrors } = hook_1.useWithLoading();
    const handleConfirm = withLoading(() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield __1.requestOIDCInteraction(Object.assign({}, oidc.interaction.action.submit));
    }), []);
    const { closed, close } = hook_1.useClose({ tryBack: true });
    const { user, client } = oidc.interaction.data;
    return (<__1.OIDCInteractionPage title={`Signed out`} subtitle={client ? `You has been signed out from ${client.name}. Do you want to sign out from plco account too?` : `Do you want to sign out from plco account?`} buttons={[
        {
            primary: true,
            text: "Yes",
            onClick: handleConfirm,
            loading,
        },
        {
            text: "No",
            onClick: close,
            loading,
            tabIndex: 2,
        },
    ]} error={errors.global || closed && "Cannot close the window, you can close the browser manually."}>
    </__1.OIDCInteractionPage>);
};
//# sourceMappingURL=index.js.map