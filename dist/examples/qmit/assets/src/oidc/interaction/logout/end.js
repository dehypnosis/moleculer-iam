"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const __1 = require("../");
const hook_1 = require("../hook");
exports.LogoutEndInteraction = ({ oidc }) => {
    const { closed, close } = hook_1.useClose();
    return (<__1.OIDCInteractionPage title={`Signed out`} subtitle={"You has been signed out from plco successfully"} error={closed ? "Cannot close the window, you can close the browser manually." : undefined} buttons={[
        {
            primary: false,
            text: "Close",
            onClick: close,
        },
    ]}/>);
};
//# sourceMappingURL=end.js.map