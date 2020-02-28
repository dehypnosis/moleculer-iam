import React from "react";
import { Text, Link } from "../styles";
import { useServerState, useWithLoading } from "../hook";
import { ScreenLayout } from "./layout";

export const LogoutIndexScreen: React.FunctionComponent = () => {
  // states
  const { loading, withLoading, errors, setErrors } = useWithLoading();
  const { request, interaction } = useServerState();
  const { user, client } = (interaction && interaction.data) || {};

  const handleSignOutAll = withLoading(() => {
    return request("logout.confirm")
      .catch((err: any) => setErrors(err));
  });
  const handleJustRedirect = withLoading(() => {
    return request("logout.redirect")
      .catch((err: any) => setErrors(err));
  });

  // render
  return (
    <ScreenLayout
      title={client ? `Signed out` : `Sign out`}
      subtitle={user.email}
      buttons={[
        {
          primary: true,
          text: "Done",
          onClick: handleJustRedirect,
          loading,
          tabIndex: 1,
        },
        {
          primary: false,
          text: "Sign out all",
          onClick: handleSignOutAll,
          loading,
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
