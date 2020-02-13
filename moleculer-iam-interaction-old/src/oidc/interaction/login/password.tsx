import React, { useCallback, useContext, useEffect, useState } from "react";
import { OIDCInteractionData, OIDCInteractionPage, requestOIDCInteraction, useOIDCInteractionContext } from "../";
import { Link, TextField, TextFieldStyles } from "../../styles";
import { useWithLoading } from "../hook";
import { LoginInteractionResetPassword } from "./reset-password";

export const LoginInteractionEnterPassword: React.FunctionComponent<{ oidc: OIDCInteractionData }> = ({oidc}) => {
  // states
  const context = useOIDCInteractionContext();
  const [password, setPassword] = useState("");
  const { loading, errors, setErrors, withLoading } = useWithLoading();

  const handleLogin = withLoading(async () => {
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
  }, [password]);

  const handleResetPassword = withLoading(async () => {
    context.push(<LoginInteractionResetPassword oidc={oidc}/>);
  }, []);

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
      <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
        <input type="text" name="username" value={user.email} style={{display: "none"}} readOnly />
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
          onKeyUp={e => e.key === "Enter" && handleLogin()}
          styles={TextFieldStyles.bold}
        />
      </form>
      <Link tabIndex={4} onClick={handleResetPassword} variant="small" style={{marginTop: "10px"}}>Forgot password?</Link>
    </OIDCInteractionPage>
  );
};
