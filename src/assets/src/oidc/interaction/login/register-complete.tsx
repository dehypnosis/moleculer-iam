import React, { useState } from "react";
import { OIDCInteractionData, OIDCInteractionPage, requestOIDCInteraction, useOIDCInteractionContext } from "../index";
import { TextFieldStyles, Text, TextField, Stack, Dropdown, DropdownStyles, DatePicker, DatePickerStyles, Label, LabelStyles } from "../../styles";
import moment from "moment";

/* sub pages */
import { useWithLoading } from "../hook";

export const LoginInteractionRegisterComplete: React.FunctionComponent<{ oidc: OIDCInteractionData }> = ({oidc}) => {
  // states
  const context = useOIDCInteractionContext();
  const {loading, errors, setErrors, withLoading} = useWithLoading();

  const handleNext = withLoading(async () => {
    const {redirect} = oidc;
    if (redirect) {
      window.location.assign(redirect);
      await new Promise(() => {});
    } else {
      console.error("stuck to handle interaction:", oidc);
    }
  }, []);

  // render
  const {email} = oidc.interaction!.data!;

  return (
    <OIDCInteractionPage
      title={"Congratulations"}
      subtitle={email}
      buttons={[
        {
          primary: true,
          text: "Let's go",
          onClick: handleNext,
          loading,
          autoFocus: true,
          tabIndex: 1,
        },
      ]}
      error={errors.global}
    >
      <Text>From now on, you can use all of the services of plco with this single ID. So don't forget it please. 🙂</Text>
    </OIDCInteractionPage>
  );
};
