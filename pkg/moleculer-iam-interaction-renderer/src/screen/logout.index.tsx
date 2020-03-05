import React from "react";
import { Text, Link } from "../styles";
import { useAppState, useWithLoading } from "../hook";
import { ScreenLayout } from "./layout";

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
      title={client ? `Signed out` : `Sign out`}
      subtitle={user.email}
      loading={loading}
      buttons={[
        {
          primary: true,
          text: "Done",
          onClick: handleJustRedirect,
          tabIndex: 1,
        },
        {
          primary: false,
          text: "Sign out all",
          onClick: handleSignOutAll,
          tabIndex: 2,
        },
      ]}
      error={errors.global}
    >
      <Text>
        {client ? (<span>Signed out from <Link href={client.client_uri} target={"_blank"}>{client.name}</Link> successfully.<br /></span>) : null }
        Do you want to destroy all the sessions?
      </Text>
    </ScreenLayout>
  );
};
