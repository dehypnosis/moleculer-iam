import React  from "react";
import { Text, Image } from "../styles";
import { useWithLoading } from "../hook";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ScreenLayout } from "./layout";
import svg from "../image/screen_password.svg";

export const ResetPasswordIndexScreen: React.FunctionComponent = () => {
  // states
  const {loading, errors, setErrors, withLoading} = useWithLoading();

  // props
  const { email = "" } = (useRoute() as any).params || {};

  // handlers
  const nav = useNavigation();
  const handleSend = withLoading(async () => {
    // TODO: ..
    nav.navigate("reset_password", {
      screen: "reset_password.sent",
      params: {email, ttl: 3600},
    });
  }, [nav, email]);

  const handleCancel = withLoading(() => nav.navigate("login", {
    screen: "login.index",
    params: {},
  }), [email]);

  // render
  return (
    <ScreenLayout
      title={`Reset password`}
      subtitle={email}
      buttons={[
        {
          primary: true,
          text: "Send",
          onClick: handleSend,
          loading,
          tabIndex: 2,
        },
        {
          text: "Cancel",
          onClick: handleCancel,
          loading,
          tabIndex: 3,
        },
      ]}
      error={errors.global}
    >
      <Text>
        An email with a link will be sent to help you to reset password.
      </Text>
      <Image src={svg} styles={{root: {minHeight: "270px"}, image: {width: "100%"}}}/>
    </ScreenLayout>
  );
};
