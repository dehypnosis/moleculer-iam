import React, { useState } from "react";
import { useAppState, useNavigation, useWithLoading } from "../hook";
import { ScreenLayout, Text, Form, FormInput } from "./component";

export const ResetPasswordSetScreen: React.FunctionComponent = () => {
  // states
  const [state, dispatch] = useAppState();
  const email = state.session.resetPassword.user.email;
  const [payload, setPayload] = useState({
    password: "",
    password_confirmation: "",
  });

  // handlers
  const { nav } = useNavigation();
  const {loading, errors, setErrors, withLoading} = useWithLoading();
  const [handleResetPassword, handleResetPasswordLoading] = withLoading(() => {
    return dispatch("reset_password.set", {
      email,
      ...payload,
    }, {
      email: "이메일",
      password: "패스워드",
      password_confirmation: "패스워드 확인",
    })
      .then(() => {
        setErrors({});
        nav.navigate("reset_password.stack", {
          screen: "reset_password.end",
          params: {},
        });
      })
      .catch(errs => setErrors(errs));
  }, [payload]);

  const [handleCancel, handleCancelLoading] = withLoading(() => {
    nav.navigate("login.stack", {
      screen: "login.check_password",
      params: {
        email,
      },
    });
    setErrors({});
  }, []);

  // render
  return (
    <ScreenLayout
      title={`Reset password`}
      subtitle={email}
      error={errors.global}
      loading={loading}
      buttons={[
        {
          status: "primary",
          children: "Continue",
          onPress: handleResetPassword,
          loading: handleResetPasswordLoading,
          tabIndex: 43,
        },
        {
          children: "Cancel",
          onPress: handleCancel,
          loading: handleCancelLoading,
          tabIndex: 44,
          hidden: !state.routes.login,
        }
      ]}
    >
      <Text style={{marginBottom: 30}}>
        Set a new password for your account.
      </Text>
      <Form onSubmit={handleResetPassword}>
        {/* to fill password hint by browser */}
        <FormInput
          autoCompleteType={"username"}
          value={email}
          style={{display: "none"}}
        />
        <FormInput
          label="Password"
          tabIndex={41}
          autoFocus
          secureTextEntry
          autoCompleteType={"password"}
          placeholder="Enter new password"
          value={payload.password}
          setValue={v => setPayload(p => ({...p, password: v }))}
          error={errors.password}
          onEnter={handleResetPassword}
          style={{marginBottom: 15}}
        />
        <FormInput
          label="Confirm"
          tabIndex={42}
          secureTextEntry
          autoCompleteType={"password"}
          placeholder="Confirm new password"
          value={payload.password_confirmation}
          setValue={v => setPayload(p => ({...p, password_confirmation: v }))}
          error={errors.password_confirmation}
          onEnter={handleResetPassword}
        />
      </Form>
    </ScreenLayout>
  );
};
