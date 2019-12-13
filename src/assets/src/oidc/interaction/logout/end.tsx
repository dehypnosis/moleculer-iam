import React from "react";
import { OIDCInteractionData, OIDCInteractionPage } from "../";
import { useClose } from "../hook";

export const LogoutEndInteraction: React.FunctionComponent<{
  oidc: OIDCInteractionData,
}> = ({ oidc }) => {
  const { closed, close } = useClose();

  return (
    <OIDCInteractionPage
      title={`Signed out`}
      subtitle={"You has been signed out from plco successfully"}
      error={closed ? "Cannot close the window, you can close the browser manually." : undefined}
      buttons={[
        {
          primary: false,
          text: "Close",
          onClick: close,
        },
      ]}
    />
  );
};
