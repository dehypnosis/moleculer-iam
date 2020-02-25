import React, { useEffect, useState } from "react";
import { Text, TextField, TextFieldStyles } from "../styles";
import { useWithLoading } from "../hook";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ScreenLayout } from "./layout";

export const VerifyEmailSentScreen: React.FunctionComponent = () => {
  // states
  const {loading, errors, setErrors, withLoading} = useWithLoading();

  // props
  const { email = "", ttl = 0, callback = "" } = (useRoute() as any).params || {};

  // handlers
  const nav = useNavigation();
  const handleDone = withLoading(() => {
    if (callback === "register") {
      nav.navigate("register", {
        screen: "register.detail",
        params: {},
      });
    } else {
      nav.navigate("login", {
        screen: "login.index",
        params: {
          email,
        },
      });
    }
  }, [nav, email, callback]);

  // render
  return (
    <ScreenLayout
      title={`Verify email`}
      subtitle={email}
      buttons={[
        {
          primary: true,
          text: "Done",
          onClick: handleDone,
          loading,
          tabIndex: 21,
        },
      ]}
      error={errors.global}
    >
      <Text>
        An email with the verification link has been sent.
      </Text>
    </ScreenLayout>
  );
};
