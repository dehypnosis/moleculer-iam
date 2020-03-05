import React, { useEffect, useState } from "react";
import { ScreenLayout } from "./layout";
import { TextFieldStyles, Text, TextField, Stack, Link } from "../styles";
import { useNavigation, useAppState, useWithLoading } from "../hook";

export const RegisterIndexScreen: React.FunctionComponent = () => {
  const { nav } = useNavigation();
  const [payload, setPayload] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [state, dispatch] = useAppState();

  // skip if claims already saved
  useEffect(() => {
    const stored = state.session.register;

    if (stored && stored.credentials && stored.scope && stored.scope.includes("email") && stored.scope.includes("profile")) {
      const { name, email } = stored.claims;
      const { password, password_confirmation } = stored.credentials;
      setPayload({
        name,
        email,
        password,
        password_confirmation,
      });

      nav.navigate("register", {
        screen: "register.detail",
        params: {},
      });
    }
  }, []);

  const [passwordVisible, setPasswordVisible] = useState(false);
  const {loading, errors, setErrors, withLoading} = useWithLoading();

  const handlePayloadSubmit = withLoading(async () => {
    const { name, email, password, password_confirmation } = payload;
    return dispatch("register.validate", {
      claims: {
        name,
        email,
      },
      credentials: {
        password,
        password_confirmation,
      },
      scope: ["email", "profile"],
    })
      .then(() => {
        nav.navigate("register", {
          screen: "register.detail",
          params: {},
        });
      })
      .catch((err: any) => setErrors(err));
  }, [nav, payload]);

  const handleCancel = withLoading(() => nav.navigate("login", {
    screen: "login.index",
    params: {},
  }), [nav]);

  // render
  const discovery = state.metadata.discovery;
  return (
    <ScreenLayout
      title={"Sign up"}
      subtitle={"Create account"}
      loading={loading}
      buttons={[
        {
          primary: true,
          text: "Continue",
          onClick: handlePayloadSubmit,
          tabIndex: 55,
        },
        {
          text: "Cancel",
          onClick: handleCancel,
          hidden: state.name === "register",
          tabIndex: 56,
        },
      ]}
      error={errors.global}
      footer={
        <>
          <Text>When you sign up as a member, you agree to the <Link href={discovery.op_tos_uri!} target="_blank">terms of service</Link> and the <Link href={discovery.op_policy_uri!} target="_blank">privacy policy</Link>.</Text>
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
