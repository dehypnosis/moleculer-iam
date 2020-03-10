import React, { useState } from "react";
import { ScreenLayout, Text, Form, FormInput, Icon } from "./component";
import { useNavigation, useAppState, useWithLoading, useAppOptions } from "../hook";

export const RegisterIndexScreen: React.FunctionComponent = () => {
  // state
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

    return dispatch("register.submit", data)
      .then(() => {
        setErrors({});

        // verify email
        if (!options.register.skipEmailVerification && !emailVerified) {
          return dispatch("verify_email.check_email", {
            email: data.claims.email,
            registered: false,
          })
            .then(() => {
              nav.navigate("verify_email.stack", {
                screen: "verify_email.verify",
                params: {
                  callback: "register",
                },
              });
            });

        // enter detail claims
        } else if (!options.register.skipDetailClaims) {
          nav.navigate("register.stack", {
            screen: "register.detail",
            params: {},
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
    nav.navigate("login.stack", {
      screen: "login.index",
      params: {},
    });
    setErrors({});
  }, []);

  // render
  const discovery = state.metadata.discovery;
  return (
    <ScreenLayout
      title={"Sign up"}
      subtitle={"Create an account"}
      loading={loading}
      error={errors.global}
      buttons={[
        {
          status: "primary",
          children: "Continue",
          onPress: handlePayloadSubmit,
          loading: handlePayloadSubmitLoading,
          tabIndex: 55,
        },
        {
          size: "medium",
          group: [
            {
              children: "Privacy policy",
              onPress: () => window.open(discovery.op_policy_uri!, "_blank"),
              disabled: !discovery.op_policy_uri,
              tabIndex: 4,
            },
            {
              children: "Terms of service",
              onPress: () => window.open(discovery.op_tos_uri!, "_blank"),
              disabled: !discovery.op_tos_uri,
              tabIndex: 5,
            },
          ],
        },
        {
          size: "medium",
          children: "Cancel",
          onPress: handleCancel,
          loading: handleCancelLoading,
          hidden: !state.routes.login,
          tabIndex: 56,
        },
      ]}
    >
      <Form onSubmit={handlePayloadSubmit}>
        <FormInput
          label={"Name"}
          tabIndex={51}
          keyboardType={"default"}
          placeholder="Enter your name"
          autoCompleteType={"name"}
          autoFocus={!payload.name}
          value={payload.name}
          setValue={v => setPayload(p => ({...p, name: v}))}
          error={errors.name}
          onEnter={handlePayloadSubmit}
          style={{marginBottom: 15}}
        />
        <FormInput
          label={"Email"}
          tabIndex={52}
          keyboardType={"email-address"}
          placeholder="Enter your email address"
          autoCompleteType={"username"}
          value={payload.email}
          setValue={v => setPayload(p => ({...p, email: v}))}
          icon={emailVerified ? (s) => <Icon name={"checkmark-circle-2-outline"} style={s}/> : undefined}
          error={errors.email}
          onEnter={handlePayloadSubmit}
          style={{marginBottom: 15}}
        />
        <FormInput
          label="Password"
          tabIndex={53}
          secureTextEntry
          autoCompleteType={"password"}
          placeholder="Enter password"
          value={payload.password}
          setValue={v => setPayload(p => ({...p, password: v }))}
          error={errors.password}
          onEnter={handlePayloadSubmit}
          style={{marginBottom: 15}}
        />
        <FormInput
          label="Confirm"
          tabIndex={54}
          secureTextEntry
          autoCompleteType={"password"}
          placeholder="Confirm password"
          value={payload.password_confirmation}
          setValue={v => setPayload(p => ({...p, password_confirmation: v }))}
          error={errors.password_confirmation}
          onEnter={handlePayloadSubmit}
        />
      </Form>
      <Text style={{marginTop: 30}}>When continue, you are agreeing to the terms of service and the privacy policy.</Text>
    </ScreenLayout>
  );
};
