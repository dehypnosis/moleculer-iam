import React from "react";
import { useWithLoading, useNavigation, useAppState, useClose } from "../hook";
import { ScreenLayout, Text } from "./component";

export const ResetPasswordEndScreen: React.FunctionComponent = () => {
  // states
  const [state] = useAppState();
  const email = state.session.resetPassword.user.email;

  // handlers
  const { nav } = useNavigation();
  const { loading, withLoading } = useWithLoading();
  const [handleLogin, handleLoginLoading] = withLoading(() => {
    nav.navigate("login.stack", {
      screen: "login.index",
      params: {
        email,
      },
    });
  }, [state]);

  const { closed, close } = useClose(false);

  // render
  return (
    <ScreenLayout
      title={`Password reset`}
      subtitle={email}
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
      <Text>
        The account credential has been updated successfully.
      </Text>
    </ScreenLayout>
  );
};
