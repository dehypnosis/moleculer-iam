import React from "react";
import { Text } from "../styles";
import { useWithLoading } from "../hook";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ScreenLayout } from "./layout";

export const RegisterEndScreen: React.FunctionComponent = () => {
  // states
  const {loading, errors, setErrors, withLoading} = useWithLoading();

  // props
  const { email = "" } = (useRoute() as any).params || {};

  // handlers
  const nav = useNavigation();
  const handleContinue = withLoading(() => {
    // ... login
    nav.navigate("login", {
      screen: "login.index",
      params: {
        email,
      },
    })
  });

  // render
  return (
    <ScreenLayout
      title={"Signed up"}
      subtitle={email}
      buttons={[
        {
          primary: true,
          text: "Done",
          onClick: handleContinue,
          loading,
          autoFocus: true,
          tabIndex: 1,
        },
      ]}
      error={errors.global}
    >
      <Text>Congratulations! The account has been registered. This email account can be used to sign in to multiple services. So don't forget it please. 🙂</Text>
    </ScreenLayout>
  );
};
