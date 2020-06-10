import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { Image } from "react-native";
import { ScreenLayout, Text, FormInput } from "../component";
import { useAppState, useAppI18N, useNavigation, useWithLoading } from "../hook";
import svg from "../assets/screen_verify.svg";

export const VerifyPhoneVerifyScreen: React.FunctionComponent = () => {
  // states
  const {formatMessage: f} = useAppI18N();
  const [state, dispatch] = useAppState();
  const expiresAt = state.session.verifyPhone.expiresAt;
  const [secret, setSecret] = useState((state.session.dev && state.session.dev.verifyPhoneSecret) || "");
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
    return dispatch("verify_phone.send", {
      phone_number: state.session.verifyPhone.phoneNumber,
    }, {
      phone_number: f({id: "payload.phoneNumber"}),
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
        nav.navigate("find_email.index");
        break;
      case "register":
        nav.navigate("register.detail");
        break;
      default:
        nav.navigate("verify_phone.index");
        break;
    }
    setErrors({});
  }, [callback]);

  const [handleVerify, handleVerifyLoading] = withLoading(() => {
    return dispatch("verify_phone.verify", {
      phone_number: state.session.verifyPhone.phoneNumber,
      secret,
      callback,
    }, {
      phone_number: f({id: "payload.phoneNumber"}),
      secret: f({id: "payload.verificationCode"}),
    })
      .then(() => {
        setErrors({});
        switch (callback) {
          case "find_email":
            nav.navigate("find_email.end");
            break;
          case "register":
            nav.navigate("register.detail");
            break;
          default:
            nav.navigate("verify_phone.end");
        }
      })
      .catch(errs => setErrors(errs));
  }, [callback, state, secret, nav]);

  // render
  return (
    <ScreenLayout
      title={f({id: "verifyPhone.verifyPhone"})}
      subtitle={state.session.verifyPhone.phoneNumber}
      buttons={[
        ...(expiresAt ? [{
          status: "primary",
          children: f({id: "button.verify"}),
          onPress: handleVerify,
          loading: handleVerifyLoading,
          tabIndex: 111,
        }] : []),
        {
          status: expiresAt? "basic" : "primary",
          children: f({id: expiresAt ? "button.resend" : "button.send"}),
          onPress: handleSend,
          loading: handleSendLoading,
          tabIndex: 112,
        },
        {
          children: f({id: "button.cancel"}),
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
            {f({id: "verifyPhone.enterTheCode"})}
          </Text>
          <FormInput
            label={f({id: "payload.verificationCode"})}
            keyboardType="number-pad"
            placeholder={f({id: "placeholder.verificationCode"})}
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
            {f({id: "verifyPhone.codeGonnaBeSent"})}
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
