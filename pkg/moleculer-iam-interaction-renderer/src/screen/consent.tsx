import React from "react";
import { Text, ThemeStyles, Link, Persona, PersonaSize } from "../styles";
import { useServerState, useWithLoading } from "../hook";
import { ScreenLayout } from "./layout";
import { useNavigation } from "@react-navigation/native";

export const ConsentScreen: React.FunctionComponent = () => {
  // states
  const {loading, withLoading, errors, setErrors} = useWithLoading();
  const nav = useNavigation();
  const { interaction, request } = useServerState();

  // handlers
  const handleAccept = withLoading(() => {
    return request("consent.accept")
      .catch((err: any) => setErrors(err));
  });

  const handleChangeAccount = withLoading(() => {
    return nav.navigate("login", {
      screen: "login.index",
      params: {},
    });
  });

  const {user, client, consent} = (interaction.data || {}) as any;

  // render
  return (
    <ScreenLayout
      title={<span>Sign in to <Link href={client.client_uri} target={"_blank"} style={{color: ThemeStyles.palette.orange}} variant="xxLarge">{client.name}</Link></span>}
      buttons={[
        {
          primary: true,
          text: "Continue",
          onClick: handleAccept,
          loading,
          tabIndex: 1,
          autoFocus: true,
        },
        // {
        //   text: "Cancel",
        //   onClick: handleAbort,
        //   loading,
        //   tabIndex: 2,
        // },
        {
          text: "Change account",
          onClick: handleChangeAccount,
          loading,
          tabIndex: 3,
        },
      ]}
      footer={
        <Text>
          To continue, you need to offer {consent.scopes.new.concat(consent.scopes.accepted).join(", ")} information.
          Before consent this application, you could review the <Link href={client.client_uri} target={"_blank"}>{client.name}</Link>'s <Link href={client.policy_uri} target="_blank">privacy policy</Link> and <Link
          href={client.tos_uri} target="_blank">terms of service</Link>.
        </Text>
      }
      error={errors.global}
    >
      <Persona
        text={user.name}
        secondaryText={user.email}
        size={PersonaSize.size56}
        imageUrl={user.picture_uri}
      />
    </ScreenLayout>
  );
};
