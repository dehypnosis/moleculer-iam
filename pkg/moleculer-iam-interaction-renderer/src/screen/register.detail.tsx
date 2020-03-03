import React, { useState } from "react";
import { ScreenLayout } from "./layout";
import { TextFieldStyles, Text, TextField, Stack, DatePicker, DatePickerStyles, Dropdown, DropdownStyles, Label, LabelStyles } from "../styles";
import { useNavigation, useWithLoading } from "../hook";
import moment from "moment";

export const RegisterDetailScreen: React.FunctionComponent = () => {
  const { nav } = useNavigation();
  const [payload, setPayload] = useState({
    phone_number: "",
    birthdate: "",
    gender: "",
  });
  const {loading, errors, setErrors, withLoading} = useWithLoading();
  const handlePayloadSubmit = withLoading(async () => {
    // TODO ...
    if (payload.phone_number) {
      nav.navigate("verify_phone", {
        screen: "verify_phone.index",
        params: {
          phoneNumber: payload.phone_number,
          callback: "register",
        },
      });
    } else {
      nav.navigate("register", {
        screen: "register.end",
        params: {
          email: "to@do.com",
        },
      });
    }
  }, [payload]);
  const handleCancel = withLoading(() => nav.navigate("register", {
    screen: "register.index",
    params: {},
  }), [nav]);

  const {email} = { email: "to@do.com" };

  // render
  return (
    <ScreenLayout
      title={"Sign up"}
      subtitle={email}
      buttons={[
        {
          primary: true,
          text: "Continue",
          onClick: handlePayloadSubmit,
          loading,
          tabIndex: 64,
        },
        {
          text: "Cancel",
          onClick: handleCancel,
          loading,
          tabIndex: 65,
        },
      ]}
      error={errors.global}
    >
      <form onSubmit={(e) => {
        e.preventDefault();
        handlePayloadSubmit();
      }}>
        <Stack tokens={{childrenGap: 15}}>
          <Text>It is highly recommended to enter the mobile phone number to make it easier to find the your lost account.</Text>
          <TextField
            label="Phone (optional)"
            type="text"
            inputMode="tel"
            placeholder="Enter your mobile phone number"
            autoFocus
            tabIndex={61}
            value={payload.phone_number}
            errorMessage={errors.phone_number}
            onChange={(e, v) => setPayload(p => ({...p, phone_number: v!}))}
            onKeyUp={e => e.key === "Enter" && handlePayloadSubmit()}
            styles={TextFieldStyles.bold}
          />

          <DatePicker
            label="Birthdate"
            placeholder="Select your birthdate"
            tabIndex={62}
            allowTextInput
            value={payload.birthdate ? moment(payload.birthdate, "YYYY-MM-DD").toDate() : undefined}
            onSelectDate={(date) => date && setPayload(p => ({...p, birthdate: moment(date).format("YYYY-MM-DD")}))}
            onKeyUp={e => e.key === "Enter" && handlePayloadSubmit()}
            formatDate={date => date ? moment(date).format("YYYY-MM-DD") : ""}
            initialPickerDate={moment().subtract(20, "y").toDate()}
            highlightCurrentMonth
            highlightSelectedMonth
            showGoToToday={false}
            parseDateFromString={str => {
              const d = moment(str, "YYYY-MM-DD");
              return d.isValid() ? d.toDate() : null;
            }}
            styles={DatePickerStyles.bold as any}
          />
          {errors.birthdate ? <Label styles={LabelStyles.fieldErrorMessage}>{errors.birthdate}</Label> : null}

          <Dropdown
            label="Gender"
            selectedKey={payload.gender || undefined}
            onChange={(e, v) => v && setPayload(p => ({...p, gender: v.key as any}))}
            placeholder="Select your gender"
            tabIndex={63}
            options={[
              {key: "male", text: "Male"},
              {key: "female", text: "Female"},
              {key: "other", text: "Other"},
            ]}
            errorMessage={errors.gender}
            styles={DropdownStyles.bold}
          />
        </Stack>
      </form>
    </ScreenLayout>
  );
};
