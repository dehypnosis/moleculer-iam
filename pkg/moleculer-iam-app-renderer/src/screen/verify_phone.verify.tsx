import React, { useEffect, useState } from "react";
import { Text, TextField, TextFieldStyles } from "../styles";
import { useNavigation, useAppState, useWithLoading } from "../hook";
import { ScreenLayout } from "./component/layout";

export const VerifyPhoneVerifyScreen: React.FunctionComponent = () => {
  // states
  const [ code, setCode ] = useState("");
  const { nav, route } = useNavigation();
  const { phoneNumber = "", ttl = 0, callback = "" } = route.params;
  const [remainingSeconds, setRemainingSeconds] = useState(ttl as number);
  const [state, dispatch] = useAppState();

  useEffect(() => {
    const timer = setInterval(() => setRemainingSeconds(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, []);

  // handlers
  const { loading, errors, setErrors, withLoading } = useWithLoading();
  const handleVerify = withLoading(() => {
    if (callback === "register") {
      nav.navigate("register", {
        screen: "register.end",
        params: {
          email: "tod@do.com",
        },
      });
    } else {
      nav.navigate("verify_phone", {
        screen: "verify_phone.end",
        params: {
          phoneNumber,
        },
      });
    }
  }, [nav, phoneNumber, callback]);
  const handleResend = withLoading(() => {
    setRemainingSeconds(500);
    setCode("");
  });
  const handleCancel = withLoading(() => {
    if (state.name === "register") {
      nav.navigate("register", {
        screen: "register.detail",
        params: {},
      });
    } else if (state.name === "login" || state.name === "consent") {
      nav.navigate("login", {
        screen: "login.index",
        params: {},
      });
    }
  }, []);

  // render
  return (
    <ScreenLayout
      title={`Verify phone number`}
      subtitle={phoneNumber}
      buttons={[
        {
          status: "primary",
          children: "Continue",
          onPress: handleVerify,
          tabIndex: 22,
        },
        {
          children: "Resend",
          onPress: handleResend,
          tabIndex: 23,
        },
        {
          children: "Cancel",
          onPress: handleCancel,
          hidden: state.name === "verify_phone",
          tabIndex: 24,
        },
      ]}
      loading={loading}
      error={errors.global}
    >
      <Text>
        Enter the received 6-digit verification code.
      </Text>
      <TextField
        label="Verification code"
        type="tel"
        inputMode="tel"
        placeholder="Enter the verification code"
        autoFocus
        tabIndex={21}
        value={code}
        errorMessage={errors.code}
        description={`${(Math.floor(remainingSeconds / 60)).toString().padStart(2, "0")}:${(remainingSeconds % 60).toString().padStart(2, "0")}`}
        onChange={(e, v) => setCode(v || "")}
        onKeyUp={e => e.key === "Enter" && handleVerify()}
        styles={TextFieldStyles.bold}
      />
    </ScreenLayout>
  );
};
