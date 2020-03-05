import React  from "react";
import { Text, Image } from "../styles";
import { useNavigation, useWithLoading } from "../hook";
import { ScreenLayout } from "./layout";
import svg from "../assets/screen_verify.svg";

export const VerifyPhoneIndexScreen: React.FunctionComponent = () => {
  // states
  const {loading, errors, setErrors, withLoading} = useWithLoading();
  const { nav, route } = useNavigation();
  const { phoneNumber = "", callback = "" } = route.params;

  // handlers
  const handleSend = withLoading(() => {
    // TODO: ..
    nav.navigate("verify_phone", {
      screen: "verify_phone.verify",
      params: { phoneNumber, ttl: 500, callback },
    });
  }, [nav, phoneNumber, callback]);

  const handleCancel = withLoading(() => {
    callback === "register" ? nav.navigate("register", {
      screen: "register.detail",
      params: {},
    }) : nav.navigate("login", {
      screen: "login.index",
      params: {},
    });
  }, [nav, callback]);

  // render
  return (
    <ScreenLayout
      title={`Verify phone number`}
      subtitle={phoneNumber}
      buttons={[
        {
          primary: true,
          text: "Send",
          onClick: handleSend,
          tabIndex: 1,
        },
        {
          text: "Cancel",
          onClick: handleCancel,
          tabIndex: 2,
        },
      ]}
      loading={loading}
      error={errors.global}
    >
      <Text>
        A text message with a verification code will be sent to verify the phone number.
      </Text>
      <Image src={svg} styles={{root: {minHeight: "270px"}, image: {width: "100%"}}}/>
    </ScreenLayout>
  );
};
