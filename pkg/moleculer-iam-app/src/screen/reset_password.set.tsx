import React, { useState } from "react";
import { useAppState, useAppI18N, useNavigation, useWithLoading } from "../hook";
import { ScreenLayout, Text, Form, FormInput } from "../component";

export const ResetPasswordSetScreen: React.FunctionComponent = () => {
  // states
  const {formatMessage: f} = useAppI18N();
  const [state, dispatch] = useAppState();
  const email = state.session.resetPassword.user.email;
  const [payload, setPayload] = useState({
    password: "",
    password_confirmation: "",
  });

  const payloadLabels = {
    email: f({id: "payload.email"}),
    password: f({id: "payload.newPassword"}),
    password_confirmation: f({id: "payload.newPasswordConfirmation"}),
  };

  // handlers
  const {nav} = useNavigation();
  const {loading, errors, setErrors, withLoading} = useWithLoading();
  const [handleResetPassword, handleResetPasswordLoading] = withLoading(() => {
    return dispatch("reset_password.set", {
      email,
      ...payload,
    }, payloadLabels)
      .then(() => {
        setErrors({});
        nav.navigate("reset_password.end");
      })
      .catch(errs => setErrors(errs));
  }, [payload]);

  const [handleCancel, handleCancelLoading] = withLoading(() => {
    nav.navigate("login.check_password", {
      email,
    });
    setErrors({});
  }, []);

  // render
  return (
    <ScreenLayout
      title={f({id: "resetPassword.resetPassword"})}
      subtitle={email}
      error={errors.global}
      loading={loading}
      buttons={[
        {
          status: "primary",
          children: f({id: "button.continue"}),
          onPress: handleResetPassword,
          loading: handleResetPasswordLoading,
          tabIndex: 43,
        },
        {
          children: f({id: "button.cancel"}),
          onPress: handleCancel,
          loading: handleCancelLoading,
          tabIndex: 44,
          hidden: !state.routes.login,
        }
      ]}
    >
      <Text style={{marginBottom: 30}}>
        {f({id: "resetPassword.setNewPassword"})}
      </Text>
      <Form onSubmit={handleResetPassword}>
        {/* to fill password hint by browser */}
        <FormInput
          autoCompleteType={"username"}
          value={email}
          style={{display: "none"}}
        />
        <FormInput
          label={payloadLabels.password}
          tabIndex={41}
          autoFocus
          secureTextEntry
          autoCompleteType={"password"}
          placeholder={f({id: "placeholder.newPassword"})}
          value={payload.password}
          setValue={v => setPayload(p => ({...p, password: v}))}
          error={errors.password}
          onEnter={handleResetPassword}
          style={{marginBottom: 15}}
        />
        <FormInput
          label={payloadLabels.password_confirmation}
          tabIndex={42}
          secureTextEntry
          autoCompleteType={"password"}
          placeholder={f({id: "placeholder.newPasswordConfirmation"})}
          value={payload.password_confirmation}
          setValue={v => setPayload(p => ({...p, password_confirmation: v}))}
          error={errors.password_confirmation}
          onEnter={handleResetPassword}
        />
      </Form>
    </ScreenLayout>
  );
};
