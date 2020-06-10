import React, { useEffect, useState } from "react";
import { useWithLoading, useNavigation, useAppState, useAppI18N } from "../hook";
import { Text, ScreenLayout, FormInput } from "../component";

export const ResetPasswordIndexScreen: React.FunctionComponent = () => {
  // states
  const { formatMessage: f } = useAppI18N();
  const [state, dispatch] = useAppState();
  const [email, setEmail] = useState((state.user && state.user.email) || "");
  const { nav, route } = useNavigation();

  // handlers
  const {loading, errors, setErrors, withLoading} = useWithLoading();
  const [handleCheckEmail, handleCheckEmailLoading] = withLoading(() => {
    dispatch("verify_email.check_email", {
      email,
      registered: true,
    }, {
      email: f({id: "payload.email"}),
    })
      .then(() => {
        setErrors({});
        nav.navigate("verify_email.verify", {
          callback: "reset_password",
        });
      })
      .catch(errs => setErrors(errs))
  }, [email]);

  const [handleCancel, handleCancelLoading] = withLoading(() => {
    nav.navigate("login.check_password", {
      email,
    });
    setErrors({});
  }, [email]);

  useEffect(() => {
    // update email when route params updated
    if (route.params.email && route.params.email !== email) {
      setEmail(route.params.email || "");
      setErrors({});
    }
  },
   // eslint-disable-next-line react-hooks/exhaustive-deps
   [nav, route]);

  // render
  return (
    <ScreenLayout
      title={f({id: "resetPassword.resetPassword"})}
      subtitle={f({id: "resetPassword.byEmail"})}
      loading={loading}
      error={errors.global}
      buttons={[
        {
          status: "primary",
          children: f({id: "button.continue"}),
          onPress: handleCheckEmail,
          loading: handleCheckEmailLoading,
          tabIndex: 22,
        },
        {
          children: f({id: "button.cancel"}),
          onPress: handleCancel,
          loading: handleCancelLoading,
          tabIndex: 23,
          hidden: !state.routes.login,
        },
      ]}
    >
      <Text style={{marginBottom: 30}}>
        {f({id: "resetPassword.verifyRegisteredEmail"})}
      </Text>
      <FormInput
        autoFocus
        tabIndex={21}
        label={f({id: "payload.email"})}
        keyboardType={"email-address"}
        placeholder={f({id: "placeholder.email"})}
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
