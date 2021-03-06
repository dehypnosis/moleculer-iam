import React from "react";
import { useAppState, useClose, useAppI18N } from "../hook";
import { ScreenLayout, Text } from "../component";

export const VerifyPhoneEndScreen: React.FunctionComponent = () => {
  // states
  const {formatMessage: f} = useAppI18N();
  const [state] = useAppState();
  const {close, closed} = useClose(false);

  // render
  return (
    <ScreenLayout
      title={f({id: "verifyPhone.phoneVerified"})}
      subtitle={state.session.verifyPhone.phoneNumber}
      error={closed ? f({id: "error.cannotClose"}) : undefined}
      loading={closed}
      buttons={[
        {
          children: f({id: "button.close"}),
          tabIndex: 1,
          onPress: close,
        },
      ]}
    >
      <Text>
        {f({id: "verifyPhone.phoneVerifiedSuccessfully"})}
      </Text>
    </ScreenLayout>
  );
};
