import React, { useState } from "react";
import { ScreenLayout } from "./layout";
import { TextFieldStyles, Text, TextField, Stack, Link } from "../styles";
import { useServerState, useWithLoading } from "../hook";
import { useNavigation } from "@react-navigation/native";

export const RegisterIndexScreen: React.FunctionComponent = () => {
  const nav = useNavigation();
  const [payload, setPayload] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const {loading, errors, setErrors, withLoading} = useWithLoading();
  const handlePayloadSubmit = withLoading(async () => {
    // TODO ...
    nav.navigate("register", {
      screen: "register.detail",
      params: {},
    });
  }, [nav, payload]);
  const handleCancel = withLoading(() => nav.navigate("login", {
    screen: "login.index",
    params: {},
  }), [nav]);

  const { metadata } = useServerState();

  // render
  return (
    <ScreenLayout
      title={"Sign up"}
      subtitle={"Create account"}
      buttons={[
        {
          primary: true,
          text: "Continue",
          onClick: handlePayloadSubmit,
          loading,
          tabIndex: 55,
        },
        {
          text: "Cancel",
          onClick: handleCancel,
          loading,
          tabIndex: 56,
        },
      ]}
      error={errors.global}
      footer={
        <>
          <Text>When you sign up as a member, you agree to the <Link href={metadata.op_tos_uri} target="_blank">terms of service</Link> and the <Link href={metadata.op_policy_uri} target="_blank">privacy policy</Link>.</Text>
        </>
      }
    >
      <form onSubmit={(e) => {
        e.preventDefault();
        handlePayloadSubmit();
      }}>
        <Stack tokens={{childrenGap: 15}}>
          <TextField
            label="Name"
            type="text"
            inputMode="text"
            placeholder="Enter your name"
            autoFocus
            tabIndex={51}
            value={payload.name}
            errorMessage={errors.name}
            onChange={(e, v) => setPayload(p => ({...p, name: v!}))}
            onKeyUp={e => e.key === "Enter" && handlePayloadSubmit()}
            styles={TextFieldStyles.bold}
          />
          <TextField
            label="Email"
            type="text"
            inputMode="email"
            placeholder="Enter your email"
            autoComplete="username"
            tabIndex={52}
            value={payload.email}
            errorMessage={errors.email}
            onChange={(e, v) => setPayload(p => ({...p, email: v!}))}
            onKeyUp={e => e.key === "Enter" && handlePayloadSubmit()}
            styles={TextFieldStyles.bold}
          />
          <TextField
            label="Password"
            type={passwordVisible ? "text" : "password"}
            inputMode="text"
            autoComplete="password"
            placeholder="Enter your password"
            iconProps={{iconName: passwordVisible ? "redEye" : "hide", style: {cursor: "pointer"}, onClick: () => setPasswordVisible(!passwordVisible)}}
            tabIndex={53}
            value={payload.password}
            errorMessage={errors.password}
            onChange={(e, v) => setPayload(p => ({...p, password: v!}))}
            onKeyUp={e => e.key === "Enter" && handlePayloadSubmit()}
            styles={TextFieldStyles.bold}
          />
          <TextField
            label="Confirm"
            type="password"
            inputMode="text"
            autoComplete="password"
            placeholder="Confirm your password"
            tabIndex={54}
            value={payload.password_confirmation}
            errorMessage={errors.password_confirmation}
            onChange={(e, v) => setPayload(p => ({...p, password_confirmation: v!}))}
            onKeyUp={e => e.key === "Enter" && handlePayloadSubmit()}
            styles={TextFieldStyles.bold}
          />
        </Stack>
      </form>
    </ScreenLayout>
  );
};
