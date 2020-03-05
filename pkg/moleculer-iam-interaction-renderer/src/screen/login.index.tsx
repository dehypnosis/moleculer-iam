import React, { useEffect, useState } from "react";
import { ScreenLayout } from "./layout";
import { PrimaryButton, DefaultButton, Link, TextField, TextFieldStyles, ButtonStyles, Separator, Stack, ThemeStyles } from "../styles";
import { useNavigation, useAppState, useWithLoading, useAppOptions } from "../hook";

export const LoginIndexScreen: React.FunctionComponent = () => {
  const { nav, route } = useNavigation();
  const { loading, errors, setErrors, withLoading } = useWithLoading();
  const [ email, setEmail ] = useState(route.params.email || "");
  const [state, dispatch] = useAppState();
  const [options] = useAppOptions();
  const [federationOptionsVisible, setFederationOptionsVisible] = useState(options.login.federationOptionsVisibleDefault === true);
  const federationProviders = state.metadata.federationProviders;

  // const handleAbort = withLoading(() => {
  //   return dispatch("login.abort")
  //     .catch((err: any) => setErrors(err));
  // });

  const handleCheckLoginEmail = withLoading(() => {
    return dispatch("login.check_email", { email })
      .then(() => {
        nav.navigate("login", {
          screen: "login.check_password",
          params: {
            email,
          },
        });
      })
      .catch((err: any) => setErrors(err));
  }, [email]);

  useEffect(() => {
      if (email) {
        console.debug("automatically continue with", email);
        handleCheckLoginEmail();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
  [],
);

  const handleFindEmail = withLoading(() => nav.navigate("find_email", {
    screen: "find_email.index",
  }));

  const handleSignUp = withLoading(() => nav.navigate("register", {
    screen: "register.index",
  }));

  const handleFederation = withLoading((provider: string) => {
    return dispatch("login.federate", { provider })
      .catch((err: any) => setErrors(err));
  });

  useEffect(() => {
    return nav.addListener("blur", () => {
      setTimeout(() => setFederationOptionsVisible(false), 500);
    });
  }, [nav]);

  return (
    <ScreenLayout
      title={"Sign In"}
      subtitle={"Enter your account"}
      error={errors.global}
      buttons={[
        {
          primary: true,
          text: "Continue",
          onClick: handleCheckLoginEmail,
          loading,
          tabIndex: 12,
        },
        {
          text: "Sign up",
          onClick: handleSignUp,
          loading,
          tabIndex: 13,
        },
      ]}
      footer={
        federationProviders.length > 0 ? (
          <>
            <Separator><span style={{color: ThemeStyles.palette.neutralTertiary}}>OR</span></Separator>
            {federationOptionsVisible ? (
              <Stack tokens={{childrenGap: 15}}>
                {federationProviders.includes("kakao") ? (
                  <PrimaryButton
                    onClick={() => handleFederation("kakao")}
                    styles={ButtonStyles.largeThin}
                    text={"Login with Kakao"}
                    style={{flex: "1 1 auto", backgroundColor: "#ffdc00", borderColor: "#ffb700", color: "black"}}
                  />
                ) : null}
                {federationProviders.includes("facebook") ? (
                  <PrimaryButton
                    onClick={() => handleFederation("facebook")}
                    styles={ButtonStyles.largeThin}
                    text={"Login with Facebook"}
                    style={{flex: "1 1 auto", backgroundColor: "#1876f2", color: "white"}}
                  />
                ): null}
                {federationProviders.includes("google") ? (
                  <DefaultButton
                    onClick={() => handleFederation("google")}
                    styles={ButtonStyles.largeThin}
                    text={"Login with Google"}
                    style={{flex: "1 1 auto", backgroundColor: "#ffffff", borderWidth: 1, color: "black"}}
                  />
                  /*
                    <Link
                      onClick={() => handleFederation("google")}
                      variant="small"
                      style={{marginTop: "10px", color: ThemeStyles.palette.neutralTertiary}}
                    >Login with Google</Link>
                 */
                ) : null}
              </Stack>
            ) : (
              <Link style={{color: ThemeStyles.palette.neutralTertiary}} onClick={() => setFederationOptionsVisible(true)}>Find more login options?</Link>
            )}
          </>
        ) : undefined
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); handleCheckLoginEmail(); }}>
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
          tabIndex={11}
          value={email}
          errorMessage={errors.email}
          onChange={(e, v) => setEmail(v || "")}
          onKeyUp={e => e.key === "Enter" && handleCheckLoginEmail()}
          styles={TextFieldStyles.bold}
        />
      </form>
      <Link onClick={handleFindEmail} tabIndex={14} variant="small" style={{marginTop: "10px"}}>Forgot email?</Link>
    </ScreenLayout>
  );
};
