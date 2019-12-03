import React from "react";
import { DefaultButton, Link, PrimaryButton, Stack, Text, TextField } from "office-ui-fabric-react/lib";
import { Interaction } from "./interaction";
import { ButtonStyles, TextFieldStyles } from "./styles";
import { OIDCProps } from "./types";

export const LoginInteraction: React.FunctionComponent<{
  oidc: OIDCProps,
}> = () => {
  return (
    <Interaction
      title={"Sign in"}
      subtitle={"Use your plco account"}
      footer={[
        <Stack key={0} tokens={{childrenGap: 15}}>
          <PrimaryButton text="Next" allowDisabledFocus styles={ButtonStyles.large}/>
          <DefaultButton text="Sign up" allowDisabledFocus styles={ButtonStyles.large}/>
        </Stack>,
        <Stack key={1} tokens={{childrenGap: 10}}>
          <Link href="/help/terms" target="_blank">Terms &amp; Privacy</Link>
          <Text block variant="small">When you sign up as a member, you agree to <b>the service terms and conditions and the privacy policy</b>.</Text>
        </Stack>,
      ]}
    >
      <TextField
        label="Email"
        inputMode="email"
        placeholder="Enter your email"
        autoFocus
        styles={TextFieldStyles.bold}
      />
    </Interaction>
  );
};
