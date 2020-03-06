import React, { useEffect, useState } from "react";
import { ScreenLayout } from "./component/layout";
import { Input, Text } from "./component";
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
      subtitle={"Create an account"}
      loading={loading}
      buttons={[
        {
          status: "primary",
          children: "Continue",
          onPress: handlePayloadSubmit,
          tabIndex: 55,
        },
        {
          children: "Cancel",
          onPress: handleCancel,
          hidden: state.name === "register",
          tabIndex: 56,
        },
      ]}
      error={errors.global}
      footer={
        <>
          <Text>When you sign up as a member, you agree to the <a href={discovery.op_tos_uri!} target="_blank">terms of service</a> and the <a href={discovery.op_policy_uri!} target="_blank">privacy policy</a>.</Text>
        </>
      }
    >
      <form noValidate onSubmit={(e) => {
        e.preventDefault();
        handlePayloadSubmit();
      }}>
        <Input
          label="Name"
          // inputMode="text"
          placeholder="Enter your name"
          // tabIndex={51}
          value={payload.name}
          caption={errors.name}
          onChangeText={v => setPayload(p => ({...p, name: v!}))}
          onKeyPress={e => e.nativeEvent.key === "Enter" && handlePayloadSubmit()}
        />
        <Input
          label="Email"
          // inputMode="email"
          placeholder="Enter your email"
          autoCompleteType="username"
          // tabIndex={52}
          value={payload.email}
          caption={errors.email}
          onChangeText={v => setPayload(p => ({...p, email: v!}))}
          onKeyPress={e => e.nativeEvent.key === "Enter" && handlePayloadSubmit()}
        />
        <Input
          label="Password"
          // type={passwordVisible ? "text" : "password"}
          // inputMode="text"
          autoCompleteType="password"
          placeholder="Enter your password"
          // iconProps={{iconName: passwordVisible ? "redEye" : "hide", style: {cursor: "pointer"}, onPress: () => setPasswordVisible(!passwordVisible)}}
          // tabIndex={53}
          value={payload.password}
          caption={errors.password}
          onChangeText={v => setPayload(p => ({...p, password: v!}))}
          onKeyPress={e => e.nativeEvent.key === "Enter" && handlePayloadSubmit()}
        />
        <Input
          label="Confirm"
          // type="password"
          // inputMode="text"
          autoCompleteType="password"
          placeholder="Confirm your password"
          // tabIndex={54}
          value={payload.password_confirmation}
          caption={errors.password_confirmation}
          onChangeText={v => setPayload(p => ({...p, password_confirmation: v!}))}
          onKeyPress={e => e.nativeEvent.key === "Enter" && handlePayloadSubmit()}
        />
      </form>
    </ScreenLayout>
  );
};
