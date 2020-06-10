import React, { useEffect, useState } from "react";
import { useNavigation, useAppState, useWithLoading, useAppOptions, useAppI18N } from "../hook";
import { Text, ScreenLayout, FormInput } from "../component";

export const VerifyPhoneIndexScreen: React.FunctionComponent = () => {
  // states
  const {formatMessage: f} = useAppI18N();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, dispatch] = useAppState();
  const [options] = useAppOptions();
  const [phoneNumber, setPhoneNumber] = useState("");

  // handlers
  const { nav, route } = useNavigation();
  const { loading, errors, setErrors, withLoading } = useWithLoading();
  const [handleCheckPhoneNumber, handleCheckPhoneNumberLoading] = withLoading(() => {
    dispatch("verify_phone.check_phone", {
      phone_number: `${options.locale.region}|${phoneNumber}`,
      registered: true,
    }, {
      phone_number: f({id: "payload.phoneNumber"}),
    })
      .then((s) => {
        setErrors({});
        setPhoneNumber(s.session.verifyPhone.phoneNumber);
        nav.navigate("verify_phone.verify");
      })
      .catch((err: any) => setErrors(err))
  }, [phoneNumber, options]);

  useEffect(() => {
    // update email when route params updated
    if (route.params.phone_number && route.params.phone_number !== phoneNumber) {
      setPhoneNumber(route.params.phone_number || "");
      setErrors({});
    }
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
   [nav, route]);

  // render
  return (
    <ScreenLayout
      title={f({id: "verifyPhone.verifyPhone"})}
      loading={loading}
      error={errors.global}
      buttons={[
        {
          status: "primary",
          children: f({id: "button.continue"}),
          onPress: handleCheckPhoneNumber,
          loading: handleCheckPhoneNumberLoading,
          tabIndex: 22,
        },
      ]}
    >
      <Text style={{marginBottom: 30}}>
        {f({id: "verifyPhone.verifyRegisteredPhone"})}
      </Text>
      <FormInput
        autoFocus
        tabIndex={21}
        label={f({id: "payload.phoneNumber"})}
        placeholder={f({id: "placeholder.phoneNumber"}, { region: options.locale.region })}
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
