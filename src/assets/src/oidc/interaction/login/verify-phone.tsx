import React, { useCallback, useContext, useState } from "react";
import { OIDCInteractionContext, OIDCInteractionProps, OIDCInteractionPage, requestOIDCInteraction } from "../";
import { TextFieldStyles, Text, TextField, Image, Stack } from "../../styles";
import { useWithLoading } from "../hook";
import svg from "./verify-phone.svg";
import { LoginInteractionVerifyPhoneEnterCode } from "./verify-phone-enter-code";

export const LoginInteractionVerifyPhone: React.FunctionComponent<{ oidc: OIDCInteractionProps }> = ({oidc}) => {
  // states
  const context = useContext(OIDCInteractionContext);
  const {loading, errors, setErrors, withLoading} = useWithLoading();

  // props
  const {phone} = oidc.interaction!.data!;

  // handlers
  const handleSend = useCallback(() => withLoading(async () => {
    const result = await requestOIDCInteraction(oidc.interaction!.action!.submit, {
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
      context.push(<LoginInteractionVerifyPhoneEnterCode oidc={result}/>);
    }

  }), [withLoading]);

  const handleCancel = useCallback(() => withLoading(() => context.pop()), [withLoading]);

  // render
  return (
    <OIDCInteractionPage
      title={`Verify your phone number`}
      subtitle={phone}
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
