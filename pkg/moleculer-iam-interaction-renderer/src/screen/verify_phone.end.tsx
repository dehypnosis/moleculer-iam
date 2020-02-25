import React from "react";
import { Text } from "../styles";
import { useWithLoading } from "../hook";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ScreenLayout } from "./layout";

export const VerifyPhoneEndScreen: React.FunctionComponent = () => {
  // states
  const {loading, errors, setErrors, withLoading} = useWithLoading();

  // props
  const { phoneNumber = "" } = (useRoute() as any).params || {};

  // handlers
  const nav = useNavigation();
  const handleDone = withLoading(() =>
    nav.navigate("login", {
      screen: "login.index",
      params: {},
    })
  );

  // render
  return (
    <ScreenLayout
      title={`Phone number verified`}
      subtitle={phoneNumber}
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
        Account phone number has been verified successfully.
      </Text>
    </ScreenLayout>
  );
};
