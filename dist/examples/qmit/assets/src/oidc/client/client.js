"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const _ = tslib_1.__importStar(require("lodash"));
const react_1 = require("react");
const oidc_client_1 = require("oidc-client");
exports.User = oidc_client_1.User;
const defaultChangeLocation = (url) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    if (location.href === url)
        return;
    if (url.startsWith(location.origin) && history.replaceState) {
        history.replaceState(undefined, document.title, url);
    }
    else {
        location.replace(url);
        yield new Promise(() => {
        });
    }
});
exports.UserContext = react_1.createContext({
    loading: false,
    user: undefined,
    signIn: undefined,
    signOut: undefined,
    manage: undefined,
});
exports.useUserContext = () => react_1.useContext(exports.UserContext);
exports.useUserContextFactory = (oidc, options) => {
    const [context, setContext] = react_1.useState({
        loading: true,
        user: undefined,
        signIn: undefined,
        signOut: undefined,
        manage: undefined,
    });
    react_1.useLayoutEffect(() => {
        const { automaticSignIn = false, changeLocation = defaultChangeLocation, } = options || {};
        // ref: https://github.com/IdentityModel/oidc-client-js/wiki
        const client = new oidc_client_1.UserManager(_.defaultsDeep(oidc || {}, {
            authority: window.location.origin,
            client_id: window.location.origin.replace("https://", "").replace("http://", "").replace(":", "-"),
            redirect_uri: window.location.origin,
            post_logout_redirect_uri: window.location.origin,
            response_type: "code",
            response_mode: "fragment",
            prompt: "login consent",
            scope: [...new Set(["openid", "offline_access"].concat(oidc && oidc.scope ? oidc.scope.split(" ").filter(s => !!s) : ["profile", "email", "phone"]))].join(" "),
            loadUserInfo: true,
            automaticSilentRenew: true,
            monitorSession: true,
            checkSessionInterval: 1000,
        }));
        // Log.logger = console;
        const signIn = (opts) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const { redirectTo = location.href, prompt, login_hint, change_account } = opts || {};
            const extraQueryParams = {};
            if (typeof change_account !== "undefined") {
                extraQueryParams.change_account = change_account;
            }
            yield client.signinRedirect({
                state: redirectTo,
                useReplaceToNavigate: false,
                prompt,
                login_hint,
                extraQueryParams,
            });
            yield new Promise(() => {
            });
        });
        const signOut = (opts) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const { redirectTo = location.href } = opts || {};
            yield client.signoutRedirect({ state: redirectTo, useReplaceToNavigate: false });
            yield new Promise(() => {
            });
        });
        const manage = (opts) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const isRemote = location.origin !== client.settings.authority;
            const { newWindow = isRemote } = opts || {};
            const url = client.settings.authority;
            if (newWindow) {
                window.open(url, "_blank");
            }
            else {
                if (history.replaceState && !isRemote) {
                    history.replaceState(undefined, document.title, url);
                }
                else {
                    location.assign(url);
                    yield new Promise(() => {
                    });
                }
            }
        });
        setContext({ loading: true, user: undefined, signIn, signOut, manage });
        // update state on token updated
        client.events.addUserLoaded((user) => {
            setContext(ctx => (Object.assign(Object.assign({}, ctx), { user })));
        });
        client.getUser()
            .then((user) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            // try sign in callback
            if (location.hash && !location.hash.startsWith("#error")) {
                try {
                    user = yield client.signinRedirectCallback();
                    if (user.state) {
                        yield changeLocation(user.state);
                    }
                }
                catch (err) {
                    console.debug("[oidc] signinRedirectCallback:", err);
                }
            }
            else if (user && user.refresh_token) {
                // renew token
                try {
                    user = yield client.signinSilent();
                }
                catch (err) {
                    console.debug("[oidc] signinSilent:", err);
                }
            }
            // try automatic sign in
            if (automaticSignIn && !user) {
                yield signIn(typeof automaticSignIn !== "boolean" ? automaticSignIn : {});
            }
            else {
                // try sign out callback
                try {
                    const signOutResult = yield client.signoutRedirectCallback();
                    if (signOutResult.state) {
                        yield changeLocation(signOutResult.state);
                    }
                }
                catch (err) {
                    console.debug("[oidc] signoutRedirectCallback:", err);
                }
            }
            // clear old states
            yield client.clearStaleState();
            // set loaded user
            setContext(ctx => (Object.assign(Object.assign({}, ctx), { loading: false })));
        }));
    }, []);
    return context;
};
//# sourceMappingURL=client.js.map