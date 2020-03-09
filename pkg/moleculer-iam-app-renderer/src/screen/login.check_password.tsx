import React, { useState } from "react";
import { useAppState, useNavigation, useWithLoading } from "../hook";
import { Form, FormInput, ScreenLayout } from "./component";

export const LoginCheckPasswordScreen: React.FunctionComponent = () => {
  // state
  const [password, setPassword] = useState("");
  const [state, dispatch] = useAppState();
  const { email, name, picture } = state.session.login.user;

  // handlers
  const { nav } = useNavigation();
  const { loading, errors, setErrors, withLoading } = useWithLoading();

  const [handleCheckLoginPassword, handleCheckLoginPasswordLoading] = withLoading(async () => {
    return dispatch("login.check_password", { email, password })
      .catch((err: any) => setErrors(err));
  }, [password]);

  const [handleResetPassword, handleResetPasswordLoading] = withLoading(() => {
    dispatch("verify_email.check_email", {
      email,
      registered: true,
    })
      .then(() => {
        setErrors({});
        nav.navigate("verify_email.stack", {
          screen: "verify_email.verify",
          params: {
            callback: "reset_password",
          },
        });
      })
      .catch((err: any) => setErrors(err));
  }, []);

  const [handleCancel, handleCancelLoading] = withLoading(() => {
    nav.navigate("login.stack", {
      screen: "login.index",
      params: {
        email,
        change_account: "true",
      },
    });
    setErrors({});
  }, [email]);

  // render
  return (
    <ScreenLayout
      title={`Hi, ${name}`}
      subtitle={email}
      loading={loading}
      error={errors.global}
      buttons={[
        {
          status: "primary",
          children: "Sign in",
          onPress: handleCheckLoginPassword,
          loading: handleCheckLoginPasswordLoading,
          tabIndex: 22,
        },
        {
          children: "Cancel",
          onPress: handleCancel,
          loading: handleCancelLoading,
          tabIndex: 23,
        },
        {
          separator: "OR",
        },
        {
          children: "Forgot password?",
          tabIndex: 24,
          onPress: handleResetPassword,
          loading: handleResetPasswordLoading,
          appearance: "ghost",
          size: "small",
        },
      ]}
    >
      <Form onSubmit={handleCheckLoginPassword}>
        {/* to fill password hint by browser */}
        <FormInput
          autoCompleteType={"username"}
          value={email}
          style={{display: "none"}}
        />
        <FormInput
          label="Password"
          tabIndex={21}
          autoFocus
          secureTextEntry
          autoCompleteType={"password"}
          placeholder="Enter your password"
          value={password}
          setValue={setPassword}
          error={errors.password}
          onEnter={handleCheckLoginPassword}
        />
      </Form>
    </ScreenLayout>
  );
};
