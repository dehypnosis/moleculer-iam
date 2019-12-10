import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { OIDCInteractionContext, OIDCInteractionProps, OIDCInteractionPage, requestOIDCInteraction } from "../";
import { TextFieldStyles, Text, TextField, Image, Stack } from "../../styles";
import { useWithLoading } from "../hook";

export const LoginInteractionVerifyPhoneEnterCode: React.FunctionComponent<{ oidc: OIDCInteractionProps }> = ({oidc}) => {
  // states
  const context = useContext(OIDCInteractionContext);
  const {loading, errors, setErrors, withLoading} = useWithLoading();
  const [code, setCode] = useState("");

  // props
  const {phone, timeoutSeconds} = oidc.interaction!.data!;
  const [remainingSeconds, setRemainingSeconds] = useState(timeoutSeconds);

  // update timeout
  useEffect(() => {
    if (remainingSeconds === 0) return;

    setTimeout(() => {
      setRemainingSeconds(remainingSeconds - 1);
    }, 1000);
  }, [remainingSeconds]);

  // handlers
  const handleVerify = useCallback(() => withLoading(async () => {
    const result = await requestOIDCInteraction(oidc.interaction!.action!.submit, {
      code,
    });

    const {error, redirect} = result;
    if (error) {
      if (error.status === 422) {
        setErrors(error.detail);
      } else {
        setErrors({code: error.message});
      }
    } else if (redirect) {
      window.location.assign(redirect);
      await new Promise(() => {});
    } else {
      console.error("stuck in interaction");
    }
  }), [withLoading, code]);

  const handleResend = useCallback(() => withLoading(async () => {
    const result = await requestOIDCInteraction(oidc.interaction!.action!.resend);

    const {error, interaction} = result;
    if (error) {
      setErrors({code: error.message});
    } else {
      setRemainingSeconds(interaction!.data!.timeoutSeconds);
    }
  }), [withLoading]);

  const handleCancel = useCallback(() => withLoading(() => context.pop(2)), [withLoading]);

  // render
  return (
    <OIDCInteractionPage
      title={`Verify your phone number`}
      subtitle={phone}
      buttons={[
        {
          primary: true,
          text: "Verify",
          onClick: handleVerify,
          loading,
          tabIndex: 2,
        },
        {
          text: "Resend",
          onClick: handleResend,
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
      <Text>
        Enter the received 6-digit verification code.
      </Text>
      <TextField
        label="Verification code"
        type="tel"
        inputMode="tel"
        placeholder="Enter the verification code"
        autoFocus
        tabIndex={1}
        value={code}
        errorMessage={errors.code}
        description={`${(Math.floor(remainingSeconds / 60)).toString().padStart(2, "0")}:${(remainingSeconds % 60).toString().padStart(2, "0")}`}
        onChange={(e, v) => setCode(v || "")}
        onKeyUp={e => e.key === "Enter" && !loading && handleVerify()}
        styles={TextFieldStyles.bold}
      />
    </OIDCInteractionPage>
  );
};
