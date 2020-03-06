import React from "react";
import { Text } from "../styles";
import { useClose, useAppState } from "../hook";
import { ScreenLayout } from "./component/layout";

export const LogoutEndScreen: React.FunctionComponent = () => {
  // states
  const { closed, close } = useClose(false);
  const [state] = useAppState();
  const user = state.user;

  // render
  return (
    <ScreenLayout
      title={`Signed out`}
      subtitle={user ? user.email : undefined}
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
        {user ? "All your sessions are still alive." : "All your sessions have been destroyed."}
      </Text>
    </ScreenLayout>
  );
};
