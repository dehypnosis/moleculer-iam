import React from "react";
import { useWithLoading, useNavigation, useAppState, useClose, useAppI18N } from "../hook";
import { ScreenLayout, Text } from "../component";

export const ResetPasswordEndScreen: React.FunctionComponent = () => {
  // states
  const { formatMessage: f } = useAppI18N();
  const [state] = useAppState();
  const email = state.session.resetPassword.user.email;

  // handlers
  const { nav } = useNavigation();
  const { loading, withLoading } = useWithLoading();
  const [handleLogin, handleLoginLoading] = withLoading(() => {
    nav.navigate("login.index", {
      email,
    });
  }, [state]);

  const { closed, close } = useClose(false);

  // render
  return (
    <ScreenLayout
      title={f({id: "resetPassword.passwordUpdated"})}
      subtitle={email}
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
      <Text>
        {f({id: "resetPassword.passwordUpdatedSuccessfully"})}
      </Text>
    </ScreenLayout>
  );
};
