"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const koa_router_1 = tslib_1.__importDefault(require("koa-router"));
const render_1 = require("./render");
const util_1 = require("./util");
// ref: https://github.com/panva/node-oidc-provider/blob/cd9bbfb653ddfb99c574ea3d4519b6f834274e86/docs/README.md#user-flows
exports.createInteractionRouter = (provider) => {
    const router = new koa_router_1.default({
        prefix: "/interaction",
        sensitive: true,
        strict: false,
    });
    function urlFor(path) {
        return `${provider.issuer}/interaction${path}`;
    }
    function getPublicClientPropsById(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const client = id ? yield provider.Client.find(id) : undefined;
            if (!client) {
                return undefined;
            }
            return util_1.getPublicClientProps(client);
        });
    }
    function getInteractionContext(ctx) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { uid, prompt, params, session } = yield provider.interactionDetails(ctx.req, ctx.res);
            return {
                interaction_id: uid,
                account_id: session && session.accountId || undefined,
                client: yield getPublicClientPropsById(params.client_id),
                prompt,
                params,
            };
        });
    }
    // abort any interaction
    router.delete("/:id", (ctx) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const result = {
            error: "access_denied",
            error_description: "end-user aborted interaction",
        };
        yield provider.interactionFinished(ctx.req, ctx.res, result, {
            mergeWithLastSubmission: false,
        });
    }));
    // process each type of interactions
    router.post("/:id", (ctx) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const context = yield getInteractionContext(ctx);
        switch (context.prompt.name) {
            case "login":
                break;
            case "consent":
                break;
            default:
                ctx.throw("not implemented");
        }
    }));
    // render application for all others
    router.get("*", (ctx) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const context = yield getInteractionContext(ctx);
        // create form data format
        const submitFormData = {};
        switch (context.prompt.name) {
            case "login":
                submitFormData.username = context.params.login_hint || "";
                submitFormData.password = "";
                break;
            case "consent":
                break;
            default:
        }
        render_1.render(ctx, {
            context,
            action: {
                submit: {
                    url: urlFor(`/${context.interaction_id}`),
                    method: "POST",
                    data: submitFormData,
                },
                abort: {
                    url: urlFor(`/${context.interaction_id}`),
                    method: "DELETE",
                    data: {},
                },
            },
        });
    }));
    return router;
};
// module.exports = function devInteractions(provider) {
//   /* eslint-disable no-multi-str */
//   attention.warn('a quick start development-only feature devInteractions is enabled, \
// you are expected to disable these interactions and provide your own');
//
//   const configuration = instance(provider).configuration('interactions');
//
//   /* istanbul ignore if */
//   if (configuration.url !== defaultInteractionUri) {
//     attention.warn('you\'ve configured your own interactions.url but devInteractions are still enabled, \
// your configuration is not in effect');
//   }
//   /* eslint-enable */
//
//   instance(provider).configuration('interactions').url = async function interactionUrl(ctx) {
//     return url.parse(ctx.oidc.urlFor('interaction', { uid: ctx.oidc.uid })).pathname;
//   };
//
//   return {
//     render: [
//       noCache,
//       async function interactionRender(ctx, next) {
//         const {
//           uid, prompt, params, session,
//         } = await provider.interactionDetails(ctx.req, ctx.res);
//         const client = await provider.Client.find(params.client_id);
//
//         let view;
//         let title;
//
//         switch (prompt.name) {
//           case 'login':
//             view = 'login';
//             title = 'Sign-in';
//             break;
//           case 'consent':
//             view = 'interaction';
//             title = 'Authorize';
//             break;
//           default:
//             ctx.throw(501, 'not implemented');
//         }
//
//         const locals = {
//           client,
//           uid,
//           abortUrl: ctx.oidc.urlFor('abort', { uid }),
//           submitUrl: ctx.oidc.urlFor('submit', { uid }),
//           details: prompt.details,
//           prompt: prompt.name,
//           params,
//           title,
//           session: session ? dbg(session) : undefined,
//           dbg: {
//             params: dbg(params),
//             prompt: dbg(prompt),
//           },
//         };
//
//         locals.body = views[view](locals);
//
//         ctx.type = 'html';
//         ctx.body = views.layout(locals);
//
//         await next();
//       },
//     ],
//     abort: [
//       noCache,
//       function interactionAbort(ctx) {
//         const result = {
//           error: 'access_denied',
//           error_description: 'End-User aborted interaction',
//         };
//
//         return provider.interactionFinished(ctx.req, ctx.res, result, {
//           mergeWithLastSubmission: false,
//         });
//       },
//     ],
//     submit: [
//       noCache,
//       parseBody,
//       async function interactionSubmit(ctx, next) {
//         ctx.oidc.uid = ctx.params.uid;
//         const { prompt: { name } } = await provider.interactionDetails(ctx.req, ctx.res);
//         switch (ctx.oidc.body.prompt) { // eslint-disable-line default-case
//           case 'login': {
//             assert.equal(name, 'login');
//             await provider.interactionFinished(ctx.req, ctx.res, {
//               login: { account: ctx.oidc.body.login },
//             }, { mergeWithLastSubmission: false });
//             break;
//           }
//           case 'consent': {
//             assert.equal(name, 'consent');
//             const result = { consent: {} };
//             await provider.interactionFinished(ctx.req, ctx.res, result, {
//               mergeWithLastSubmission: true,
//             });
//             break;
//           }
//           /* istanbul ignore next */
//           default:
//             ctx.throw(501, 'not implemented');
//         }
//
//         await next();
//       },
//     ],
//   };
// };
//# sourceMappingURL=router.js.map