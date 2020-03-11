import React from "react";
import { ScreenLayout } from "./component/layout";
import { useAppState, useClose } from "../hook";

export const ErrorScreen: React.FunctionComponent = () => {
  const [state] = useAppState();
  const error = state.error!;
  const {closed, close} = useClose();
  return (
    <ScreenLayout
      title={error.error}
      subtitle={error.error_description}
      error={closed ? "Please close the window manually." : undefined}
      loading={closed}
      buttons={[
        {
          children: "Close",
          tabIndex: 1,
          onPress: close,
        },
      ]}
    />
  );
};

export const ClientErrorScreen: React.FunctionComponent<{ error: any }> = (props) => {
  return (
    <ScreenLayout
      title={props.error.name}
      subtitle={props.error.message}
    >
      <pre style={{fontSize: "0.8em", color: "gray", wordBreak: "break-all", whiteSpace: "pre-wrap"}}>{props.error.stack}</pre>
    </ScreenLayout>
  );
};

