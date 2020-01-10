"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const __1 = require("../");
const styles_1 = require("../../styles");
const hook_1 = require("../hook");
exports.ResetPasswordInteractionEnd = ({ oidc }) => {
    const { close, closed } = hook_1.useClose();
    // render
    const { user } = oidc.interaction.data;
    return (<__1.OIDCInteractionPage title={`Reset Password`} subtitle={user.email} error={closed ? "Cannot close the window, you can close the browser manually." : undefined} buttons={[
        {
            primary: true,
            text: "Close",
            onClick: close,
            tabIndex: 2,
        },
    ]}>
      <styles_1.Text>
        Account credential has been updated.
      </styles_1.Text>
    </__1.OIDCInteractionPage>);
};
//# sourceMappingURL=reset-password-end.js.map