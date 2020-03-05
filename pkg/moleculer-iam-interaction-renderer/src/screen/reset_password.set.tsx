import React, { useState } from "react";
import { Text, TextField, TextFieldStyles } from "../styles";
import { useNavigation, useWithLoading } from "../hook";
import { ScreenLayout } from "./layout";

export const ResetPasswordSetScreen: React.FunctionComponent = () => {
  // states
  const {loading, errors, setErrors, withLoading} = useWithLoading();
  const { nav, route } = useNavigation();
  const { email = "" } = route.params;
  const [payload, setPayload] = useState({
    password: "",
    password_confirmation: "",
  });

  // handlers
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
          tabIndex: 43,
        },
      ]}
      error={errors.global}
      loading={loading}
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
