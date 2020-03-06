import React from "react";
import { Text } from "../styles";
import { useWithLoading, useNavigation } from "../hook";
import { ScreenLayout } from "./component/layout";

export const VerifyPhoneEndScreen: React.FunctionComponent = () => {
  // states
  const {loading, errors, setErrors, withLoading} = useWithLoading();
  const { nav, route } = useNavigation();
  const { phoneNumber = "" } = route.params;

  // handlers
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
          status: "primary",
          children: "Done",
          onPress: handleDone,
          tabIndex: 31,
        },
      ]}
      error={errors.global}
      loading={loading}
    >
      <Text>
        Account phone number has been verified successfully.
      </Text>
    </ScreenLayout>
  );
};
