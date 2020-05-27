import React, { useState } from "react";
import { ScreenLayout, Text, Form, FormInput, Icon } from "../component";
import { useNavigation, useAppState, useWithLoading, useAppOptions, useI18N } from "../hook";

export const RegisterIndexScreen: React.FunctionComponent = () => {
  // state
  const { formatMessage: f } = useI18N();
  const [state, dispatch] = useAppState();
  const [options] = useAppOptions();
  const tmpState = state.session.register || {};
  const tmpClaims = tmpState.claims || {};
  const tmpCreds = tmpState.credentials || {};
  const [payload, setPayload] = useState({
    name: tmpClaims.name || "",
    email: tmpClaims.email || "",
    password: tmpCreds.password || "",
    password_confirmation: tmpCreds.password_confirmation || "",
  });

  const payloadLabels = {
    name: f({id: "payload.name"}),
    email: f({id: "payload.email"}),
    password: f({id: "payload.password"}),
    password_confirmation: f({id: "payload.passwordConfirmation"}),
  };

  const emailVerified = state.session.verifyEmail && state.session.verifyEmail.email === payload.email && state.session.verifyEmail.verified;

  // handlers
  const { nav } = useNavigation();
  const {loading, errors, setErrors, withLoading} = useWithLoading();
  const [handlePayloadSubmit, handlePayloadSubmitLoading] = withLoading(async () => {
    const { name, email, password, password_confirmation } = payload;
    const data = {
      submit: false,
      claims: {
        name,
        email,
      },
      credentials: {
        password,
        password_confirmation,
      },
      scope: ["email", "profile"],
    };

    return dispatch("register.submit", data, payloadLabels)
      .then((s) => {
        setErrors({});
        // set normalized email
        setPayload(p => ({ ...p, email: s.session.register.claims.email || "" }));

        // verify email
        if (!options.register.skipEmailVerification && !emailVerified) {
          return dispatch("verify_email.check_email", {
            email: data.claims.email,
            registered: false,
          })
            .then(() => {
              nav.navigate("verify_email.verify", {
                callback: "register",
              });
            });

        // enter detail claims
        } else if (!options.register.skipDetailClaims) {
          nav.navigate("register.detail");

        // register user
        } else {
          return dispatch("register.submit", {
            ...data,
            register: true,
          })
            .then(() => {
              nav.navigate("register.end");
            });
        }
      })
      .catch(errs => setErrors(errs));
  }, [payload]);

  const [handleCancel, handleCancelLoading] = withLoading(() => {
    nav.navigate("login.index");
    setErrors({});
  }, []);

  // render
  const discovery = state.metadata.discovery;
  return (
    <ScreenLayout
      title={f({id: "register.signUp"})}
      subtitle={f({id: "register.createAccount"})}
      loading={loading}
      error={errors.global}
      buttons={[
        {
          status: "primary",
          children: f({id: "button.continue"}),
          onPress: handlePayloadSubmit,
          loading: handlePayloadSubmitLoading,
          tabIndex: 55,
        },
        {
          size: "medium",
          group: [
            {
              children: f({id: "register.privacyPolicy"}),
              onPress: () => window.open(discovery.op_policy_uri!, "_blank"),
              disabled: !discovery.op_policy_uri,
              tabIndex: 4,
            },
            {
              children: f({id: "register.termsOfService"}),
              onPress: () => window.open(discovery.op_tos_uri!, "_blank"),
              disabled: !discovery.op_tos_uri,
              tabIndex: 5,
            },
          ],
        },
        {
          size: "medium",
          children: f({id: "button.cancel"}),
          onPress: handleCancel,
          loading: handleCancelLoading,
          hidden: !state.routes.login,
          tabIndex: 56,
        },
      ]}
    >
      <Form onSubmit={handlePayloadSubmit}>
        <FormInput
          label={payloadLabels.name}
          tabIndex={51}
          keyboardType={"default"}
          placeholder={f({id: "placeholder.name"})}
          autoCompleteType={"name"}
          autoFocus={!payload.name}
          value={payload.name}
          setValue={v => setPayload(p => ({...p, name: v}))}
          error={errors.name}
          onEnter={handlePayloadSubmit}
          style={{marginBottom: 15}}
        />
        <FormInput
          label={payloadLabels.email}
          tabIndex={52}
          keyboardType={"email-address"}
          placeholder={f({id: "placeholder.email"})}
          autoCompleteType={"username"}
          value={payload.email}
          setValue={v => setPayload(p => ({...p, email: v}))}
          accessoryRight={emailVerified ? (evaProps) => <Icon {...evaProps} name={"checkmark-circle-2-outline"} /> : undefined}
          error={errors.email}
          onEnter={handlePayloadSubmit}
          style={{marginBottom: 15}}
        />
        <FormInput
          label={payloadLabels.password}
          tabIndex={53}
          secureTextEntry
          autoCompleteType={"password"}
          placeholder={f({id: "placeholder.password"})}
          value={payload.password}
          setValue={v => setPayload(p => ({...p, password: v }))}
          error={errors.password}
          onEnter={handlePayloadSubmit}
          style={{marginBottom: 15}}
        />
        <FormInput
          label={payloadLabels.password_confirmation}
          tabIndex={54}
          secureTextEntry
          autoCompleteType={"password"}
          placeholder={f({id: "placeholder.passwordConfirmation"})}
          value={payload.password_confirmation}
          setValue={v => setPayload(p => ({...p, password_confirmation: v }))}
          error={errors.password_confirmation}
          onEnter={handlePayloadSubmit}
        />
      </Form>
      <Text style={{marginTop: 30}}>
        {f({id: "register.continueThenAgreed"})}
      </Text>
    </ScreenLayout>
  );
};
