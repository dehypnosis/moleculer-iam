import React from "react";
import { ScreenLayout } from "../component";
import { useAppState, useClose, useAppI18N } from "../hook";

export const ErrorScreen: React.FunctionComponent = () => {
  const { formatMessage: f } = useAppI18N();
  const [state] = useAppState();
  const error = state.error!;
  const {closed, close} = useClose();
  return (
    <ScreenLayout
      title={f({ id: `error.${error.error}.name`, defaultMessage: error.error || error.name })}
      subtitle={f({ id: `error.${error.error}.description`, defaultMessage: error.error_description || error.message })}
      error={closed ? f({id: "error.cannotClose"}) : undefined}
      loading={closed}
      buttons={[
        {
          children: f({id: "button.close"}),
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

