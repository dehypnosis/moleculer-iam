import React, { useEffect, useState } from "react";
import { ScreenLayout } from "./layout";
import { TextFieldStyles, Text, TextField, Stack, DatePicker, DatePickerStyles, Dropdown, DropdownStyles, Label, LabelStyles } from "../styles";
import { useNavigation, useAppState, useWithLoading } from "../hook";
import moment from "moment";

export const RegisterDetailScreen: React.FunctionComponent = () => {
  // state
  const [payload, setPayload] = useState({
    phone_number: "",
    birthdate: "",
    gender: "",
  });

  const [state, dispatch] = useAppState();
  const phoneNumberIsRequired = state.metadata.mandatoryScopes.includes("phone");

  // set payload if claims already saved
  useEffect(() => {
    const stored = state.session.register;

    if (stored.scope && stored.scope.includes("birthdate") && stored.scope.includes("gender")) {
      const { phone_number, birthdate, gender } = stored.claims;
      setPayload({
        phone_number,
        birthdate,
        gender,
      });
    }
  }, []);


  // handlers
  const { nav } = useNavigation();
  const {loading, errors, setErrors, withLoading} = useWithLoading();

  const handlePayloadSubmit = withLoading(async () => {
    const stored = state.session.register;
    const { phone_number, birthdate, gender } = payload;

    return dispatch("register.validate", {
      claims: {
        ...stored.claims,
        phone_number: phone_number ? `${state.locale.country}|${phone_number}` : undefined,
        birthdate,
        gender,
      },
      credentials: stored.credentials,
      scope: ["email", "profile", "birthdate", "gender"].concat((phoneNumberIsRequired || phone_number) ? "phone" : []),
    })
      .then(newState => {
        if (payload.phone_number) {
          return dispatch("verify_phone.send", {
            phone_number: newState.session.register.claims.phone_number,
            register: true,
          })
            .then(() => {
              nav.navigate("verify_phone", {
                screen: "verify_phone.verify",
                params: {},
              });
            });
        } else {
          nav.navigate("register", {
            screen: "register.end",
          });
        }
      })
      .catch((err: any) => setErrors(err));
  }, [payload]);

  const handleCancel = withLoading(() => nav.navigate("register", {
    screen: "register.index",
    params: {},
  }), [nav]);

  // render
  const storedClaims = state.session.register.claims;
  return (
    <ScreenLayout
      title={"Sign up"}
      subtitle={storedClaims.email}
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
          <Text>Please enter the mobile phone number to find the your account for the case of lost.</Text>
          <TextField
            label={`Phone${phoneNumberIsRequired ? "" : " (optional)"}`}
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
