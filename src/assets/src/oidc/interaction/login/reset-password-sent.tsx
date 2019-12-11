import React, { useCallback, useContext, useState } from "react";
import { OIDCInteractionContext, OIDCInteractionProps, OIDCInteractionPage, requestOIDCInteraction } from "../";
import { Text, Image } from "../../styles";
import { useWithLoading } from "../hook";
import svg from "./reset-password-sent.svg";

export const LoginInteractionResetPasswordSent: React.FunctionComponent<{ oidc: OIDCInteractionProps }> = ({oidc}) => {
  // states
  const context = useContext(OIDCInteractionContext);
  const {loading, errors, setErrors, withLoading} = useWithLoading();

  // props
  const {email, timeoutSeconds } = oidc.interaction!.data!;

  // handlers
  const handleDone = useCallback(() => withLoading(() => context.pop(2)), [withLoading]);

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
