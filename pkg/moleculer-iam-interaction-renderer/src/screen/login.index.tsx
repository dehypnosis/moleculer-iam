import React, { useEffect, useState } from "react";
import { ViewStyle, TextStyle } from "react-native";
import { ScreenLayout } from "./layout";
import { Separator, Button, Input, Spinner, withAttrs } from "./component";
import { useNavigation, useAppState, useWithLoading, useAppOptions } from "../hook";


export const LoginIndexScreen: React.FunctionComponent = () => {
  // state
  const { nav, route } = useNavigation();
  const [email, setEmail] = useState(route.params.email || "");
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
      loading={loading}
      buttons={[
        {
          primary: true,
          text: "Continue",
          onClick: handleCheckLoginEmail,
          tabIndex: 12,
        },
        {
          text: "Sign up",
          onClick: handleSignUp,
          tabIndex: 13,
        },
      ]}
      footer={(
        <>
          {federationProviders.length > 0 ? (
            <>
              <Separator text={"OR"}/>
              {federationOptionsVisible ? federationProviders.map(provider => {
                const { style, textStyle } = getFederationStyle(provider);
                return (
                  <Button
                    key={provider}
                    onPress={() => handleFederation(provider)}
                    children={getFederationText(provider)}
                    status={"basic"}
                    size={"medium"}
                    style={{marginBottom: 15, ...style}}
                    textStyle={textStyle}
                  />
                )
              }) : (
                <Button
                  onPress={() => setFederationOptionsVisible(true)}
                  appearance={"ghost"} size={"small"} status={"basic"}
                  style={{marginBottom: 15}}
                >Find more login options?</Button>
              )}
            </>
          ) : null}
          <Button
            onPress={handleFindEmail}
            appearance={"ghost"} size={"small"} status={"basic"}
          >Forgot email?</Button>
        </>
      )}
    >
      <form noValidate onSubmit={(e) => { e.preventDefault(); handleCheckLoginEmail(); }}>
        <Input
          ref={withAttrs({ tabindex: 11, autofocus: true }, "input")}
          label="Email"
          autoCapitalize={"none"}
          autoCorrect={false}
          autoFocus={true}
          blurOnSubmit={false}
          keyboardType={"email-address"}
          returnKeyType={"next"}
          autoCompleteType={"username"}
          placeholder="Enter your email"
          value={email}
          caption={errors.email}
          status={errors.email ? "danger" : "basic"}
          onChangeText={v => setEmail(v || "")}
          clearButtonMode={"while-editing"}
          onKeyPress={e => e.nativeEvent.key === "Enter" && handleCheckLoginEmail()}
          size={"large"}
        />
      </form>
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
