import React  from "react";
import { Text, Image } from "../styles";
import { useWithLoading } from "../hook";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ScreenLayout } from "./layout";
import svg from "../image/screen_verify.svg";

export const VerifyEmailIndexScreen: React.FunctionComponent = () => {
  // states
  const {loading, errors, setErrors, withLoading} = useWithLoading();

  // props
  const { email = "", callback = "" } = (useRoute() as any).params || {};

  // handlers
  const nav = useNavigation();
  const handleSend = withLoading(() => {
    // TODO: ..
    nav.navigate("verify_email", {
      screen: "verify_email.sent",
      params: { email, ttl: 1800, callback },
    });
  }, [nav, email, callback]);

  const handleCancel = withLoading(() => {
    callback === "register" ? nav.navigate("register", {
      screen: "register.detail",
      params: {},
    }) : nav.navigate("login", {
      screen: "login.index",
      params: {
        email,
      },
    });
  }, [nav, callback, email]);

  // render
  return (
    <ScreenLayout
      title={`Verify email`}
      subtitle={email}
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
        An email with a verification link will be sent to verify the email address.
      </Text>
      <Image src={svg} styles={{root: {minHeight: "270px"}, image: {width: "100%"}}}/>
    </ScreenLayout>
  );
};
