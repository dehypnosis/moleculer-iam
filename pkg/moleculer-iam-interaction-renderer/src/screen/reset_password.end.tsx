import React from "react";
import { Text } from "../styles";
import { useWithLoading } from "../hook";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ScreenLayout } from "./layout";

export const ResetPasswordEndScreen: React.FunctionComponent = () => {
  // states
  const {loading, errors, setErrors, withLoading} = useWithLoading();

  // props
  const { email = "" } = (useRoute() as any).params || {};

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
      title={`Password reset`}
      subtitle={email}
      buttons={[
        {
          primary: true,
          text: "Done",
          onClick: handleDone,
          loading,
          tabIndex: 1,
        },
      ]}
      error={errors.global}
    >
      <Text>
        Account credential has been updated successfully.
      </Text>
    </ScreenLayout>
  );
};
