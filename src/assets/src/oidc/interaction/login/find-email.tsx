import React, { useCallback, useContext, useState } from "react";
import { OIDCInteractionContext, OIDCInteractionProps, OIDCInteractionPage, requestOIDCInteraction } from "../";
import { TextFieldStyles, Text, TextField } from "../../styles";
import { useWithLoading } from "../hook";
import { LoginInteractionVerifyPhone } from "./verify-phone";
import { LoginInteractionEnterPassword } from "./password";

export const LoginInteractionFindEmail: React.FunctionComponent<{ oidc: OIDCInteractionProps }> = ({oidc}) => {
  // states
  const context = useContext(OIDCInteractionContext);
  const [phone, setPhone] = useState("");
  const {loading, errors, setErrors, withLoading} = useWithLoading();

  const handleNext = useCallback(() => withLoading(async () => {
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

  }), [withLoading, phone]);

  const handleCancel = useCallback(() => withLoading(() => context.pop()), [withLoading]);

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
