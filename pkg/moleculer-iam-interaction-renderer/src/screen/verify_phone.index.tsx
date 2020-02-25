import React  from "react";
import { Text, Image } from "../styles";
import { useWithLoading } from "../hook";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ScreenLayout } from "./layout";
import svg from "../image/screen_verify.svg";

export const VerifyPhoneIndexScreen: React.FunctionComponent = () => {
  // states
  const {loading, errors, setErrors, withLoading} = useWithLoading();

  // props
  const { phoneNumber = "", callback = "" } = (useRoute() as any).params || {};

  // handlers
  const nav = useNavigation();
  const handleSend = withLoading(() => {
    // TODO: ..
    nav.navigate("verify_phone", {
      screen: "verify_phone.sent",
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
          loading,
          tabIndex: 1,
        },
        {
          text: "Cancel",
          onClick: handleCancel,
          loading,
          tabIndex: 2,
        },
      ]}
      error={errors.global}
    >
      <Text>
        A text message with a verification code will be sent to verify the phone number.
      </Text>
      <Image src={svg} styles={{root: {minHeight: "270px"}, image: {width: "100%"}}}/>
    </ScreenLayout>
  );
};
