import React, { useState } from "react";
import { ScreenLayout } from "./layout";
import { TextFieldStyles, Text, TextField } from "../styles";
import { useAppState, useWithLoading, useNavigation } from "../hook";

export const FindEmailIndexScreen: React.FunctionComponent = () => {
  const { nav, route } = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState(route.params.phoneNumber || "");
  const { loading, errors, setErrors, withLoading } = useWithLoading();
  const [state, dispatch] = useAppState();

  const handleCheckPhoneNumber = withLoading(() => {
    dispatch("find_email.check_phone")
      .then((data: any) => {
        console.log(data);
        nav.navigate("find_email", {
          screen: "find_email.verify",
          params: {
            phoneNumber,
          },
        });
      })
      .catch((err: any) => setErrors(err))
  }, [phoneNumber, state]);

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
          hidden: state.name === "find_email",
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
