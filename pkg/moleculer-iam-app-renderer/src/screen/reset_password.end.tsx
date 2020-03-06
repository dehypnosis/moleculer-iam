import React from "react";
import { Text } from "../styles";
import { useWithLoading, useNavigation } from "../hook";
import { ScreenLayout } from "./component/layout";

export const ResetPasswordEndScreen: React.FunctionComponent = () => {
  // states
  const {loading, errors, setErrors, withLoading} = useWithLoading();
  const { nav, route } = useNavigation();
  const { email = "" } = route.params;

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
      title={`Password reset`}
      subtitle={email}
      buttons={[
        {
          status: "primary",
          children: "Done",
          onPress: handleDone,
          tabIndex: 21,
        },
      ]}
      error={errors.global}
      loading={loading}
    >
      <Text>
        Account credential has been updated successfully.
      </Text>
    </ScreenLayout>
  );
};
