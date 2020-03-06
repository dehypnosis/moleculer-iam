import React, { useEffect } from "react";
import { Text, Image } from "../styles";
import { useNavigation, useWithLoading } from "../hook";
import { ScreenLayout } from "./component/layout";
import svg from "../assets/screen_sent.svg";

export const ResetPasswordSentScreen: React.FunctionComponent = () => {
  // states
  const {loading, errors, setErrors, withLoading} = useWithLoading();
  const { nav, route } = useNavigation();
  const {email = "", ttl = 0 } = route.params;

  // handlers
  const handleDone = withLoading(() => nav.navigate("login", {
    screen: "login.index",
    params: { email },
  }), [nav, email]);

  // render
  return (
    <ScreenLayout
      title={`Reset password`}
      subtitle={email}
      buttons={[
        {
          status: "primary",
          children: "Done",
          onPress: handleDone,
          tabIndex: 41,
        },
      ]}
      error={errors.global}
      loading={loading}
    >
      <Text>
        You could check the email to set a new password within {Math.floor(ttl/60)} minutes.
      </Text>
      <Image src={svg} styles={{root: {minHeight: "270px"}, image: {width: "100%"}}}/>
    </ScreenLayout>
  );
};
