import React, { useCallback, useContext, useEffect, useState } from "react";
import { OIDCInteractionData, OIDCInteractionPage, requestOIDCInteraction, useOIDCInteractionContext } from "../";
import { TextFieldStyles, ButtonStyles, ThemeStyles, Link, TextField, Stack, PrimaryButton, Separator } from "../../styles";

/* sub pages */
import { LoginInteractionEnterPassword } from "./password";
import { LoginInteractionFindEmail } from "./find-email";
import { LoginInteractionRegister } from "./register";
import { useWithLoading } from "../hook";

export const LoginInteraction: React.FunctionComponent<{ oidc: OIDCInteractionData }> = ({oidc}) => {
  // states
  const context = useOIDCInteractionContext();
  const [email, setEmail] = useState(oidc.interaction!.data.user ? oidc.interaction!.data.user.email : oidc.interaction!.action!.submit.data.email || "");
  const [optionsVisible, setOptionsVisible] = useState(false);
  const { loading, errors, setLoading, setErrors, withLoading } = useWithLoading();
  const federationProviders: string[] = oidc.interaction!.data.federationProviders;

  // push password page right after mount when user session is alive
  useEffect(() => {
    if (oidc.interaction!.data.user) {
      context.push(<LoginInteractionEnterPassword oidc={oidc}/>);
    }
  }, []);

  const handleNext = withLoading(async () => {
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
  }, [email]);

  const handleSignUp = withLoading(async () => {
    context.push(<LoginInteractionRegister oidc={oidc}/>);
  }, []);

  const handleFindEmail = withLoading(async () => {
    context.push(<LoginInteractionFindEmail oidc={oidc}/>);
  }, []);

  const handleFederation = withLoading(async (provider: string) => {
    await requestOIDCInteraction(oidc.interaction!.action!.federate, {provider});
  }, []);

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
        federationProviders.length > 0 ? (
          <>
            <Separator><span style={{color: ThemeStyles.palette.neutralTertiary}}>OR</span></Separator>
            {optionsVisible ? (
              <Stack tokens={{childrenGap: 15}}>
                {federationProviders.includes("kakao")
                  ? <PrimaryButton checked={loading} styles={ButtonStyles.largeThin} text={"Login with Kakao"} style={{flex: "1 1 auto", backgroundColor: "#ffdc00", color: "black"}} onClick={() => handleFederation("kakao")}/>
                  : null
                }
                {federationProviders.includes("facebook")
                  ? <PrimaryButton checked={loading} styles={ButtonStyles.largeThin} text={"Login with Facebook"} style={{flex: "1 1 auto", backgroundColor: "#1876f2", color: "white"}} onClick={() => handleFederation("facebook")}/>
                  : null
                }
                {federationProviders.includes("google")
                  ? <Link onClick={() => handleFederation("google")} variant="small" style={{marginTop: "10px", color: ThemeStyles.palette.neutralTertiary}}>Login with Google</Link>
                  : null
                }
              </Stack>
            ) : (
              <Link style={{color: ThemeStyles.palette.neutralTertiary}} onClick={() => setOptionsVisible(true)}>Find more login options?</Link>
            )}
          </>
        ) : undefined
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
        <TextField
          label="Email"
          name="username"
          type="text"
          inputMode="email"
          autoComplete="username"
          autoCapitalize="off"
          autoCorrect="off"
          autoFocus
          placeholder="Enter your email"
          tabIndex={1}
          value={email}
          errorMessage={errors.email}
          onChange={(e, v) => setEmail(v || "")}
          onKeyUp={e => e.key === "Enter" && handleNext()}
          styles={TextFieldStyles.bold}
        />
      </form>
      <Link onClick={handleFindEmail} tabIndex={5} variant="small" style={{marginTop: "10px"}}>Forgot email?</Link>
    </OIDCInteractionPage>
  );
};
