import React from "react";
import { Text } from "../styles";
import { useClose, useAppState } from "../hook";
import { ScreenLayout } from "./layout";

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
          primary: false,
          text: "Close",
          onClick: close,
          loading: closed,
          tabIndex: 21,
        },
      ]}
      error={closed ? "Please close the window manually." : undefined}
    >
      <Text>
        {user ? "All your sessions are still alive." : "All your sessions have been destroyed."}
      </Text>
    </ScreenLayout>
  );
};
