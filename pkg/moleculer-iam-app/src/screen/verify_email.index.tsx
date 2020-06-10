import React, { useEffect, useState } from "react";
import { useAppState, useAppI18N, useNavigation, useWithLoading } from "../hook";
import { ScreenLayout, FormInput, Text } from "../component";

export const VerifyEmailIndexScreen: React.FunctionComponent = () => {
  // states
  const {formatMessage: f} = useAppI18N();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, dispatch] = useAppState();
  const [email, setEmail] = useState("");
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
        nav.navigate("verify_email.verify");
      })
      .catch((err: any) => setErrors(err))
  }, [email]);

  useEffect(() => {
    // update email when route params updated
    if (route.params.email !== email) {
      setEmail(route.params.email || "");
      setErrors({});
    }
  },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nav, route]);

  // render
  return (
    <ScreenLayout
      title={f({id: "verifyEmail.verifyEmail"})}
      loading={loading}
      error={errors.global}
      buttons={[
        {
          status: "primary",
          children: f({id: "button.continue"}),
          onPress: handleCheckEmail,
          loading: handleCheckEmailLoading,
          tabIndex: 32,
        },
      ]}
    >
      <Text style={{marginBottom: 30}}>
        {f({id: "resetPassword.verifyRegisteredEmail"})}
      </Text>
      <FormInput
        autoFocus
        tabIndex={31}
        label={ f({id: "payload.email"})}
        keyboardType={"email-address"}
        placeholder={ f({id: "placeholder.email"})}
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
