import React from "react";
import { useAppState, useClose } from "../hook";
import { ScreenLayout, Text } from "./component";

export const VerifyEmailEndScreen: React.FunctionComponent = () => {
  // states
  const [state] = useAppState();
  const {close, closed} = useClose(false);

  // render
  return (
    <ScreenLayout
      title={`Email address verified`}
      subtitle={state.session.verifyEmail.email}
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
        The account email address has been verified successfully.
      </Text>
    </ScreenLayout>
  );
};
