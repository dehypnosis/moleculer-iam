"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
const interaction_1 = require("./oidc/interaction");
const styles_1 = require("./styles");
const oidc_1 = require("./oidc");
exports.App = () => {
    // handle global OIDC props
    const oidc = window.OIDC;
    if (oidc) {
        return <interaction_1.OIDCInteraction oidc={oidc}/>;
    }
    const context = oidc_1.useUserContextFactory({
        authority: location.origin === "http://localhost:9191" ? "http://localhost:9090" : location.origin,
        client_id: (location.origin === "http://localhost:9191" ? "http://localhost:9090" : location.origin).replace("https://", "").replace("http://", "").replace(":", "-"),
    }, {
        automaticSignIn: !(location.pathname.startsWith("/help/") || location.pathname === "/help"),
    });
    return (<oidc_1.UserContext.Provider value={context}>
      <oidc_1.UserContextLoadingIndicator>
        <react_router_dom_1.BrowserRouter>
          <react_router_dom_1.Switch>
            <react_router_dom_1.Route path="/">
              <div style={{ textAlign: "right" }}>
                <oidc_1.UserContextMenu hideManageAccount items={({ user, signIn }) => user ? [
        {
            key: "account",
            itemType: styles_1.ContextualMenuItemType.Header,
            text: "Account",
        },
        {
            key: "change-account",
            text: "Change Account",
            iconProps: {
                iconName: "UserSync",
            },
            onClick: () => { signIn({ change_account: true }); },
        },
        {
            key: "setting",
            text: "Setting",
            iconProps: {
                iconName: "Settings",
            },
        },
    ] : []}/>
              </div>
              <styles_1.Text>Here goes account application!</styles_1.Text>
              <styles_1.Text>{JSON.stringify(context.user)}</styles_1.Text>
            </react_router_dom_1.Route>
          </react_router_dom_1.Switch>
        </react_router_dom_1.BrowserRouter>
      </oidc_1.UserContextLoadingIndicator>
    </oidc_1.UserContext.Provider>);
};
//# sourceMappingURL=app.js.map