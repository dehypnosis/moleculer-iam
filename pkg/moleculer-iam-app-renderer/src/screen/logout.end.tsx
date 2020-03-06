import React from "react";
import { useClose, useAppState } from "../hook";
import { ScreenLayout, Text } from "./component";

export const LogoutEndScreen: React.FunctionComponent = () => {
  // states
  const { closed, close } = useClose(false);
  const [state] = useAppState();
  const user = state.user;

  // render
  return (
    <ScreenLayout
      title={`Signed out`}
      subtitle={`Hi, ${user ? user.name : "guest"}`}
      buttons={[
        {
          children: "Close",
          onPress: close,
          tabIndex: 21,
        },
      ]}
      loading={closed}
      error={closed ? "Please close the window manually." : undefined}
    >
      <Text>
        {user ? "Below sessions of your account are still active." : "All the sessions of your account have been destroyed."}
      </Text>
    </ScreenLayout>
  );
};
