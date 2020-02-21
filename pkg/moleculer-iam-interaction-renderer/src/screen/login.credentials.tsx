import React, { useState } from "react";
import { ScreenLayout } from "./layout";
import { Link, TextField, TextFieldStyles } from "../styles";
import { useWithLoading } from "../hook";
import { useNavigation, useRoute } from "@react-navigation/native";

export const LoginCredentialsScreen: React.FunctionComponent = () => {
  const nav = useNavigation();
  const { email = "", name = "" } = (useRoute() as any).params || {};
  const { loading, errors, setErrors, withLoading } = useWithLoading();
  const [password, setPassword] = useState("");

  const handleCheckLoginPassword = withLoading(async () => {
    // TODO
  }, [password]);

  const handleResetPassword = withLoading(() => nav.navigate("reset_password", {
    screen: "reset_password.index",
    params: {
      email,
    }
  }), [nav, email]);

  const handleCancel = withLoading(() => nav.navigate("login", {
      screen: "login.index",
      params: {
        email,
      },
    }), [nav, email]);

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
          tabIndex: 2,
        },
        {
          text: "Cancel",
          onClick: handleCancel,
          tabIndex: 3,
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
          tabIndex={1}
          value={password}
          errorMessage={errors.password}
          onChange={(e, v) => setPassword(v || "")}
          onKeyUp={e => e.key === "Enter" && handleCheckLoginPassword()}
          styles={TextFieldStyles.bold}
        />
      </form>
      <Link tabIndex={4} onClick={handleResetPassword} variant="small" style={{marginTop: "10px"}}>Forgot password?</Link>
    </ScreenLayout>
  );
};
