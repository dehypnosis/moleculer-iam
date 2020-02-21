import React, { useEffect } from "react";
import { Text, ThemeStyles, Link, Persona, PersonaSize } from "../styles";
import { useWithLoading } from "../hook";
import { ScreenLayout } from "./layout";
import { useNavigation } from "@react-navigation/native";

export const ConsentScreen: React.FunctionComponent = () => {
  // states
  const {loading, withLoading, errors, setErrors} = useWithLoading();
  const nav = useNavigation();

  // handlers
  const handleAccept = withLoading(async () => {
    // const {error, redirect} = result;
    // if (error) {
    //   if (error.status === 422) {
    //     setErrors(error.detail);
    //   } else {
    //     setErrors({global: error.message});
    //   }
    // } else if (redirect) {
    //   window.location.replace(redirect);
    //   await new Promise(() => {
    //   });
    // } else {
    //   console.error("stuck to handle interaction:", result);
    // }
    // nav.navigate("http://google.com");
  }, []);

  const handleChangeAccount = withLoading(() => nav.navigate("login", {
    screen: "login.index",
    params: {},
  }), [nav]);

  // TODO
  const {client, consent, user} = {
    client: {name: "test", homepage_uri: "http://google.com", policy_uri: "http://google.com", tos_uri: "http://google.com"},
    consent: {scopes: {new: ["new1", "new2"], accepted: "accepted1"}},
    user: {name: "Dong Wook", email: "todo@todo.com", picture_uri: "https://yt3.ggpht.com/a-/AAuE7mA79aIT8nkc3dm0_QdYZbZKEJBV69I1AqXZWlFKog=s88-c-k-c0xffffffff-no-rj-mo"}
  };

  // render
  return (
    <ScreenLayout
      title={<span>Sign in to <Link href={client.homepage_uri} target={"_blank"} style={{color: ThemeStyles.palette.orange}} variant="xxLarge">{client.name}</Link></span>}
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
        //   onClick: handleReject,
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
          Before consent this application, you could review the <Link href={client.homepage_uri} target={"_blank"}>{client.name}</Link>'s <Link href={client.policy_uri} target="_blank">privacy policy</Link> and <Link
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
