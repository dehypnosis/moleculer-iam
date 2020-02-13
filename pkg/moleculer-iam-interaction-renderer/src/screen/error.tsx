import React from "react";
import { ScreenLayout } from "./layout";
import { useServerState, useClose } from "../hook";

export const ErrorScreen: React.FunctionComponent = () => {
  const state = useServerState();
  const error = state.error || { error: "unexpected_error", error_description: "unrecognized state received from server" };
  const {closed, close} = useClose();
  return (
    <ScreenLayout
      title={error.error.split("_").map((w: string) => w[0].toUpperCase()+w.substr(1)).join(" ")}
      subtitle={error.error_description}
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
