import React, { useEffect, useState } from "react";
import { Text, TextField, TextFieldStyles } from "../styles";
import { useNavigation, useWithLoading } from "../hook";
import { ScreenLayout } from "./layout";

export const VerifyPhoneSentScreen: React.FunctionComponent = () => {
  // states
  const {loading, errors, setErrors, withLoading} = useWithLoading();
  const [code, setCode] = useState("");
  const { nav, route } = useNavigation();
  const { phoneNumber = "", ttl = 0, callback = "" } = route.params;
  const [remainingSeconds, setRemainingSeconds] = useState(ttl as number);

  useEffect(() => {
    const timer = setInterval(() => setRemainingSeconds(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, []);

  // handlers
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
    if (callback === "register") {
      nav.navigate("register", {
        screen: "register.detail",
        params: {},
      });
    } else {
      nav.navigate("login", {
        screen: "login.index",
        params: {},
      });
    }
  }, [nav, phoneNumber, callback]);

  // render
  return (
    <ScreenLayout
      title={`Verify phone number`}
      subtitle={phoneNumber}
      buttons={[
        {
          primary: true,
          text: "Continue",
          onClick: handleVerify,
          loading,
          tabIndex: 22,
        },
        {
          text: "Resend",
          onClick: handleResend,
          loading,
          tabIndex: 23,
        },
        {
          text: "Cancel",
          onClick: handleCancel,
          loading,
          tabIndex: 24,
        },
      ]}
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
