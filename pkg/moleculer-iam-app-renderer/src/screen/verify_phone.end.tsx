import React from "react";
import { useAppState, useClose } from "../hook";
import { ScreenLayout, Text } from "./component";

export const VerifyPhoneEndScreen: React.FunctionComponent = () => {
  // states
  const [state] = useAppState();
  const {close, closed} = useClose(false);

  // render
  return (
    <ScreenLayout
      title={`Phone number verified`}
      subtitle={state.session.verifyPhone.phoneNumber}
      error={closed ? "Please close the window manually." : undefined}
      loading={closed}
      buttons={[
        {
          children: "Close",
          tabIndex: 1,
          onPress: close,
        },
      ]}
    >
      <Text>
        The account phone number has been verified successfully.
      </Text>
    </ScreenLayout>
  );
};
