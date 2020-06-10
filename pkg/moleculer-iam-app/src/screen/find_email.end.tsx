import React from "react";
import { useNavigation, useAppState, useWithLoading, useClose, useAppI18N } from "../hook";
import { ScreenLayout, Text, Persona } from "../component";

export const FindEmailEndScreen: React.FunctionComponent = () => {
  // states
  const [state] = useAppState();
  const { formatMessage: f } = useAppI18N();

  // handlers
  const { nav } = useNavigation();
  const { loading, withLoading } = useWithLoading();
  const [handleLogin, handleLoginLoading] = withLoading(() => {
    nav.navigate("login.index", {
      email: state.session.findEmail.user.email,
    });
  }, [state]);

  const { closed, close } = useClose(false);

  // render
  return (
    <ScreenLayout
      title={f({id: "findEmail.findYourAccount"})}
      subtitle={f({id: "findEmail.byPhone"})}
      loading={loading || closed}
      error={closed ? f({id: "error.cannotClose"}) : undefined}
      buttons={[
        {
          hidden: !state.routes.login,
          status: "primary",
          children: f({id: "button.signIn"}),
          tabIndex: 210,
          onPress: handleLogin,
          loading: handleLoginLoading,
        },
        {
          hidden: !!state.routes.login,
          tabIndex: 211,
          children: f({id: "button.close"}),
          onPress: close,
          loading: closed,
        },
      ]}
    >
      <Persona {...state.session.findEmail.user}/>
      <Text style={{marginTop: 30}}>
        {f({id: "findEmail.foundYourAccount"})}
      </Text>
    </ScreenLayout>
  );
};
