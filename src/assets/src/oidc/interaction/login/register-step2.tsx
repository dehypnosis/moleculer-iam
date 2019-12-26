import React, { useState } from "react";
import { OIDCInteractionData, OIDCInteractionPage, requestOIDCInteraction, useOIDCInteractionContext } from "../index";
import { TextFieldStyles, Text, TextField, Stack, Dropdown, DropdownStyles, DatePicker, DatePickerStyles, Label, LabelStyles } from "../../styles";
import moment from "moment";

/* sub pages */
import { useWithLoading } from "../hook";
import { LoginInteractionVerifyPhoneNumber } from "./verify-phone-number";
import { LoginInteractionRegisterComplete } from "./register-complete";

export const LoginInteractionRegisterStep2: React.FunctionComponent<{ oidc: OIDCInteractionData }> = ({oidc}) => {
  // states
  const context = useOIDCInteractionContext();
  const [payload, setPayload] = useState(() => ({
    phone_number: "",
    birthdate: "",
    gender: "",
  }));
  const {loading, errors, setErrors, withLoading} = useWithLoading();

  const handleNext = withLoading(async () => {
    const result = await requestOIDCInteraction(oidc.interaction!.action!.submit, {
      ...payload,
    });

    const {error, interaction} = result;
    if (error) {
      if (error.status === 422) {
        setErrors(error.detail);
      } else {
        setErrors({global: error.message});
      }
    } else if (interaction && interaction.name === "verify_phone_number") {
      context.push(<LoginInteractionVerifyPhoneNumber oidc={result}/>);

    } else if (interaction && interaction.name === "register") {
      const result2 = await requestOIDCInteraction(interaction!.action!.submit);
      if (result2.error) {
        setErrors({global: result2.error.message});
      } else {
        context.push(<LoginInteractionRegisterComplete oidc={result2}/>);
      }
    } else {
      console.error("stuck to handle interaction:", result);
    }
  }, [payload]);

  const handleCancel = withLoading(() => context.pop(), []);

  // render
  const {email} = oidc.interaction!.data!;

  return (
    <OIDCInteractionPage
      title={"Welcome to plco"}
      subtitle={email}
      buttons={[
        {
          primary: true,
          text: "Next",
          onClick: handleNext,
          loading,
          tabIndex: 3,
        },
        {
          text: "Cancel",
          onClick: handleCancel,
          loading,
          tabIndex: 4,
        },
      ]}
      error={errors.global}
    >
      <form onSubmit={(e) => {
        e.preventDefault();
        handleNext();
      }}>
        <Stack tokens={{childrenGap: 15}}>
          <Text>It is highly recommended to enter the mobile phone number to make it easier to find the your lost account.</Text>
          <TextField
            label="Phone (optional)"
            type="text"
            inputMode="tel"
            placeholder="Enter your mobile phone number"
            autoFocus
            tabIndex={1}
            value={payload.phone_number}
            errorMessage={errors.phone_number}
            onChange={(e, v) => setPayload(p => ({...p, phone_number: v!}))}
            onKeyUp={e => e.key === "Enter" && handleNext()}
            styles={TextFieldStyles.bold}
          />

          <DatePicker
            label="Birthdate"
            placeholder="Select your birthdate"
            tabIndex={2}
            allowTextInput
            value={payload.birthdate ? moment(payload.birthdate, "YYYY-MM-DD").toDate() : undefined}
            onSelectDate={(date) => date && setPayload(p => ({...p, birthdate: moment(date).format("YYYY-MM-DD")}))}
            onKeyUp={e => e.key === "Enter" && handleNext()}
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
    </OIDCInteractionPage>
  );
};
