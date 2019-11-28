"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Provider = tslib_1.__importStar(require("../provider"));
const { Prompt, Check, base } = Provider.interactionPolicy;
/*
* add more user interactive features (prompts) into base policy which includes login, consent prompts
* example ref (base): https://github.com/panva/node-oidc-provider/tree/master/lib/helpers/interaction_policy/prompts

* example route mappings (original default)
get('interaction', '/interaction/:uid', error(this), ...interaction.render);
post('submit', '/interaction/:uid', error(this), ...interaction.submit);
get('abort', '/interaction/:uid/abort', error(this), ...interaction.abort);

* each route handlers
https://github.com/panva/node-oidc-provider/blob/8fb8af509c652b13620534cc755cf5b9320f694f/lib/actions/interaction.js

* related views
https://github.com/panva/node-oidc-provider/blob/master/lib/views/layout.js
*/
const defaultPrompts = base();
exports.interactions = {
    url(ctx, interaction) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return `/interaction/${ctx.oidc.uid}`;
        });
    },
    // ref: https://github.com/panva/node-oidc-provider/blob/cd9bbfb653ddfb99c574ea3d4519b6f834274e86/docs/README.md#user-flows
    // ... here goes more interactions
    policy: [
        defaultPrompts.get("login"),
        defaultPrompts.get("consent"),
    ],
};
//# sourceMappingURL=interaction.js.map