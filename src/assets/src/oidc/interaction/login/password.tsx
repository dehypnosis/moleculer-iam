import React, { useCallback, useContext, useEffect, useState } from "react";
import { OIDCInteractionContext, OIDCInteractionProps, OIDCInteractionPage, requestOIDCInteraction } from "../";
import { Link, TextField, TextFieldStyles } from "../../styles";
import { useWithLoading } from "../hook";
import { LoginInteractionResetPassword } from "./reset-password";

export const LoginInteractionEnterPassword: React.FunctionComponent<{ oidc: OIDCInteractionProps }> = ({oidc}) => {
  // states
  const context = useContext(OIDCInteractionContext);
  const [password, setPassword] = useState("");
  const { loading, errors, setErrors, withLoading } = useWithLoading();

  const handleLogin = useCallback(() => withLoading(async () => {
    const result = await requestOIDCInteraction(oidc.interaction!.action!.submit, {
      email: oidc.interaction!.data.user.email,
      password,
    });
    const { error, redirect } = result;
    if (error) {
      if (error.status === 422) {
        setErrors(error.detail);
      } else {
        setErrors({password: error.message});
      }
    } else if (redirect) {
      window.location.assign(redirect);
      await new Promise(() => {});
    } else {
      console.error("stuck to handle interaction:", oidc);
    }
  }), [withLoading, password]);

  const handleResetPassword = useCallback(() => withLoading(async () => {
    context.push(<LoginInteractionResetPassword oidc={oidc}/>);
  }), [withLoading]);

  // render
  const { user, client } = oidc.interaction!.data!;
  return (
    <OIDCInteractionPage
      title={`Hi, ${user.name}`}
      subtitle={user.email}
      buttons={[
        {
          primary: true,
          text: "Login",
          onClick: handleLogin,
          loading,
          tabIndex: 2,
        },
        {
          text: "Cancel",
          onClick: () => context.pop(),
          tabIndex: 3,
        },
      ]}
      error={errors.global}
    >
      <TextField
        label="Password"
        type="password"
        inputMode="text"
        placeholder="Enter your password"
        autoFocus
        tabIndex={1}
        value={password}
        errorMessage={errors.password}
        onChange={(e, v) => setPassword(v || "")}
        onKeyUp={e => e.key === "Enter" && !loading && handleLogin()}
        styles={TextFieldStyles.bold}
      />
      <Link tabIndex={4} onClick={handleResetPassword} variant="small" style={{marginTop: "10px"}}>Forgot password?</Link>
    </OIDCInteractionPage>
  );
};
