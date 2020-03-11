import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { Image } from "react-native";
import { useAppState, useNavigation, useWithLoading } from "../hook";
import { ScreenLayout, FormInput, Text } from "./component";
import svg from "../assets/screen_sent.svg";

export const VerifyEmailVerifyScreen: React.FunctionComponent = () => {
  // states
  const [state, dispatch] = useAppState();
  const email = state.session.verifyEmail.email;
  const expiresAt = state.session.verifyEmail.expiresAt;
  const [secret, setSecret] = useState((state.session.dev && state.session.dev.verifyEmailSecret) || "");
  const [remainingSeconds, setRemainingSeconds] = useState("00:00");
  const updateRemainingSeconds = useCallback(() => {
    let updated = "";
    if (expiresAt) {
      const seconds = Math.max(moment(expiresAt).diff(moment.now(), "s"), 0);
      updated =`${(Math.floor(seconds / 60)).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
    }
    if (updated !== remainingSeconds) {
      setRemainingSeconds(updated);
    }
  }, [expiresAt, remainingSeconds]);

  useEffect(() => {
    updateRemainingSeconds();
    const timer = setInterval(updateRemainingSeconds, 500);
    return () => clearInterval(timer);
  }, [updateRemainingSeconds]);

  // handlers
  const { loading, errors, setErrors, withLoading } = useWithLoading();
  const { nav, route } = useNavigation();
  const { callback = "" } = route.params;
  const [handleSend, handleSendLoading] = withLoading(() => {
    return dispatch("verify_email.send", {
      email,
    }, {
      email: "이메일",
    })
      .then((s) => {
        setErrors({});

        // for dev
        if (s.session.dev && s.session.dev.verifyEmailSecret) {
          console.debug("set secret automatically by dev mode");
          setSecret(s.session.dev.verifyEmailSecret);
        }

        updateRemainingSeconds();
      })
      .catch(errs => setErrors(errs));
  }, [state]);

  const [handleCancel, handleCancelLoading] = withLoading(() => {
    switch (callback) {
      case "reset_password":
        if (state.routes.login) {
          nav.navigate("login.stack", {
            screen: "login.check_password",
            params: {},
          });
        } else {
          nav.navigate("reset_password.stack", {
            screen: "reset_password.index",
            params: {},
          });
        }
        break;
      case "register":
        nav.navigate("register.stack", {
          screen: "register.index",
          params: {},
        });
        break;
      default:
        nav.navigate("verify_email.stack", {
          screen: "verify_email.index",
          params: {},
        });
        break;
    }
    setErrors({});
  }, [callback]);

  const [handleVerify, handleVerifyLoading] = withLoading(() => {
    return dispatch("verify_email.verify", {
      email,
      secret,
      callback,
    })
      .then(() => {
        setErrors({});
        switch (callback) {
          case "reset_password":
            nav.navigate("reset_password.stack", {
              screen: "reset_password.set",
              params: {},
            });
            break;
          case "register":
            nav.navigate("register.stack", {
              screen: "register.index",
              params: {},
            });
            break;
          default:
            nav.navigate("verify_email.stack", {
              screen: "verify_email.end",
              params: {},
            });
        }
      })
      .catch(errs => setErrors(errs));
  }, [callback, state, secret]);

  // render
  return (
    <ScreenLayout
      title={`Verify email address`}
      subtitle={email}
      buttons={[
        ...(expiresAt ? [{
          status: "primary",
          children: "Verify",
          onPress: handleVerify,
          loading: handleVerifyLoading,
          tabIndex: 111,
        }] : []),
        {
          status: expiresAt? "basic" : "primary",
          children: expiresAt ? "Resend" : "Send",
          onPress: handleSend,
          loading: handleSendLoading,
          tabIndex: 112,
        },
        {
          children: "Cancel",
          onPress: handleCancel,
          loading: handleCancelLoading,
          tabIndex: 113,
        },
      ]}
      loading={loading}
      error={errors.global}
    >
      {expiresAt ? (
        <>
          <Text style={{marginBottom: 30}}>
            Enter the received 6-digit verification code.
          </Text>
          <FormInput
            label="Verification code"
            keyboardType="number-pad"
            placeholder="Enter the verification code"
            autoFocus
            tabIndex={110}
            blurOnSubmit={false}
            value={secret}
            setValue={setSecret}
            error={errors.code}
            caption={remainingSeconds}
            onEnter={handleVerify}
          />
        </>
      ): (
        <>
          <Text style={{marginBottom: 30}}>
            An email with a verification code will be sent to verify the email address.
          </Text>
          <Image
            source={{uri: svg}}
            style={{ minHeight: 200, maxHeight: 300, resizeMode: "contain"}}
          />
        </>
      )}
    </ScreenLayout>
  );
};
