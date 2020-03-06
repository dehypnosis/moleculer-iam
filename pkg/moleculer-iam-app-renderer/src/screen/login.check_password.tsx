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

  const handleCheckLoginPassword = withLoading(async () => {
    return dispatch("login.check_password", { email, password })
      .catch((err: any) => setErrors(err));
  }, [password]);

  const handleResetPassword = withLoading(() => nav.navigate("reset_password", {
    screen: "reset_password.index",
    params: {
      email,
    }
  }), []);

  const handleCancel = withLoading(() => nav.navigate("login", {
    screen: "login.index",
    params: {
      email,
      change_account: "true",
    },
  }), []);

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
          tabIndex: 22,
        },
        {
          children: "Cancel",
          onPress: handleCancel,
          tabIndex: 23,
        },
        {
          children: "Forgot password?",
          tabIndex: 24,
          onPress: handleResetPassword,
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
          isPassword
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
