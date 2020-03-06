import React, { useEffect, useState } from "react";
import { ViewStyle, TextStyle } from "react-native";
import { useNavigation, useAppState, useWithLoading, useAppOptions } from "../hook";
import { Form, FormInput, ScreenLayout } from "./component";


export const LoginIndexScreen: React.FunctionComponent = () => {
  // state
  const { nav, route } = useNavigation();
  const [email, setEmail] = useState(route.params.email as string || "");
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
    // submit email if has in URL params
    // if (route.params.email && route.params.change_account !== "true") {
    //   console.debug("automatically continue sign in with:", email);
    //   handleCheckLoginEmail();
    // }

    // re-hide federation options on blur
    return nav.addListener("blur", () => {
      setTimeout(() => setFederationOptionsVisible(false), 500);
    });
  }, [nav]);

  const client = state.client!;

  return (
    <ScreenLayout
      title={"Sign In"}
      subtitle={client.client_name}
      error={errors.global}
      loading={loading}
      buttons={[
        {
          status: "primary",
          children: "Continue",
          onPress: handleCheckLoginEmail,
          tabIndex: 12,
        },
        {
          children: "Sign up",
          onPress: handleSignUp,
          tabIndex: 13,
        },
        ...(
          federationProviders.length > 0 ? [
            { separator: "OR" },
            ...federationOptionsVisible ? federationProviders.map((provider, i) => {
              const { style, textStyle } = getFederationStyle(provider);
              return {
                onPress: () => { handleFederation(provider) },
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
          children: "Forgot account email?",
          appearance: "ghost",
          size: "small",
        },
      ]}
    >
      <Form onSubmit={handleCheckLoginEmail}>
        <FormInput
          label={"Email"}
          keyboardType={"email-address"}
          placeholder="Enter your email"
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
