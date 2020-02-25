import React, { useState } from "react";
import { Stack, Text, TextField, TextFieldStyles } from "../styles";
import { useWithLoading } from "../hook";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ScreenLayout } from "./layout";

export const ResetPasswordSetScreen: React.FunctionComponent = () => {
  // states
  const {loading, errors, setErrors, withLoading} = useWithLoading();

  // props
  const { email = "" } = (useRoute() as any).params || {};
  const [payload, setPayload] = useState({
    password: "",
    password_confirmation: "",
  });

  // handlers
  const nav = useNavigation();
  const handlePayloadSubmit = withLoading(() => {
    nav.navigate("reset_password", {
      screen: "reset_password.end",
      params: { email },
    });
  }, [nav, email]);

  // render
  return (
    <ScreenLayout
      title={`Reset password`}
      subtitle={email}
      buttons={[
        {
          primary: true,
          text: "Continue",
          onClick: handlePayloadSubmit,
          loading,
          tabIndex: 43,
        },
      ]}
      error={errors.global}
    >
      <Text>
        Set a new password for your account.
      </Text>
      <TextField
        label="Password"
        type="password"
        inputMode="text"
        placeholder="Enter new password"
        autoFocus
        tabIndex={41}
        value={payload.password}
        errorMessage={errors.password}
        onChange={(e, v) => setPayload(p => ({...p, password: v!}))}
        onKeyUp={e => e.key === "Enter" && handlePayloadSubmit()}
        styles={TextFieldStyles.bold}
      />
      <TextField
        label="Confirm"
        type="password"
        inputMode="text"
        autoComplete="password"
        placeholder="Confirm your password"
        tabIndex={42}
        value={payload.password_confirmation}
        errorMessage={errors.password_confirmation}
        onChange={(e, v) => setPayload(p => ({...p, password_confirmation: v!}))}
        onKeyUp={e => e.key === "Enter" && handlePayloadSubmit()}
        styles={TextFieldStyles.bold}
      />
    </ScreenLayout>
  );
};
