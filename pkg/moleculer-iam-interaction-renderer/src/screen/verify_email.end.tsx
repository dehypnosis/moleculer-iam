import React from "react";
import { Text } from "../styles";
import { useWithLoading } from "../hook";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ScreenLayout } from "./layout";

export const VerifyEmailEndScreen: React.FunctionComponent = () => {
  // states
  const {loading, errors, setErrors, withLoading} = useWithLoading();

  // props
  const { email = "" } = (useRoute() as any).params || {};

  // handlers
  const nav = useNavigation();
  const handleDone = withLoading(() =>
    nav.navigate("login", {
      screen: "login.index",
      params: {
        email,
      },
    })
  , [email]);

  // render
  return (
    <ScreenLayout
      title={`Email verified`}
      subtitle={email}
      buttons={[
        {
          primary: true,
          text: "Done",
          onClick: handleDone,
          loading,
          tabIndex: 31,
        },
      ]}
      error={errors.global}
    >
      <Text>
        Account email address has been verified successfully.
      </Text>
    </ScreenLayout>
  );
};
