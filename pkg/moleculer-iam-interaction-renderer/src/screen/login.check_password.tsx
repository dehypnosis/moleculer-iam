import React, { useState } from "react";
import { ScreenLayout } from "./layout";
import { Link, TextField, TextFieldStyles } from "../styles";
import { useGlobalState, useServerState, useNavigation, useWithLoading } from "../hook";

export const LoginCheckPasswordScreen: React.FunctionComponent = () => {
  const { nav } = useNavigation();
  const { globalState } = useGlobalState();
  const { email = "unknown", name = "unknown" } = globalState.user || {};
  const { loading, errors, setErrors, withLoading } = useWithLoading();
  const [password, setPassword] = useState("");

  const { request } = useServerState();
  const handleCheckLoginPassword = withLoading(async () => {
    return request("login.check_password", { email, password })
      .catch((err: any) => setErrors(err));
  }, [email, password]);

  const handleResetPassword = withLoading(() => nav.navigate("reset_password", {
    screen: "reset_password.index",
    params: {
      email,
    }
  }), [email]);

  const handleCancel = withLoading(() => nav.navigate("login", {
    screen: "login.index",
    params: {
      email,
    },
  }), [email]);

  // render
  return (
    <ScreenLayout
      title={`Hi, ${name}`}
      subtitle={email}
      buttons={[
        {
          primary: true,
          text: "Sign in",
          onClick: handleCheckLoginPassword,
          loading,
          tabIndex: 22,
        },
        {
          text: "Cancel",
          onClick: handleCancel,
          tabIndex: 23,
        },
      ]}
      error={errors.global}
    >
      <form onSubmit={(e) => { e.preventDefault(); handleCheckLoginPassword(); }}>
        <input type="text" name="username" value={email} style={{display: "none"}} readOnly />
        <TextField
          label="Password"
          autoComplete="password"
          name="password"
          type="password"
          inputMode="text"
          placeholder="Enter your password"
          autoFocus
          tabIndex={21}
          value={password}
          errorMessage={errors.password}
          onChange={(e, v) => setPassword(v || "")}
          onKeyUp={e => e.key === "Enter" && handleCheckLoginPassword()}
          styles={TextFieldStyles.bold}
        />
      </form>
      <Link tabIndex={24} onClick={handleResetPassword} variant="small" style={{marginTop: "10px"}}>Forgot password?</Link>
    </ScreenLayout>
  );
};
