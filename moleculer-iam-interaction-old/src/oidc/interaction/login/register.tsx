import React, { useState } from "react";
import { OIDCInteractionData, OIDCInteractionPage, requestOIDCInteraction, useOIDCInteractionContext } from "../index";
import { TextFieldStyles, Text, TextField, Stack, Link } from "../../styles";

/* sub pages */
import { LoginInteractionRegisterStep2 } from "./register-step2";
import { useWithLoading } from "../hook";

export const LoginInteractionRegister: React.FunctionComponent<{ oidc: OIDCInteractionData }> = ({oidc}) => {
  // states
  const context = useOIDCInteractionContext();
  const [payload, setPayload] = useState(() => ({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  }));
  const [passwordVisible, setPasswordVisible] = useState(false);
  const {loading, errors, setErrors, withLoading} = useWithLoading();

  const handleNext = withLoading(async () => {
    const result = await requestOIDCInteraction(oidc.interaction!.action!.register, {
      ...payload,
    });

    const {error} = result;
    if (error) {
      if (error.status === 422) {
        setErrors(error.detail);
      } else {
        setErrors({global: error.message});
      }
    } else {
      context.push(<LoginInteractionRegisterStep2 oidc={result}/>);
    }
  }, [payload]);

  const handleCancel = withLoading(() => context.pop(), []);

  // render
  return (
    <OIDCInteractionPage
      title={"Sign up"}
      subtitle={"Create your plco account"}
      buttons={[
        {
          primary: true,
          text: "Next",
          onClick: handleNext,
          loading,
          tabIndex: 5,
        },
        {
          text: "Cancel",
          onClick: handleCancel,
          loading,
          tabIndex: 6,
        },
      ]}
      error={errors.global}
      footer={
        <>
          <Text>When you sign up as a member, you agree to the <Link href="/help/tos" target="_blank">terms of service</Link> and the <Link href="/help/policy" target="_blank">privacy policy</Link>.</Text>
        </>
      }
    >
      <form onSubmit={(e) => {
        e.preventDefault();
        handleNext();
      }}>
        <Stack tokens={{childrenGap: 15}}>
          <TextField
            label="Name"
            type="text"
            inputMode="text"
            placeholder="Enter your name"
            autoFocus
            tabIndex={1}
            value={payload.name}
            errorMessage={errors.name}
            onChange={(e, v) => setPayload(p => ({...p, name: v!}))}
            onKeyUp={e => e.key === "Enter" && handleNext()}
            styles={TextFieldStyles.bold}
          />
          <TextField
            label="Email"
            type="text"
            inputMode="email"
            placeholder="Enter your email"
            tabIndex={2}
            value={payload.email}
            errorMessage={errors.email}
            onChange={(e, v) => setPayload(p => ({...p, email: v!}))}
            onKeyUp={e => e.key === "Enter" && handleNext()}
            styles={TextFieldStyles.bold}
          />
          <TextField
            label="Password"
            type={passwordVisible ? "text" : "password"}
            inputMode="text"
            placeholder="Enter your password"
            iconProps={{iconName: passwordVisible ? "redEye" : "hide", style: {cursor: "pointer"}, onClick: () => setPasswordVisible(!passwordVisible)}}
            tabIndex={3}
            value={payload.password}
            errorMessage={errors.password}
            onChange={(e, v) => setPayload(p => ({...p, password: v!}))}
            onKeyUp={e => e.key === "Enter" && handleNext()}
            styles={TextFieldStyles.bold}
          />
          <TextField
            label="Confirm"
            type="password"
            inputMode="text"
            placeholder="Confirm your password"
            tabIndex={4}
            value={payload.password_confirmation}
            errorMessage={errors.password_confirmation}
            onChange={(e, v) => setPayload(p => ({...p, password_confirmation: v!}))}
            onKeyUp={e => e.key === "Enter" && handleNext()}
            styles={TextFieldStyles.bold}
          />
        </Stack>
      </form>
    </OIDCInteractionPage>
  );
};
