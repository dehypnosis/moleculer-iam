import React, { useState } from "react";
import { OIDCInteractionError, OIDCInteractionPage } from "../";
import { useClose } from "../hook";

export const ErrorInteraction: React.FunctionComponent<{
  title?: string,
  error: Error | OIDCInteractionError,
}> = ({ title, error }) => {
  const { close, closed } = useClose();

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
          onClick: close,
        },
      ]}
    />
  );
};
