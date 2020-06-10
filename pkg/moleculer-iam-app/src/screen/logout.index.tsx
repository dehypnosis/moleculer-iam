import React from "react";
import { useAppState, useAppI18N, useWithLoading } from "../hook";
import { ScreenLayout } from "../component";
import { ActiveSessionList } from "./logout.end";

export const LogoutIndexScreen: React.FunctionComponent = () => {
  // states
  const { formatMessage: f } = useAppI18N();
  const { loading, withLoading, errors, setErrors } = useWithLoading();
  const [state, dispatch] = useAppState();

  const [handleSignOutAll, handleSignOutAllLoading] = withLoading(() => {
    return dispatch("logout.confirm")
      .then(() => setErrors({}))
      .catch((err: any) => setErrors(err));
  });
  const [handleRedirect, handleRedirectLoading] = withLoading(() => {
    return dispatch("logout.redirect")
      .then(() => setErrors({}))
      .catch((err: any) => setErrors(err));
  });

  // render
  return (
    <ScreenLayout
      title={f({ id: "logout.signOut"})}
      subtitle={state.user!.email}
      loading={loading}
      buttons={[
        {
          status: "primary",
          children: f({id: "button.done"}),
          onPress: handleRedirect,
          loading: handleRedirectLoading,
          tabIndex: 1,
        },
        {
          children: f({id: "logout.signOutAllSessions"}),
          onPress: handleSignOutAll,
          loading: handleSignOutAllLoading,
          tabIndex: 2,
        },
      ]}
      error={errors.global}
    >
      <ActiveSessionList authorizedClients={state.authorizedClients} />
    </ScreenLayout>
  );
};
