import React, { useState } from "react";
import { useAppState, useI18N, useNavigation, useWithLoading } from "../hook";
import { Form, FormInput, ScreenLayout } from "./component";

export const LoginCheckPasswordScreen: React.FunctionComponent = () => {
  // state
  const { formatMessage: f } = useI18N();
  const [password, setPassword] = useState("");
  const [state, dispatch] = useAppState();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { email, name, picture } = (state.session.login && state.session.login.user) || {};

  // handlers
  const { nav } = useNavigation();
  const { loading, errors, setErrors, withLoading } = useWithLoading();

  const [handleCheckLoginPassword, handleCheckLoginPasswordLoading] = withLoading(async () => {
    return dispatch("login.check_password", { email, password }, {
      email: f({id: "payload.email"}),
      password: f({id: "payload.password"}),
    })
      .catch((err: any) => setErrors(err));
  }, [password]);

  const [handleResetPassword, handleResetPasswordLoading] = withLoading(() => {
    dispatch("verify_email.check_email", {
      email,
      registered: true,
    })
      .then(() => {
        setErrors({});
        nav.navigate("verify_email.verify", {
          callback: "reset_password",
        });
      })
      .catch((err: any) => setErrors(err));
  }, []);

  const [handleCancel, handleCancelLoading] = withLoading(() => {
    nav.navigate("login.index", {
      email,
      change_account: "true",
    });
    setErrors({});
  }, [email]);

  // render
  return (
    <ScreenLayout
      title={f({id: "login.hiName"}, { name })}
      subtitle={email}
      loading={loading}
      error={errors.global}
      buttons={[
        {
          status: "primary",
          children: f({id: "button.signIn"}),
          onPress: handleCheckLoginPassword,
          loading: handleCheckLoginPasswordLoading,
          tabIndex: 22,
        },
        {
          children: f({id: "button.cancel"}),
          onPress: handleCancel,
          loading: handleCancelLoading,
          tabIndex: 23,
        },
        {
          separator: f({id: "separator.or"}),
        },
        {
          children: f({id: "login.resetPassword"}),
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
          label={f({id: "payload.password"})}
          tabIndex={21}
          autoFocus
          secureTextEntry
          autoCompleteType={"password"}
          placeholder={f({id: "placeholder.password"})}
          value={password}
          setValue={setPassword}
          error={errors.password}
          onEnter={handleCheckLoginPassword}
        />
      </Form>
    </ScreenLayout>
  );
};
