import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { Image } from "react-native";
import { ScreenLayout, Text, FormInput } from "./component";
import { useAppState, useNavigation, useWithLoading } from "../hook";
import svg from "../assets/screen_verify.svg";

export const VerifyPhoneVerifyScreen: React.FunctionComponent = () => {
  // states
  const [state, dispatch] = useAppState();
  const expiresAt = state.session.verifyPhone.expiresAt;
  const [secret, setSecret] = useState(state.session.dev && state.session.dev.verifyPhoneSecret || "");
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
  }, [state]);

  // handlers
  const { loading, errors, setErrors, withLoading } = useWithLoading();
  const { nav, route } = useNavigation();
  const { callback = "" } = route.params;
  const [handleSend, handleSendLoading] = withLoading(() => {
    return dispatch("verify_phone.send", {
      phone_number: state.session.verifyPhone.phoneNumber,
    })
      .then((s) => {
        setErrors({});

        // for dev
        if (s.session.dev && s.session.dev.verifyPhoneSecret) {
          console.debug("set secret automatically by dev mode");
          setSecret(s.session.dev.verifyPhoneSecret);
        }

        updateRemainingSeconds();
      })
      .catch(errs => setErrors(errs));
  }, [state]);

  const [handleCancel, handleCancelLoading] = withLoading(() => {
    switch (callback) {
      case "find_email":
        nav.navigate("find_email.stack", {
          screen: "find_email.index",
          params: {},
        });
        break;
      default:
        nav.navigate("verify_phone.stack", {
          screen: "verify_phone.index",
          params: {},
        });
        break;
    }
    setErrors({});
  }, [callback]);

  const [handleVerify, handleVerifyLoading] = withLoading(() => {
    return dispatch("verify_phone.verify", {
      phone_number: state.session.verifyPhone.phoneNumber,
      secret,
      callback,
    })
      .then(() => {
        setErrors({});
        switch (callback) {
          case "find_email":
            nav.navigate("find_email.stack", {
              screen: "find_email.end",
              params: {},
            });
          break;
          default:
            nav.navigate("verify_phone.stack", {
              screen: "verify_phone.end",
              params: {},
            });
        }
      })
      .catch(errs => setErrors(errs));
  }, [callback, state, secret, nav]);

  // render
  return (
    <ScreenLayout
      title={`Verify phone number`}
      subtitle={state.session.verifyPhone.phoneNumber}
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
            A text message with a verification code will be sent to verify the phone number.
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
