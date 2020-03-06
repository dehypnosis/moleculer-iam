import React, { useEffect, useState } from "react";
import { Text, TextField, TextFieldStyles } from "../styles";
import { useNavigation, useWithLoading } from "../hook";
import { ScreenLayout } from "./component/layout";

export const VerifyEmailVerifyScreen: React.FunctionComponent = () => {
  // states
  const {loading, errors, setErrors, withLoading} = useWithLoading();
  const { nav, route } = useNavigation();
  const { email = "", ttl = 0, callback = "" } = route.params;

  // handlers
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
          status: "primary",
          children: "Done",
          onPress: handleDone,
          tabIndex: 21,
        },
      ]}
      error={errors.global}
      loading={loading}
    >
      <Text>
        An email with the verification link has been sent.
      </Text>
    </ScreenLayout>
  );
};
