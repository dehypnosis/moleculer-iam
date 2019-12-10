import React, { useCallback, useContext, useEffect, useState } from "react";
import { OIDCInteractionContext, OIDCInteractionProps, OIDCInteractionPage, requestOIDCInteraction } from "../";
import { TextFieldStyles, ButtonStyles, ThemeStyles, Link, TextField, Stack, PrimaryButton, Separator } from "../../styles";

/* sub pages */
import { LoginInteractionEnterPassword } from "./password";
import { LoginInteractionFindEmail } from "./find-email";
import { useWithLoading } from "../hook";

export const LoginInteraction: React.FunctionComponent<{ oidc: OIDCInteractionProps }> = ({oidc}) => {
  // states
  const context = useContext(OIDCInteractionContext);
  const [email, setEmail] = useState(oidc.interaction!.data.user ? oidc.interaction!.data.user.email : oidc.interaction!.action!.submit.data.email || "");
  const [optionsVisible, setOptionsVisible] = useState(false);
  const { loading, errors, setLoading, setErrors, withLoading } = useWithLoading();

  // push password page right after mount when user session is alive
  useEffect(() => {
    if (oidc.interaction!.data.user) {
      context.push(<LoginInteractionEnterPassword oidc={oidc}/>);
    }
  }, []);

  const handleNext = useCallback(() => withLoading(async () => {
    const result = await requestOIDCInteraction(oidc.interaction!.action!.submit, {
      email,
    });

    const {error} = result;
    if (error) {
      if (error.status === 422) {
        setErrors(error.detail);
      } else {
        setErrors({email: error.message});
      }
    } else {
      context.push(<LoginInteractionEnterPassword oidc={result}/>);
    }
  }), [withLoading, email]);

  const handleSignUp = useCallback(() => withLoading(async () => {
    await requestOIDCInteraction(oidc.interaction!.action!.register);
  }), [withLoading]);

  const handleFindEmail = useCallback(() => withLoading(async () => {
    context.push(<LoginInteractionFindEmail oidc={oidc}/>);
  }), [withLoading]);

  const handleFederation = useCallback((provider: string) => withLoading(async () => {
    await requestOIDCInteraction(oidc.interaction!.action!.federate, {provider});
  }), [withLoading]);

  // render
  return (
    <OIDCInteractionPage
      title={"Sign in"}
      subtitle={"Use your plco account"}
      buttons={[
        {
          primary: true,
          text: "Next",
          onClick: handleNext,
          loading,
          tabIndex: 2,
        },
        {
          text: "Sign up",
          onClick: handleSignUp,
          loading,
          tabIndex: 3,
        },
      ]}
      error={errors.global}
      footer={
        <>
          <Separator><span style={{color: ThemeStyles.palette.neutralTertiary}}>OR</span></Separator>
          {optionsVisible ? (
            <Stack tokens={{childrenGap: 15}}>
              <PrimaryButton checked={loading} styles={ButtonStyles.largeThin} text={"Login with KakaoTalk"} style={{flex: "1 1 auto", backgroundColor: "#ffdc00", color: "black"}} onClick={() => handleFederation("kakaotalk")}/>
              <PrimaryButton checked={loading} styles={ButtonStyles.largeThin} text={"Login with Facebook"} style={{flex: "1 1 auto", backgroundColor: "#1876f2", color: "white"}} onClick={() => handleFederation("facebook")}/>
            </Stack>
          ) : (
            <Link style={{color: ThemeStyles.palette.neutralTertiary}} onClick={() => setOptionsVisible(true)}>Find more login options?</Link>
          )}
        </>
      }
    >
      <TextField
        label="Email"
        type="text"
        inputMode="email"
        placeholder="Enter your email"
        autoFocus
        tabIndex={1}
        value={email}
        errorMessage={errors.email}
        onChange={(e, v) => setEmail(v || "")}
        onKeyUp={e => e.key === "Enter" && handleNext()}
        styles={TextFieldStyles.bold}
      />
      <Link onClick={handleFindEmail} tabIndex={5} variant="small" style={{marginTop: "10px"}}>Forgot email?</Link>
    </OIDCInteractionPage>
  );
};
