import React from "react";
import { ScreenLayout } from "./component/layout";
import { Text, Image } from "../styles";
import { useWithLoading, useNavigation } from "../hook";
import svg from "../assets/screen_sent.svg";

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
        Account email address has been sent to your mobile device.
      </Text>
      <Image src={svg} styles={{root: {minHeight: "270px"}, image: {width: "100%"}}}/>
    </ScreenLayout>
  );
};
