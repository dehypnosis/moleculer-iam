import React, { useState } from "react";
import { OIDCProps } from "../../types";
import { OIDCInteractionPage } from "../page";

export const LogoutEndInteraction: React.FunctionComponent<{
  oidc: OIDCProps,
}> = ({ oidc }) => {
  const [closed, setClosed] = useState(false);

  return (
    <OIDCInteractionPage
      title={`Sign out`}
      subtitle={"Signed out successfully"}
      error={closed ? "Cannot close the window, you can close the browser manually." : undefined}
      buttons={[
        {
          primary: false,
          text: "Close",
          onClick: () => {
            window.close();
            setTimeout(() => {
              setClosed(true);
            }, 500);
          },
        },
      ]}
    />
  );
};
