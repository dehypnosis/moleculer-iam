"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const _ = tslib_1.__importStar(require("lodash"));
function buildRegisterRoutes(builder, opts, actions) {
    const { allowedScopes, forbiddenClaims } = _.defaultsDeep(opts.register || {}, {
        allowedScopes: ["email", "profile", "birthdate", "gender", "phone"],
        forbiddenClaims: ["email_verified", "phone_number_verified"],
    });
    function filterClaims(claims) {
        const filteredClaims = {};
        for (const [k, v] of Object.entries(claims)) {
            if (!forbiddenClaims.includes(k)) {
                filteredClaims[k] = v;
            }
        }
        return filteredClaims;
    }
    function filterScopes(scopes) {
        const filteredScopes = [];
        for (const s of scopes) {
            if (allowedScopes.includes(s)) {
                filteredScopes.push(s);
            }
        }
        return filteredScopes;
    }
    async function validatePayload(ctx) {
        const { scope = [], claims = {}, credentials } = ctx.request.body;
        const payload = {
            scope: filterScopes(scope),
            claims: filterClaims(claims),
            credentials,
        };
        await ctx.idp.validate(payload);
        return payload;
    }
    builder.interaction.router
        // redirect to initial render page
        .get("/register/:any+", async (ctx) => {
        return ctx.op.render({
            redirect: ctx.op.url("/register") + (ctx.search || ""),
        });
    })
        // initial render page
        .get("/register", async (ctx) => {
        const { session, setSessionState } = ctx.op;
        if (!session.state || !session.state.register) {
            await setSessionState(prevState => ({
                ...prevState,
                register: {},
            }));
        }
        const payload = session.state.register;
        return ctx.op.render({
            interaction: {
                name: "register",
                actions: actions.register,
                data: {
                    ...payload,
                    mandatoryScopes: ctx.idp.claims.mandatoryScopes,
                },
            },
        });
    })
        // validate claims and credentials
        .post("/register/validate", async (ctx) => {
        const { session, setSessionState } = ctx.op;
        ctx.assert(session.state && session.state.register);
        const payload = await validatePayload(ctx);
        await setSessionState(prevState => ({
            ...prevState,
            register: payload,
        }));
        ctx.body = payload;
    });
}
exports.buildRegisterRoutes = buildRegisterRoutes;
//# sourceMappingURL=routes.register.js.map