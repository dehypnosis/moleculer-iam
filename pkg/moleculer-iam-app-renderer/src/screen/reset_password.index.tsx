import React, { useEffect, useState } from "react";
import { useWithLoading, useNavigation, useAppState } from "../hook";
import { Text, ScreenLayout, FormInput } from "./component";

export const ResetPasswordIndexScreen: React.FunctionComponent = () => {
  // states
  const [state, dispatch] = useAppState();
  const [email, setEmail] = useState(state.user && state.user.email || "");
  const { nav, route } = useNavigation();

  // handlers
  const {loading, errors, setErrors, withLoading} = useWithLoading();
  const [handleCheckEmail, handleCheckEmailLoading] = withLoading(() => {
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
      .catch(errs => setErrors(errs))
  }, [email]);

  const [handleCancel, handleCancelLoading] = withLoading(() => {
    nav.navigate("login.stack", {
      screen: "login.check_password",
      params: {
        email,
      },
    });
    setErrors({});
  }, [email]);

  useEffect(() => {
    // update email when route params updated
    if (route.params.email && route.params.email !== email) {
      setEmail(route.params.email || "");
      setErrors({});
    }
  }, [nav, route]);

  // render
  return (
    <ScreenLayout
      title={`Reset password`}
      subtitle={`with email verification`}
      loading={loading}
      error={errors.global}
      buttons={[
        {
          status: "primary",
          children: "Continue",
          onPress: handleCheckEmail,
          loading: handleCheckEmailLoading,
          tabIndex: 22,
        },
        {
          children: "Cancel",
          onPress: handleCancel,
          loading: handleCancelLoading,
          tabIndex: 23,
          hidden: !state.routes.login,
        },
      ]}
    >
      <Text style={{marginBottom: 30}}>
        Verify your registered email address.
      </Text>
      <FormInput
        autoFocus
        tabIndex={21}
        label={`Email`}
        keyboardType={"email-address"}
        placeholder="Enter your email address"
        autoCompleteType={"username"}
        blurOnSubmit={false}
        value={email}
        error={errors.email}
        setValue={setEmail}
        onEnter={handleCheckEmail}
      />
    </ScreenLayout>
  );
};
