import React, { useState } from "react";
import { OIDCInteractionProps, OIDCInteractionPage } from "../";

export const LogoutEndInteraction: React.FunctionComponent<{
  oidc: OIDCInteractionProps,
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
