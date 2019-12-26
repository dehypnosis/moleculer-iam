import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useOIDCInteractionContext, OIDCInteractionData, OIDCInteractionPage, requestOIDCInteraction } from "../";
import { TextFieldStyles, Text, TextField, Image, Stack } from "../../styles";
import { useWithLoading } from "../hook";

/* sub-pages */
import { LoginInteractionRegisterComplete } from "./register-complete";

export const LoginInteractionVerifyPhoneNumberEnterCode: React.FunctionComponent<{ oidc: OIDCInteractionData }> = ({oidc}) => {
  // states
  const context = useOIDCInteractionContext();
  const {loading, errors, setErrors, withLoading} = useWithLoading();
  const [code, setCode] = useState("");

  // props
  const {phoneNumber, timeoutSeconds} = oidc.interaction!.data!;
  const [remainingSeconds, setRemainingSeconds] = useState(timeoutSeconds);

  // update timeout
  useEffect(() => {
    if (remainingSeconds === 0) return;

    setTimeout(() => {
      setRemainingSeconds(remainingSeconds - 1);
    }, 1000);
  }, [remainingSeconds]);

  // handlers
  const handleVerify = withLoading(async () => {
    const result = await requestOIDCInteraction(oidc.interaction!.action!.submit, {
      code,
    });

    const {error, redirect, interaction} = result;
    if (error) {
      if (error.status === 422) {
        setErrors(error.detail);
      } else {
        setErrors({code: error.message});
      }
    } else if (redirect) {
      window.location.assign(redirect);
      await new Promise(() => {
      });
    } else if (interaction) {
      const result2 = await requestOIDCInteraction(interaction!.action!.submit);
      // tslint:disable-next-line:no-shadowed-variable
      const {error, redirect} = result2;
      if (error) {
        setErrors({global: error.message});
      } else if (redirect) {
        context.push(<LoginInteractionRegisterComplete oidc={result2}/>);
      } else {
        console.error("stuck to handle interaction:", result2);
      }
    } else {
      console.error("stuck to handle interaction:", result);
    }
  }, [code]);

  const handleResend = withLoading(async () => {
    const result = await requestOIDCInteraction(oidc.interaction!.action!.send);

    const {error, interaction} = result;
    console.log(interaction);
    if (error) {
      setErrors({code: error.message});
    } else {
      setRemainingSeconds(interaction!.data!.timeoutSeconds);
    }
  }, []);

  const handleCancel = withLoading(() => context.pop(2), []);

  // render
  return (
    <OIDCInteractionPage
      title={`Verify your phone number`}
      subtitle={phoneNumber}
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
        onKeyUp={e => e.key === "Enter" && handleVerify()}
        styles={TextFieldStyles.bold}
      />
    </OIDCInteractionPage>
  );
};
