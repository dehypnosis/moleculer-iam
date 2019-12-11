import React, { useCallback, useContext, useEffect, useState } from "react";
import { OIDCInteractionContext, OIDCInteractionProps, OIDCInteractionPage, requestOIDCInteraction } from "../";
import { Link, Text, TextField, TextFieldStyles } from "../../styles";
import { useWithLoading } from "../hook";
import { ResetPasswordInteractionEnd } from "./reset-password-end";

export const ResetPasswordInteraction: React.FunctionComponent<{ oidc: OIDCInteractionProps }> = ({oidc}) => {
  // states
  const context = useContext(OIDCInteractionContext);
  const [password, setPassword] = useState("");
  const { loading, errors, setErrors, withLoading } = useWithLoading();

  const handleSubmit = useCallback(() => withLoading(async () => {
    const result = await requestOIDCInteraction(oidc.interaction!.action!.submit, {
      email: oidc.interaction!.data.user.email,
      password,
    });
    const { error, interaction } = result;
    if (error) {
      if (error.status === 422) {
        setErrors(error.detail);
      } else {
        setErrors({password: error.message});
      }
    } else if (interaction) {
      context.push(<ResetPasswordInteractionEnd oidc={oidc} />);
    } else {
      console.error("stuck to handle interaction:", oidc);
    }
  }), [withLoading, password]);

  // render
  const { user } = oidc.interaction!.data!;
  return (
    <OIDCInteractionPage
      title={`Reset Password`}
      subtitle={user.email}
      buttons={[
        {
          primary: true,
          text: "Done",
          onClick: handleSubmit,
          loading,
          tabIndex: 2,
        },
      ]}
      error={errors.global}
    >
      <Text>
        Set a new password for your plco account.
      </Text>
      <TextField
        label="Password"
        type="password"
        inputMode="text"
        placeholder="Enter new password"
        autoFocus
        tabIndex={1}
        value={password}
        errorMessage={errors.password}
        onChange={(e, v) => setPassword(v || "")}
        onKeyUp={e => e.key === "Enter" && !loading && handleSubmit()}
        styles={TextFieldStyles.bold}
      />
    </OIDCInteractionPage>
  );
};
