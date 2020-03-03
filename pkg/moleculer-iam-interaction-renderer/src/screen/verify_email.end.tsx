import React from "react";
import { Text } from "../styles";
import { useWithLoading, useNavigation } from "../hook";
import { ScreenLayout } from "./layout";

export const VerifyEmailEndScreen: React.FunctionComponent = () => {
  // states
  const {loading, errors, setErrors, withLoading} = useWithLoading();
  const { route, nav } = useNavigation();

  // props
  const { email = "" } = route.params;

  // handlers
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
