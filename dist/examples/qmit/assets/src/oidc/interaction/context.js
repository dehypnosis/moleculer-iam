"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const styles_1 = require("../styles");
exports.OIDCInteractionContext = react_1.default.createContext({
    pop: (num = 1) => { },
    push: (...pages) => { },
    animation: styles_1.AnimationStyles.slideLeftIn40,
    key: 0,
    size: 0,
});
exports.useOIDCInteractionContext = () => react_1.useContext(exports.OIDCInteractionContext);
function requestOIDCInteraction(action, mergeData = {}) {
    const { url, method, data = {}, urlencoded = false } = action;
    const payload = Object.assign(Object.assign({}, data), mergeData);
    // as application/x-www-form-urlencoded
    if (urlencoded) {
        const form = document.createElement("form");
        form.action = url;
        form.method = method;
        form.style.display = "none";
        // tslint:disable-next-line:forin
        for (const k in payload) {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = k;
            input.value = payload[k];
            form.appendChild(input);
        }
        document.body.appendChild(form);
        form.submit();
        return new Promise(resolve => { });
    }
    // as ajax
    return fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json;charset=UTF-8",
        },
        body: method !== "GET" ? JSON.stringify(payload) : undefined,
        credentials: "same-origin",
    })
        .then(res => {
        return res.json()
            .catch((error) => {
            if (res.status >= 400)
                return { error: { name: res.statusText, message: res.statusText, } };
            return { error };
        });
    });
}
exports.requestOIDCInteraction = requestOIDCInteraction;
//# sourceMappingURL=context.js.map