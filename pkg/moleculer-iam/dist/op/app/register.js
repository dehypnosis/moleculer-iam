"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const _ = tslib_1.__importStar(require("lodash"));
function buildRegisterRoutes(builder, opts) {
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
        const { scope = [], claims = {}, credentials = {} } = ctx.request.body;
        const payload = {
            scope: filterScopes(scope),
            claims: filterClaims(claims),
            credentials,
        };
        await ctx.idp.validate(payload);
        return payload;
    }
    builder.app.router
        // initial render page
        .get("/register", async (ctx) => {
        // create empty object into register state
        if (!ctx.op.sessionPublicState.register) {
            ctx.op.setSessionPublicState(prevState => ({
                ...prevState,
                register: {},
            }));
        }
        return ctx.op.render("register");
    })
        // redirect to initial render page
        .get("/register/detail", async (ctx) => {
        const state = ctx.op.sessionPublicState.register;
        if (!(state && state.claims && state.claims.email)) {
            return ctx.op.redirect("/register");
        }
        return ctx.op.render("register");
    })
        // redirect to initial render page
        .get("/register/end", async (ctx) => {
        if (!ctx.op.sessionPublicState.registered) {
            return ctx.op.redirect("/register");
        }
        return ctx.op.render("register");
    })
        // validate claims and credentials
        .post("/register/submit", async (ctx) => {
        const payload = await validatePayload(ctx);
        // store the current payload
        if (!ctx.request.body.register) {
            ctx.op.setSessionPublicState(prevState => ({
                ...prevState,
                register: payload,
            }));
            return ctx.op.end();
        }
        // create account
        const { claims = {}, credentials = {}, scope = [] } = payload;
        const state = ctx.op.sessionPublicState;
        if (state.verifyEmail && state.verifyEmail.email === payload.claims.email && state.verifyEmail.verified) {
            claims.email_verified = true;
        }
        if (state.verifyPhone && state.verifyPhone.phoneNumber === payload.claims.phone_number && state.verifyPhone.verified) {
            claims.phone_number_verified = true;
        }
        const user = await ctx.idp.create({
            metadata: {},
            claims,
            credentials,
            scope,
        });
        // reset session state
        const userClaims = await ctx.op.getPublicUserProps(user);
        ctx.op.setSessionPublicState(prevState => ({
            ...prevState,
            register: {},
            registered: {
                id: user.id,
                ...userClaims,
            },
        }));
        return ctx.op.end();
    })
        // easy sign in for just registered user
        .post("/register/login", async (ctx) => {
        ctx.assert(!!ctx.op.sessionPublicState.registered);
        ctx.op.assertPrompt(["login", "consent"]);
        const userClaims = ctx.op.sessionPublicState.registered;
        ctx.op.setSessionPublicState(prevState => ({
            ...prevState,
            registered: undefined,
        }));
        return ctx.op.redirectWithUpdate({
            login: {
                account: userClaims.id,
                remember: true,
            },
        });
    });
}
exports.buildRegisterRoutes = buildRegisterRoutes;
//# sourceMappingURL=register.js.map