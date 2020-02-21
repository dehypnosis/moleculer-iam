import React, { useEffect } from "react";
import { Text, Image } from "../styles";
import { useWithLoading } from "../hook";
import svg from "../image/screen_sent.svg";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ScreenLayout } from "./layout";

export const ResetPasswordSentScreen: React.FunctionComponent = () => {
  // states
  const {loading, errors, setErrors, withLoading} = useWithLoading();

  // props
  const {email = "", ttl = 0 } = (useRoute() as any).params || {};

  // handlers
  const nav = useNavigation();
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
        You could check the email to set a new password within {Math.floor(ttl/60)} minutes.
      </Text>
      <Image src={svg} styles={{root: {minHeight: "270px"}, image: {width: "100%"}}}/>
    </ScreenLayout>
  );
};
