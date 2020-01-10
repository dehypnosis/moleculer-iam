"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const __1 = require("../");
const hook_1 = require("../hook");
exports.ErrorInteraction = ({ title, error }) => {
    const { close, closed } = hook_1.useClose({ tryBack: true });
    return (<__1.OIDCInteractionPage title={title || `Error`} subtitle={error.message} error={closed ? "Cannot close the window, you can close the browser manually." : undefined} buttons={[
        {
            primary: false,
            text: "Cacncel",
            tabIndex: 1,
            onClick: close,
        },
    ]}/>);
};
//# sourceMappingURL=index.js.map