import React from "react";
import { Text } from "../styles";
import { useClose, useWithLoading } from "../hook";
import { ScreenLayout } from "./layout";
import { useNavigation } from "@react-navigation/native";

export const LogoutIndexScreen: React.FunctionComponent = () => {
  // states
  const { loading, withLoading, errors, setErrors } = useWithLoading();
  const nav = useNavigation();
  const handleSignOutAll = withLoading(async () => {
    // TODO..
    nav.navigate("logout", {
      screen: "logout.end",
      params: {},
    });
  }, []);
  const {closed, close} = useClose(false);

  // TODO
  const { client } = { client: { name: "test" }};

  // render
  return (
    <ScreenLayout
      title={`Signed out`}
      subtitle={`Do you want to close all the other sessions?`}
      buttons={[
        {
          primary: true,
          text: "Sign out all",
          onClick: handleSignOutAll,
          loading,
        },
        {
          primary: false,
          text: "Close",
          onClick: close,
          loading: closed,
          tabIndex: 1,
        },
      ]}
      error={errors.global || (closed ? "Please close the window manually." : undefined)}
    >
      <Text>
        You has been signed out from {client.name}.
      </Text>
    </ScreenLayout>
  );
};
