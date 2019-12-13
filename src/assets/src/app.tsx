import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { OIDCInteraction, OIDCInteractionData } from "./oidc/interaction";
import { Stack, Spinner, SpinnerSize, Text, Persona } from "./styles";
import { useUserContextFactory, UserContext, useUserContext } from "./oidc";
import { PersonaSize } from "./oidc/styles";

export const App: React.FunctionComponent = () => {
  // handle global OIDC props
  const oidc: OIDCInteractionData = (window as any).OIDC;
  if (oidc) {
    return <OIDCInteraction oidc={oidc}/>;
  }

  const context = useUserContextFactory();

  return (
    <UserContext.Provider value={context}>
      <UserContextLoadingIndicator>
        <Router>
          <Switch>
            <Route path="/">
              <Text>Here goes account application!</Text>
              <Text>{JSON.stringify(context.user)}</Text>
              <UserContextIcon/>
            </Route>
          </Switch>
        </Router>
      </UserContextLoadingIndicator>
    </UserContext.Provider>
  );
};

const UserContextLoadingIndicator: React.FunctionComponent = ({ children }) => {
  const {loading} = useUserContext();
  return loading ? (
    <Stack
      horizontalAlign="center"
      verticalAlign="center"
      verticalFill
      children={<Spinner size={SpinnerSize.large} label={"Loading..."}/>}
    />
  ) : (
    <>{children}</>
  );
};

const UserContextIcon = () => {
  const {user, signOut, signIn} = useUserContext();
  const persona = user && user.profile
    ? <Persona
      text={user.profile.name}
      secondaryText={user.profile.email}
      imageUrl={user.profile.picture}
      size={PersonaSize.size32}
      onClick={() => signOut()}
    />
    : <Persona
      showUnknownPersonaCoin
      size={PersonaSize.size32}
      onClick={() => signIn({ prompt: "login" })}
    />;

  return <>{persona}</>;
};
