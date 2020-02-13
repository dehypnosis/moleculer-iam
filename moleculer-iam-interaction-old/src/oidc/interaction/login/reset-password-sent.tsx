import React, { useCallback, useContext, useState } from "react";
import { useOIDCInteractionContext, OIDCInteractionData, OIDCInteractionPage, requestOIDCInteraction } from "../";
import { Text, Image } from "../../styles";
import { useWithLoading } from "../hook";
import svg from "./reset-password-sent.svg";

export const LoginInteractionResetPasswordSent: React.FunctionComponent<{ oidc: OIDCInteractionData }> = ({oidc}) => {
  // states
  const context = useOIDCInteractionContext();
  const {loading, errors, setErrors, withLoading} = useWithLoading();

  // props
  const {email, timeoutSeconds } = oidc.interaction!.data!;

  // handlers
  const handleDone = withLoading(() => context.pop(2), []);

  // render
  return (
    <OIDCInteractionPage
      title={`An email has been sent to`}
      subtitle={email}
      buttons={[
        {
          primary: true,
          text: "Done",
          onClick: handleDone,
          loading,
          tabIndex: 2,
        },
      ]}
      error={errors.global}
    >
      <Text>
        You could check the email to set a new password within {Math.floor(timeoutSeconds/60)} minutes.
      </Text>
      <Image src={svg} styles={{root: {minHeight: "270px"}, image: {width: "100%"}}}/>
    </OIDCInteractionPage>
  );
};
