import React, { useCallback, useState } from "react";
import { OIDCInteractionData, OIDCInteractionPage, requestOIDCInteraction, useOIDCInteractionContext } from "../";
import { TextFieldStyles, Text, TextField } from "../../styles";
import { useWithLoading } from "../hook";
import { LoginInteractionVerifyPhone } from "./verify-phone";

export const LoginInteractionFindEmail: React.FunctionComponent<{ oidc: OIDCInteractionData }> = ({oidc}) => {
  // states
  const context = useOIDCInteractionContext();
  const [phone, setPhone] = useState("");
  const {loading, errors, setErrors, withLoading} = useWithLoading();

  const handleNext = withLoading(async () => {
    const result = await requestOIDCInteraction(oidc.interaction!.action!.findEmail, {
      phone,
    });

    const {error} = result;
    if (error) {
      if (error.status === 422) {
        setErrors(error.detail);
      } else {
        setErrors({phone: error.message});
      }
    } else {
      context.push(<LoginInteractionVerifyPhone oidc={result}/>);
    }

  }, [phone]);

  const handleCancel = withLoading(() => context.pop(), []);

  // render
  return (
    <OIDCInteractionPage
      title={`Find your email`}
      subtitle={`Enter your phone number`}
      buttons={[
        {
          primary: true,
          text: "Next",
          onClick: handleNext,
          loading,
          tabIndex: 2,
        },
        {
          text: "Cancel",
          onClick: handleCancel,
          loading,
          tabIndex: 3,
        },
      ]}
      error={errors.global}
    >
      <Text>
        Do you have a registered phone number? You can find your ID if you have one.
      </Text>
      <TextField
        label="Phone number"
        type="tel"
        inputMode="tel"
        placeholder="Enter your mobile phone number"
        autoFocus
        tabIndex={1}
        value={phone}
        errorMessage={errors.phone}
        onChange={(e, v) => setPhone(v || "")}
        onKeyUp={e => e.key === "Enter" && !loading && handleNext()}
        styles={TextFieldStyles.bold}
      />
    </OIDCInteractionPage>
  );
};
