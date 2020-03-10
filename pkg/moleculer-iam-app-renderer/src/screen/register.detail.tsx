import React, { useState } from "react";
import { ScreenLayout, Text, Form, FormInput, FormDatePicker, Icon, FormSelect } from "./component";
import { useNavigation, useAppState, useWithLoading, useAppOptions } from "../hook";

export const RegisterDetailScreen: React.FunctionComponent = () => {
  // state
  const [state, dispatch] = useAppState();
  const [options] = useAppOptions();
  const tmpState = state.session.register || {};
  const tmpClaims = tmpState.claims || {};
  const tmpCreds = tmpState.credentials || {};
  const [payload, setPayload] = useState({
    phone_number: tmpClaims.phone_number || "",
    birthdate: tmpClaims.birthdate || "",
    gender: tmpClaims.gender || "",
  });
  const phoneNumberVerified = state.session.verifyPhone && state.session.verifyPhone.phoneNumber === payload.phone_number && state.session.verifyPhone.verified;
  const phoneNumberRequired = state.metadata.mandatoryScopes.includes("phone");

  // handlers
  const { nav } = useNavigation();
  const {loading, errors, setErrors, withLoading} = useWithLoading();
  const [handlePayloadSubmit, handlePayloadSubmitLoading] = withLoading(async () => {
    const { phone_number, birthdate, gender } = payload;
    const data = {
      submit: false,
      claims: {
        phone_number: phone_number ? `${state.locale.country}|${phone_number}` : undefined,
        birthdate,
        gender,
        ...tmpClaims,
      },
      credentials: tmpCreds,
      scope: ["email", "profile", "birthdate", "gender"].concat((phoneNumberRequired || phone_number) ? "phone" : []),
    };

    return dispatch("register.submit", data)
      .then(() => {
        setErrors({});

        // verify email
        if (data.claims.phone_number && !options.register.skipPhoneVerification && !phoneNumberVerified) {
          return dispatch("verify_phone.check_phone", {
            phone_number: data.claims.phone_number,
            registered: false,
          })
            .then(() => {
              nav.navigate("verify_phone.stack", {
                screen: "verify_phone.verify",
                params: {
                  callback: "register",
                },
              });
            });

        // register user
        } else {
          return dispatch("register.submit", {
            ...data,
            register: true,
          })
            .then(() => {
              nav.navigate("register.stack", {
                screen: "register.end",
                params: {},
              });
            });
        }
      })
      .catch(errs => setErrors(errs));
  }, [payload]);

  const [handleCancel, handleCancelLoading] = withLoading(() => {
    nav.navigate("register.stack", {
      screen: "register.index",
      params: {},
    });
    setErrors({});
  }, []);

  // render
  return (
    <ScreenLayout
      title={"Sign up"}
      subtitle={tmpClaims.email}
      loading={loading}
      error={errors.global}
      buttons={[
        {
          status: "primary",
          children: "Continue",
          onPress: handlePayloadSubmit,
          loading: handlePayloadSubmitLoading,
          tabIndex: 64,
        },
        {
          children: "Cancel",
          onPress: handleCancel,
          loading: handleCancelLoading,
          tabIndex: 65,
        },
      ]}
    >
      <Text style={{marginBottom: 30}}>
        Please enter the phone number to find the your account for the case of lost.
      </Text>

      <Form onSubmit={handlePayloadSubmit}>
        <FormInput
          autoFocus={!payload.phone_number}
          tabIndex={61}
          label={`Phone number${phoneNumberRequired ? "" : " (optional)"}`}
          placeholder={`Enter your mobile phone number (${state.locale.country})`}
          blurOnSubmit={false}
          keyboardType={"phone-pad"}
          autoCompleteType={"tel"}
          value={payload.phone_number}
          setValue={v => setPayload(p => ({...p, phone_number: v}))}
          error={errors.phone_number}
          onEnter={handlePayloadSubmit}
          icon={phoneNumberVerified ? (s) => <Icon name={"checkmark-circle-2-outline"} style={s}/> : undefined}
          style={{marginBottom: 15}}
        />

        <FormDatePicker
          tabIndex={62}
          label={"Birthdate"}
          placeholder={"Select your birthdate"}
          value={payload.birthdate}
          setValue={v => setPayload(p => ({...p, birthdate: v}))}
          error={errors.birthdate}
          style={{marginBottom: 15}}
        />

        <FormSelect
          tabIndex={63}
          label={"Gender"}
          placeholder={"Select your gender"}
          data={[{value: "male", text: "Male"}, {value: "female", text: "Female"}, {value: "other", text:"Other"}]}
          value={payload.gender}
          setValue={v => setPayload(p => ({...p, gender: v}))}
          error={errors.gender}
        />
      </Form>
    </ScreenLayout>
  );
};
