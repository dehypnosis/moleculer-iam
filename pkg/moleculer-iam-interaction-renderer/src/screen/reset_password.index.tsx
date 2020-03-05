import React  from "react";
import { Text, Image } from "../styles";
import { useWithLoading, useNavigation } from "../hook";
import { ScreenLayout } from "./layout";
import svg from "../assets/screen_password.svg";

export const ResetPasswordIndexScreen: React.FunctionComponent = () => {
  // states
  const {loading, errors, setErrors, withLoading} = useWithLoading();

  // props
  const { nav, route } = useNavigation();
  const { email = "" } = route.params;

  // handlers
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
          tabIndex: 31,
        },
        {
          text: "Cancel",
          onClick: handleCancel,
          tabIndex: 32,
        },
      ]}
      loading={loading}
      error={errors.global}
    >
      <Text>
        An email with a link will be sent to help you to reset password.
      </Text>
      <Image src={svg} styles={{root: {minHeight: "270px"}, image: {width: "100%"}}}/>
    </ScreenLayout>
  );
};
