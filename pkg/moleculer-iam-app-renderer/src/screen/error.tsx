import React from "react";
import { ScreenLayout } from "./component";
import { useAppState, useClose, useI18N } from "../hook";

export const ErrorScreen: React.FunctionComponent = () => {
  const { formatMessage: f } = useI18N();
  const [state] = useAppState();
  const error = state.error!;
  const {closed, close} = useClose();
  return (
    <ScreenLayout
      title={error.error}
      subtitle={error.error_description}
      error={closed ? f({id: "error.cannotClose"}) : undefined}
      loading={closed}
      buttons={[
        {
          children: f({id: "button.close"}),
          tabIndex: 1,
          onPress: close,
        },
      ]}
      reloadOnLocaleChange
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

