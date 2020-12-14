import React, { useEffect, useState } from "react";
import { ViewStyle, TextStyle } from "react-native";
import { useNavigation, useAppState, useWithLoading, useAppOptions, useAppI18N } from "../hook";
import { Form, FormInput, ScreenLayout } from "../component";


export const LoginIndexScreen: React.FunctionComponent = () => {
  // state
  const { formatMessage: f } = useAppI18N();
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
      email: f({id: "payload.email"}),
    })
      .then(() => {
        setErrors({});
        nav.navigate("login.check_password", {
          email,
        });
      })
      .catch((err: any) => setErrors(err));
  }, [email]);

  const [handleFindEmail, handleFindEmailLoading] = withLoading(() =>
    nav.navigate("find_email.index")
  );

  const [handleSignUp, handleSignUpLoading] = withLoading(() =>
    nav.navigate("register.index")
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
      title={f({id: "login.signIn"})}
      subtitle={state.client!.client_name}
      error={errors.global}
      loading={loading}
      buttons={[
        {
          status: "primary",
          children: f({id: "button.continue"}),
          onPress: handleCheckLoginEmail,
          loading: handleCheckLoginEmailLoading,
          tabIndex: 12,
        },
        {
          children: f({id: "button.signUp"}),
          onPress: handleSignUp,
          loading: handleSignUpLoading,
          tabIndex: 13,
        },
        ...(
          federationProviders.length > 0 ? [
            { separator: f({id: "separator.or"}), },
            ...federationOptionsVisible ? federationProviders.map((provider: string, i: number) => {
              const { style, textStyle } = getFederationStyle(provider);
              return {
                onPress: () => { handleFederation(provider) },
                loading: handleFederationLoading,
                children: f({id: `login.federate.${provider.toLowerCase()}`, defaultMessage: f({id: `login.federate.default`}, { provider: provider.toUpperCase() })}, { provider: provider.toUpperCase() }),
                tabIndex: 14 + i,
                style,
                textStyle,
                size: "medium",
              };
            }) : [
              {
                onPress: () => setFederationOptionsVisible(true),
                children: f({id: "login.showMoreLoginOptions"}),
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
          children: f({id: "login.findEmail"}),
          appearance: "ghost",
          size: "small",
        },
      ]}
    >
      <Form onSubmit={handleCheckLoginEmail}>
        <FormInput
          label={f({id: "payload.email"})}
          keyboardType={"email-address"}
          placeholder={f({id: "placeholder.email"})}
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
  apple: {
    style: {
      backgroundColor: "#000",
      borderWidth: 0,
    },
    textStyle: {
      color: "#ffffff",
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

function getFederationStyle(provider: string) {
  return federationStyle[provider] || federationStyle.default;
}
