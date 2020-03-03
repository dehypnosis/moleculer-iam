import React from "react";
import { ScreenLayout } from "./layout";
import { Text, Image } from "../styles";
import { useWithLoading, useNavigation } from "../hook";
import svg from "../image/screen_sent.svg";

export const FindEmailVerifyScreen: React.FunctionComponent = () => {
  const {loading, errors, setErrors, withLoading} = useWithLoading();

  // handlers
  const { nav, route } = useNavigation();
  const handleDone = withLoading(() => nav.navigate("login", {
    screen: "login.index",
    params: {},
  }));

  const { phoneNumber = "" } = route.params;

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
          tabIndex: 31,
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
