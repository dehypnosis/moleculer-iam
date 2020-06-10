import React from "react";
import { useWithLoading, useAppState, useClose, useAppI18N } from "../hook";
import { ScreenLayout, Persona, Text } from "../component";

export const RegisterEndScreen: React.FunctionComponent = () => {
  // states
  const { formatMessage: f } = useAppI18N();
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
      title={f({id: "register.signedUp"})}
      loading={loading || closed}
      error={errors.global || (closed ? f({id: "error.cannotClose"}) : undefined)}
      buttons={[
        {
          status: "primary",
          children: f({id: "button.signIn"}),
          onPress: handleSignIn,
          loading: handleSignInLoading,
          tabIndex: 91,
          hidden: !state.routes.login,
        },
        {
          children: f({id: "button.close"}),
          onPress: close,
          loading: closed,
          tabIndex: 92,
        },
      ]}
    >
      <Persona {...user} />
      <Text style={{marginTop: 30}}>
        {f({id: "register.congrats"})}
      </Text>
    </ScreenLayout>
  );
};
