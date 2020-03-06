import React from "react";
import { Text } from "../styles";
import { useWithLoading, useNavigation } from "../hook";
import { ScreenLayout } from "./component/layout";

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
        Account email address has been verified successfully.
      </Text>
    </ScreenLayout>
  );
};
