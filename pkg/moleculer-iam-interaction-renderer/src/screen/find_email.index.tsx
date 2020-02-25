import React, { useState } from "react";
import { ScreenLayout } from "./layout";
import { TextFieldStyles, Text, TextField } from "../styles";
import { useWithLoading } from "../hook";
import { useNavigation } from "@react-navigation/native";

export const FindEmailIndexScreen: React.FunctionComponent = () => {
  const nav = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState("");
  const {loading, errors, setErrors, withLoading} = useWithLoading();

  const handleCheckPhoneNumber = withLoading(() => nav.navigate("find_email", {
    screen: "find_email.sent",
    params: {
      phoneNumber,
    },
  }), [phoneNumber]);

  const handleCancel = withLoading(() => nav.navigate("login", {
    screen: "login.index",
    params: {},
  }));

  // render
  return (
    <ScreenLayout
      title={`Find email`}
      subtitle={`Enter your phone number`}
      buttons={[
        {
          primary: true,
          text: "Continue",
          onClick: handleCheckPhoneNumber,
          loading,
          tabIndex: 22,
        },
        {
          text: "Cancel",
          onClick: handleCancel,
          loading,
          tabIndex: 23,
        },
      ]}
      error={errors.global}
    >
      <Text>
        Have a registered phone number? Can find the ID only if have one.
      </Text>
      <TextField
        label="Phone number"
        type="tel"
        inputMode="tel"
        placeholder="Enter your mobile phone number"
        autoFocus
        tabIndex={21}
        value={phoneNumber}
        errorMessage={errors.phone_number}
        onChange={(e, v) => setPhoneNumber(v || "")}
        onKeyUp={e => e.key === "Enter" && handleCheckPhoneNumber()}
        styles={TextFieldStyles.bold}
      />
    </ScreenLayout>
  );
};
