import React  from "react";
import { Text, Image } from "../styles";
import { useNavigation, useWithLoading } from "../hook";
import { ScreenLayout } from "./component/layout";
import svg from "../assets/screen_verify.svg";

export const VerifyEmailIndexScreen: React.FunctionComponent = () => {
  // states
  const {loading, errors, setErrors, withLoading} = useWithLoading();
  const { nav, route } = useNavigation();
  const { email = "", callback = "" } = route.params;

  // handlers
  const handleSend = withLoading(() => {
    // TODO: ..
    nav.navigate("verify_email", {
      screen: "verify_email.verify",
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
          status: "primary",
          children: "Send",
          onPress: handleSend,
          tabIndex: 1,
        },
        {
          children: "Cancel",
          onPress: handleCancel,
          tabIndex: 2,
        },
      ]}
      loading={loading}
      error={errors.global}
    >
      <Text>
        An email with a verification link will be sent to verify the email address.
      </Text>
      <Image src={svg} styles={{root: {minHeight: "270px"}, image: {width: "100%"}}}/>
    </ScreenLayout>
  );
};
