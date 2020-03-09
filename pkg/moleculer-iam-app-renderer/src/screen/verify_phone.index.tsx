import React, { useEffect, useState } from "react";
import { useNavigation, useAppState, useWithLoading } from "../hook";
import { Text, ScreenLayout, FormInput } from "./component";

export const VerifyPhoneIndexScreen: React.FunctionComponent = () => {
  // states
  const [state, dispatch] = useAppState();
  const [phoneNumber, setPhoneNumber] = useState("");

  // handlers
  const { nav, route } = useNavigation();
  const { loading, errors, setErrors, withLoading } = useWithLoading();
  const [handleCheckPhoneNumber, handleCheckPhoneNumberLoading] = withLoading(() => {
    dispatch("verify_phone.check_phone", {
      phone_number: `${state.locale.country}|${phoneNumber}`,
      registered: true,
    })
      .then(() => {
        setErrors({});
        nav.navigate("verify_phone.stack", {
          screen: "verify_phone.verify",
          params: {},
        });
      })
      .catch((err: any) => setErrors(err))
  }, [phoneNumber]);

  useEffect(() => {
    // update email when route params updated
    if (route.params.phone_number && route.params.phone_number !== phoneNumber) {
      setPhoneNumber(route.params.phone_number || "");
      setErrors({});
    }
  }, [nav, route]);

  // render
  return (
    <ScreenLayout
      title={`Verify your phone`}
      loading={loading}
      error={errors.global}
      buttons={[
        {
          status: "primary",
          children: "Continue",
          onPress: handleCheckPhoneNumber,
          loading: handleCheckPhoneNumberLoading,
          tabIndex: 22,
        },
      ]}
    >
      <Text style={{marginBottom: 30}}>
        Verify your registered phone number.
      </Text>
      <FormInput
        autoFocus
        tabIndex={21}
        label={`Phone number`}
        placeholder={`Enter your mobile phone number (${state.locale.country})`}
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
