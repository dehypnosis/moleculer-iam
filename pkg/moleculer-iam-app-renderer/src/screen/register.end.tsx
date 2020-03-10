import React from "react";
import { useWithLoading, useAppState, useClose } from "../hook";
import { ScreenLayout, Persona, Text } from "./component";

export const RegisterEndScreen: React.FunctionComponent = () => {
  // states
  const [state, dispatch] = useAppState();
  const user = state.session.registered || {};

  // handlers
  const { close, closed } = useClose(false);
  const {loading, errors, setErrors, withLoading} = useWithLoading();
  const [handleSignIn, handleSignInLoading] = withLoading(() => {
    return dispatch("register.login")
      .catch(errs => setErrors(errs));
  });

  // render
  return (
    <ScreenLayout
      title={"Signed up"}
      loading={loading || closed}
      error={errors.global || (closed ? "Please close the window manually." : undefined)}
      buttons={[
        {
          status: "primary",
          children: "Sign in",
          onPress: handleSignIn,
          loading: handleSignInLoading,
          tabIndex: 91,
          hidden: !state.routes.login,
        },
        {
          children: "Close",
          onPress: close,
          loading: closed,
          tabIndex: 92,
        },
      ]}
    >
      <Persona {...user} />
      <Text style={{marginTop: 30}}>Congratulations! The account has been registered successfully.</Text>
    </ScreenLayout>
  );
};
