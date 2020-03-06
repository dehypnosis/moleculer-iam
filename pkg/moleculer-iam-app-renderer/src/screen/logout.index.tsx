import React from "react";
import { useAppState, useWithLoading } from "../hook";
import { Persona, ScreenLayout, Text } from "./component";
import { ActiveSessionList } from "./logout.end";

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
  const handleRedirect = withLoading(() => {
    return dispatch("logout.redirect")
      .catch((err: any) => setErrors(err));
  });

  // render
  return (
    <ScreenLayout
      title={client ? `Signed out` : `Sign out`}
      subtitle={user.email}
      loading={loading}
      buttons={client ? [
        {
          status: "primary",
          children: "Done",
          onPress: handleRedirect,
          tabIndex: 1,
        },
        {
          children: "Sign out from all",
          onPress: handleSignOutAll,
          tabIndex: 2,
        },
      ] : [
        {
          status: "primary",
          children: "Sign out from all",
          onPress: handleSignOutAll,
          tabIndex: 1,
        },
        {
          children: "Done",
          onPress: handleRedirect,
          tabIndex: 2,
        },
      ]}
      error={errors.global}
    >
      <Text>
        {client ? (<>Signed out from {client.client_name}. </>) : <>Destroy all the sessions of this account?</> }
      </Text>
      { state.authorizedClients ? <ActiveSessionList authorizedClients={state.authorizedClients} /> : null }
    </ScreenLayout>
  );
};
