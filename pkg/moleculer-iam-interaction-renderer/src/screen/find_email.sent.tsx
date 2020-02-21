import React from "react";
import { ScreenLayout } from "./layout";
import { Text, Image } from "../styles";
import { useWithLoading } from "../hook";
import { useNavigation, useRoute } from "@react-navigation/native";
import svg from "../image/screen_sent.svg";

export const FindEmailSentScreen: React.FunctionComponent = () => {
  const {loading, errors, setErrors, withLoading} = useWithLoading();

  // handlers
  const nav = useNavigation();
  const handleDone = withLoading(() => nav.navigate("login", {
    screen: "login.index",
    params: {},
  }));

  const { phoneNumber = "" } = (useRoute() as any).params || {};

  // render
  return (
    <ScreenLayout
      title={`Find email`}
      subtitle={phoneNumber}
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
        Account email address has been sent to your mobile device.
      </Text>
      <Image src={svg} styles={{root: {minHeight: "270px"}, image: {width: "100%"}}}/>
    </ScreenLayout>
  );
};
