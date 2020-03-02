import React from "react";
import { OIDCInteractionData, OIDCInteractionPage } from "../";
import { Text } from "../../styles";
import { useClose } from "../hook";

export const ResetPasswordInteractionEnd: React.FunctionComponent<{ oidc: OIDCInteractionData }> = ({oidc}) => {
  const {close, closed} = useClose();

  // render
  const {user} = oidc.interaction!.data!;
  return (
    <OIDCInteractionPage
      title={`Reset Password`}
      subtitle={user.email}
      error={closed ? "Cannot close the window, you can close the browser manually." : undefined}
      buttons={[
        {
          primary: true,
          text: "Close",
          onClick: close,
          tabIndex: 2,
        },
      ]}
    >
      <Text>
        Account credential has been updated.
      </Text>
    </OIDCInteractionPage>
  );
};
