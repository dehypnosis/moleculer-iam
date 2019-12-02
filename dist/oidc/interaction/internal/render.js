"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const _ = tslib_1.__importStar(require("lodash"));
const render_1 = require("../render");
const util_1 = require("../util");
exports.renderInternalFlow = (ctx, props) => {
    ctx = ctx;
    const oidc = (ctx.oidc || {});
    const { route = null, client = null, session = null, params } = oidc;
    // get prompt context
    const context = {
        account_id: session && session.account || null,
        client: util_1.getPublicClientProps(client),
        prompt: {
            name: route,
            details: {},
            reasons: [],
        },
        params: _.mapValues(params || {}, value => typeof value === "undefined" ? null : value),
    };
    // fill XSRF token for POST actions
    const xsrf = oidc.session && oidc.session.state && oidc.session.state.secret || undefined;
    if (xsrf) {
        // tslint:disable-next-line:forin
        for (const k in props.action) {
            const action = props.action[k];
            if (action.method === "POST") {
                action.data.xsrf = xsrf;
            }
        }
    }
    return render_1.render(ctx, Object.assign(Object.assign({}, props), { context }));
};
//# sourceMappingURL=render.js.map