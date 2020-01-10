"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const client_1 = require("./client");
const styles_1 = require("../styles");
exports.UserContextLoadingIndicator = ({ children, spinner = {
    size: styles_1.SpinnerSize.large,
    label: "Loading...",
}, }) => {
    const { loading } = client_1.useUserContext();
    return loading ? (<styles_1.Stack horizontalAlign="center" verticalAlign="center" verticalFill children={<styles_1.Spinner {...spinner}/>}/>) : (<>{children}</>);
};
//# sourceMappingURL=loading.js.map