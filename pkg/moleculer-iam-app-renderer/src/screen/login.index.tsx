import React, { useEffect, useState } from "react";
import { ViewStyle, TextStyle } from "react-native";
import { useNavigation, useAppState, useWithLoading, useAppOptions } from "../hook";
import { Form, FormInput, ScreenLayout } from "./component";


export const LoginIndexScreen: React.FunctionComponent = () => {
  // state
  const { nav, route } = useNavigation();
  const [email, setEmail] = useState("");
  const [state, dispatch] = useAppState();
  const [options] = useAppOptions();
  const [federationOptionsVisible, setFederationOptionsVisible] = useState(options.login.federationOptionsVisible === true);
  const federationProviders = state.metadata.federationProviders;

  // handlers
  const { loading, errors, setErrors, withLoading } = useWithLoading();

  // const handleAbort = withLoading(() => {
  //   return dispatch("login.abort")
  //     .catch((err: any) => setErrors(err));
  // });

  const [handleCheckLoginEmail, handleCheckLoginEmailLoading] = withLoading(() => {
    return dispatch("login.check_email", { email }, {
      email: "이메일",
    })
      .then(() => {
        setErrors({});
        nav.navigate("login.stack", {
          screen: "login.check_password",
          params: {
            email,
          },
        });
      })
      .catch((err: any) => setErrors(err));
  }, [email]);

  const [handleFindEmail, handleFindEmailLoading] = withLoading(() =>
    nav.navigate("find_email.stack", {
      screen: "find_email.index",
    })
  );

  const [handleSignUp, handleSignUpLoading] = withLoading(() =>
    nav.navigate("register.stack", {
      screen: "register.index",
    })
  );

  const [handleFederation, handleFederationLoading] = withLoading((provider: string) => {
    return dispatch("login.federate", { provider })
      .catch((err: any) => setErrors(err));
  });

  useEffect(() => {
    // update email when route params updated
    if (route.params.email && route.params.email !== email) {
      setEmail(route.params.email);
      setErrors({});
    }

    // submit email if has in URL params
    // if (route.params.email && route.params.change_account !== "true") {
    //   console.debug("automatically continue sign in with:", email);
    //   handleCheckLoginEmail();
    // }

    // re-hide federation options on blur
    return nav.addListener("blur", () => {
      setTimeout(() => setFederationOptionsVisible(false), 500);
    });
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [nav, route]);


  return (
    <ScreenLayout
      title={"Sign In"}
      subtitle={state.client!.client_name}
      error={errors.global}
      loading={loading}
      buttons={[
        {
          status: "primary",
          children: "Continue",
          onPress: handleCheckLoginEmail,
          loading: handleCheckLoginEmailLoading,
          tabIndex: 12,
        },
        {
          children: "Sign up",
          onPress: handleSignUp,
          loading: handleSignUpLoading,
          tabIndex: 13,
        },
        ...(
          federationProviders.length > 0 ? [
            { separator: "OR" },
            ...federationOptionsVisible ? federationProviders.map((provider, i) => {
              const { style, textStyle } = getFederationStyle(provider);
              return {
                onPress: () => { handleFederation(provider) },
                loading: handleFederationLoading,
                children: getFederationText(provider),
                tabIndex: 14 + i,
                style,
                textStyle,
                size: "medium",
              };
            }) : [
              {
                onPress: () => setFederationOptionsVisible(true),
                children: "Find more login options?",
                tabIndex: 14,
                appearance: "ghost",
                size: "small",
              }
            ],
          ] : []
        ),
        {
          onPress: handleFindEmail,
          loading: handleFindEmailLoading,
          children: "Forgot your email address?",
          appearance: "ghost",
          size: "small",
        },
      ]}
    >
      <Form onSubmit={handleCheckLoginEmail}>
        <FormInput
          label={"Email"}
          keyboardType={"email-address"}
          placeholder="Enter your email address"
          autoCompleteType={"username"}
          autoFocus
          value={email}
          setValue={setEmail}
          error={errors.email}
          onEnter={handleCheckLoginEmail}
        />
      </Form>
    </ScreenLayout>
  );
};


const federationText: {[provider: string]: string} = {
  google: "Login with Google",
  facebook: "Login with Facebook",
  kakao: "Login with Kakaotalk",
  default: "Login with {provider}",
};

const federationStyle: {[provider: string]: {style?: ViewStyle, textStyle?: TextStyle}} = {
  google: {
    style: {
      backgroundColor: "#f5f5f5",
      borderWidth: 0,
    },
    textStyle: {
      color: "#222b45",
    },
  },
  facebook: {
    style: {
      backgroundColor: "#1876f2",
      borderWidth: 0,
    },
    textStyle: {
      color: "#ffffff",
    },
  },
  kakao: {
    style: {
      backgroundColor: "#ffdc00",
      borderWidth: 0,
    },
    textStyle: {
      color: "#222b45",
    },
  },
  default: {
    style: {
      backgroundColor: "#f5f5f5",
      borderWidth: 0,
    },
    textStyle: {
      color: "#222b45",
    },
  },
};

function getFederationText(provider: string) {
  return federationText[provider] || federationText.default.replace("{provider}", provider.toLocaleUpperCase());
}

function getFederationStyle(provider: string) {
  return federationStyle[provider] || federationStyle.default;
}
