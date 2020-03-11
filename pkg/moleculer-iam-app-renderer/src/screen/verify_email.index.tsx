import React, { useEffect, useState } from "react";
import { useAppState, useNavigation, useWithLoading } from "../hook";
import { ScreenLayout, FormInput, Text } from "./component";

export const VerifyEmailIndexScreen: React.FunctionComponent = () => {
  // states
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
      email: "이메일",
    })
      .then(() => {
        setErrors({});
        nav.navigate("verify_email.stack", {
          screen: "verify_email.verify",
          params: {},
        });
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
      title={`Verify your email`}
      loading={loading}
      error={errors.global}
      buttons={[
        {
          status: "primary",
          children: "Continue",
          onPress: handleCheckEmail,
          loading: handleCheckEmailLoading,
          tabIndex: 32,
        },
      ]}
    >
      <Text style={{marginBottom: 30}}>
        Verify your registered email address.
      </Text>
      <FormInput
        autoFocus
        tabIndex={31}
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
