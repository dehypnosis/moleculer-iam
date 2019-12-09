import React, { useState } from "react";
import { OIDCInteractionError, OIDCInteractionPage } from "../";

export const ErrorInteraction: React.FunctionComponent<{
  title?: string,
  error: Error | OIDCInteractionError,
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
          tabIndex: 1,
          onClick: () => {
            window.history.back();
            setTimeout(() => {
              window.close();
              setTimeout(() => {
                setClosed(true);
              }, 1000);
            }, 500);
          },
        },
      ]}
    />
  );
};
