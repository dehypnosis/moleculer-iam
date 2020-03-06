import React from "react";
import { Text } from "../styles";
import { useWithLoading, useNavigation } from "../hook";
import { ScreenLayout } from "./component/layout";

export const RegisterEndScreen: React.FunctionComponent = () => {
  // states
  const {loading, errors, setErrors, withLoading} = useWithLoading();
  const { nav, route } = useNavigation();
  const { email = "" } = route.params;

  // handlers
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
          status: "primary",
          children: "Done",
          onPress: handleContinue,
          tabIndex: 1,
        },
      ]}
      error={errors.global}
      loading={loading}
    >
      <Text>Congratulations! The account has been registered. This email account can be used to sign in to multiple services. So don't forget it please. <span role="img" aria-label="smile">🙂</span></Text>
    </ScreenLayout>
  );
};
