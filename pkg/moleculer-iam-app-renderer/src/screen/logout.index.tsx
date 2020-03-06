import React from "react";
import { useAppState, useWithLoading } from "../hook";
import { Persona, ScreenLayout, Text } from "./component";

export const LogoutIndexScreen: React.FunctionComponent = () => {
  // states
  const { loading, withLoading, errors, setErrors } = useWithLoading();
  const [state, dispatch] = useAppState();
  const user = state.user!;
  const client = state.client;

  const handleSignOutAll = withLoading(() => {
    return dispatch("logout.confirm")
      .catch((err: any) => setErrors(err));
  });
  const handleJustRedirect = withLoading(() => {
    return dispatch("logout.redirect")
      .catch((err: any) => setErrors(err));
  });

  // render
  return (
    <ScreenLayout
      title={client ? `Signed out from` : `Sign out`}
      subtitle={`Hi, ${user.name}`}
      loading={loading}
      buttons={[
        {
          status: "primary",
          children: "Continue",
          onPress: handleJustRedirect,
          tabIndex: 2,
        },
        {
          children: "Done",
          onPress: handleSignOutAll,
          tabIndex: 1,
        },
      ]}
      error={errors.global}
    >
      <Persona {...user} style={{marginBottom: 30}}/>
      <Text>
        <>
          {client ? (<>Signed out from {client.name} successfully. </>) : null }
          Destroy all the sessions of this account?
        </>
      </Text>
    </ScreenLayout>
  );
};
