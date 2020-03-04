import React from "react";
import { ScreenLayout } from "./layout";
import { useAppState, useClose } from "../hook";

export const ErrorScreen: React.FunctionComponent = () => {
  const [state, dispatch] = useAppState();
  const error = state.error || { error: "unexpected_server_error", error_description: "unrecognized state received from server." };
  const {closed, close} = useClose();
  return (
    <ScreenLayout
      title={error.error.split("_").map((w: string) => w[0].toUpperCase()+w.substr(1)).join(" ")}
      subtitle={error.error_description}
      error={closed ? "Please close the window manually." : undefined}
      buttons={[
        {
          primary: false,
          text: "Close",
          loading: closed,
          tabIndex: 1,
          onClick: close,
        },
      ]}
    />
  );
};

export const ClientErrorScreen: React.FunctionComponent<{ error: any }> = (props) => {
  return (
    <ScreenLayout
      title={"Unexpected Client Error"}
      subtitle={props.error.name}
    >
      <pre style={{fontSize: "0.8em", color: "gray", wordBreak: "break-all", whiteSpace: "pre-wrap"}}>{props.error.message}</pre>
    </ScreenLayout>
  );
};

