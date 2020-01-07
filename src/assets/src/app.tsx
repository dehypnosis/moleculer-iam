import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { OIDCInteraction, OIDCInteractionData } from "./oidc/interaction";
import { ContextualMenuItemType, Spinner, SpinnerSize, Stack, Text, } from "./styles";
import { UserContext, UserContextLoadingIndicator, useUserContext, useUserContextFactory, UserContextMenu } from "./oidc";

export const App: React.FunctionComponent = () => {
  // handle global OIDC props
  const oidc: OIDCInteractionData = (window as any).OIDC;
  if (oidc) {
    return <OIDCInteraction oidc={oidc}/>;
  }

  const context = useUserContextFactory({
    authority: location.origin === "http://localhost:9191" ? "http://localhost:9090" : location.origin,
    client_id: (location.origin === "http://localhost:9191" ? "http://localhost:9090" : location.origin).replace("https://", "").replace("http://", "").replace(":", "-"),
  }, {
    automaticSignIn: !(location.pathname.startsWith("/help/") || location.pathname === "/help"),
  });

  return (
    <UserContext.Provider value={context}>
      <UserContextLoadingIndicator>
        <Router>
          <Switch>
            <Route path="/">
              <div style={{ textAlign: "right"}}>
                <UserContextMenu
                  hideManageAccount
                  items={({ user, signIn }) => user ? [
                    {
                      key: "account",
                      itemType: ContextualMenuItemType.Header,
                      text: "Account",
                    },
                    {
                      key: "change-account",
                      text: "Change Account",
                      iconProps: {
                        iconName: "UserSync",
                      },
                      onClick: () => { signIn({change_account: true}); },
                    },
                    {
                      key: "setting",
                      text: "Setting",
                      iconProps: {
                        iconName: "Settings",
                      },
                    },
                  ] : []}
                />
              </div>
              <Text>Here goes account application!</Text>
              <Text>{JSON.stringify(context.user)}</Text>
            </Route>
          </Switch>
        </Router>
      </UserContextLoadingIndicator>
    </UserContext.Provider>
  );
};
