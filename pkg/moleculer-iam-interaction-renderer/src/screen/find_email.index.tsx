import React, { useState } from "react";
import { ScreenLayout } from "./layout";
import { TextFieldStyles, Text, TextField } from "../styles";
import { useServerState, useWithLoading } from "../hook";
import { useNavigation, useRoute } from "@react-navigation/native";

export const FindEmailIndexScreen: React.FunctionComponent = () => {
  const nav = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState(((useRoute() as any).params || {}).phoneNumber || "");
  const {loading, errors, setErrors, withLoading} = useWithLoading();
  const { interaction, request } = useServerState();

  const handleCheckPhoneNumber = withLoading(() => {
    request("find_email.check_phone")
      .then((data: any) => {
        console.log(data);
        nav.navigate("find_email", {
          screen: "find_email.sent",
          params: {
            phoneNumber,
          },
        });
      })
      .catch((err: any) => setErrors(err))
  }, [phoneNumber]);

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
          hidden: !interaction || (interaction.name === "find_email"),
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
