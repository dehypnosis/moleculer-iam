import React, { useCallback, useContext, useState } from "react";
import { useOIDCInteractionContext, OIDCInteractionData, OIDCInteractionPage, requestOIDCInteraction } from "../";
import { TextFieldStyles, Text, TextField, Image, Stack } from "../../styles";
import { useWithLoading } from "../hook";
import svg from "./verify-phone-number.svg";
import { LoginInteractionVerifyPhoneNumberEnterCode } from "./verify-phone-number-enter-code";

export const LoginInteractionVerifyPhoneNumber: React.FunctionComponent<{ oidc: OIDCInteractionData }> = ({oidc}) => {
  // states
  const context = useOIDCInteractionContext();
  const {loading, errors, setErrors, withLoading} = useWithLoading();

  // props
  const {phoneNumber} = oidc.interaction!.data!;

  // handlers
  const handleSend = withLoading(async () => {
    const result = await requestOIDCInteraction(oidc.interaction!.action!.send);

    const {error, interaction} = result;
    if (error) {
      if (error.status === 422) {
        setErrors(error.detail);
      } else {
        setErrors({phoneNumber: error.message});
      }
    } else {
      console.log(interaction);
      context.push(<LoginInteractionVerifyPhoneNumberEnterCode oidc={result}/>);
    }

  }, []);

  const handleCancel = withLoading(() => context.pop(), []);

  // render
  return (
    <OIDCInteractionPage
      title={`Verify your phone number`}
      subtitle={phoneNumber}
      buttons={[
        {
          primary: true,
          text: "Send",
          onClick: handleSend,
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
        To make sure the phone number is yours, we will send a text message with a verification code.
      </Text>
      <Image src={svg} styles={{root: {minHeight: "270px"}, image: {width: "100%"}}}/>
    </OIDCInteractionPage>
  );
};
