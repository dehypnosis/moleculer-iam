import React from "react";
import { useNavigation, useAppState, useWithLoading, useClose } from "../hook";
import { ScreenLayout, Text, Persona } from "./component";

export const FindEmailEndScreen: React.FunctionComponent = () => {
  // states
  const [state] = useAppState();

  // handlers
  const { nav } = useNavigation();
  const { loading, withLoading } = useWithLoading();
  const [handleLogin, handleLoginLoading] = withLoading(() => {
    nav.navigate("login.stack", {
      screen: "login.index",
      params: {
        email: state.session.findEmail.user.email,
      },
    });
  }, [state]);

  const { closed, close } = useClose(false);

  // render
  return (
    <ScreenLayout
      title={`Find your account`}
      subtitle={`With mobile phone`}
      loading={loading || closed}
      error={closed ? "Please close the window manually." : undefined}
      buttons={[
        {
          hidden: !state.routes.login,
          status: "primary",
          children: "Sign in",
          tabIndex: 210,
          onPress: handleLogin,
          loading: handleLoginLoading,
        },
        {
          hidden: !!state.routes.login,
          tabIndex: 211,
          children: "Close",
          onPress: close,
          loading: closed,
        },
      ]}
    >
      <Persona {...state.session.findEmail.user}/>
      <Text style={{marginTop: 30}}>
        Found your account.
      </Text>
    </ScreenLayout>
  );
};
