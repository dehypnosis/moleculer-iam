import React, { useState } from "react";
import { OIDCInteractionPage } from "../page";
import { OIDCError } from "../../types";

export const ErrorInteraction: React.FunctionComponent<{
  title?: string,
  error: Error | OIDCError,
}> = ({ title, error }) => {
  const [closed, setClosed] = useState(false);

  return (
    <OIDCInteractionPage
      title={title || `Error`}
      subtitle={error.message}
      error={closed ? "Cannot close the window, you can close the browser manually." : undefined}
      buttons={[
        {
          primary: false,
          text: "Close",
          onClick: () => {
            window.history.back();
            setTimeout(() => {
              window.close();
              setTimeout(() => {
                setClosed(true);
              }, 300);
            }, 300);
          },
        },
      ]}
    />
  );
};
