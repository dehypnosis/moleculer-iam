import React, { useState } from "react";
import { useAppState, useWithLoading, useNavigation, useAppOptions } from "../hook";
import { ScreenLayout, Text, FormInput } from "./component";

export const FindEmailIndexScreen: React.FunctionComponent = () => {
  const { nav } = useNavigation();
  const [state, dispatch] = useAppState();
  const [options] = useAppOptions();
  const [phoneNumber, setPhoneNumber] = useState("");

  // handlers
  const { loading, errors, setErrors, withLoading } = useWithLoading();
  const [handleCheckPhoneNumber, handleCheckPhoneNumberLoading] = withLoading(() => {
    dispatch("verify_phone.check_phone", {
      phone_number: `${options.locale.country}|${phoneNumber}`,
      registered: true,
    }, {
      phone_number: "핸드폰 번호",
    })
      .then(() => {
        setErrors({});
        nav.navigate("verify_phone.stack", {
          screen: "verify_phone.verify",
          params: {
            callback: "find_email",
          },
        });
      })
      .catch((err: any) => setErrors(err))
  }, [phoneNumber, options]);

  const [handleCancel, handleCancelLoading] = withLoading(() => {
    nav.navigate("login.stack", {
      screen: "login.index",
      params: {},
    });
    setErrors({});
  });

  // render
  return (
    <ScreenLayout
      title={`Find your account`}
      subtitle={`With phone verification`}
      loading={loading}
      buttons={[
        {
          status: "primary",
          children: "Continue",
          onPress: handleCheckPhoneNumber,
          loading: handleCheckPhoneNumberLoading,
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
      error={errors.global}
    >
      <Text style={{marginBottom: 30}}>
        Have you registered a phone number?
      </Text>
      <FormInput
        autoFocus
        tabIndex={21}
        label={`Phone number`}
        placeholder={`Enter your mobile phone number (${options.locale.country})`}
        blurOnSubmit={false}
        keyboardType={"phone-pad"}
        autoCompleteType={"tel"}
        value={phoneNumber}
        error={errors.phone_number}
        setValue={setPhoneNumber}
        onEnter={handleCheckPhoneNumber}
      />
    </ScreenLayout>
  );
};
