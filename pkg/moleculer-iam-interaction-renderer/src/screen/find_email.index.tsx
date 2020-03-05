import React, { useState } from "react";
import { ScreenLayout } from "./layout";
import { useAppState, useWithLoading, useNavigation } from "../hook";
import { Text, Input, withAttrs } from "./component";

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
      loading={loading}
      buttons={[
        {
          primary: true,
          text: "Continue",
          onClick: handleCheckPhoneNumber,
          tabIndex: 22,
        },
        {
          text: "Cancel",
          onClick: handleCancel,
          tabIndex: 23,
          hidden: state.name === "find_email",
        },
      ]}
      error={errors.global}
    >
      <Text style={{marginBottom: 30}}>
        Have a registered phone number? Can find the ID only if have one.
      </Text>
      <Input
        ref={withAttrs({ tabindex: 21, autofocus: true }, "input")}
        label="Phone number"
        autoCapitalize={"none"}
        autoCorrect={false}
        autoFocus={true}
        blurOnSubmit={false}
        keyboardType={"phone-pad"}
        returnKeyType={"next"}
        autoCompleteType={"tel"}
        placeholder="Enter your mobile phone number"
        value={phoneNumber}
        caption={errors.phone_number}
        status={errors.phone_number ? "danger" : "basic"}
        onChangeText={v => setPhoneNumber(v || "")}
        clearButtonMode={"while-editing"}
        onKeyPress={e => e.nativeEvent.key === "Enter" && handleCheckPhoneNumber()}
        size={"large"}
      />
    </ScreenLayout>
  );
};
