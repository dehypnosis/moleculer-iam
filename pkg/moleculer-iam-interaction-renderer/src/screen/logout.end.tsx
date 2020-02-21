import React from "react";
import { Text } from "../styles";
import { useClose } from "../hook";
import { ScreenLayout } from "./layout";

export const LogoutEndScreen: React.FunctionComponent = () => {
  // states
  const {closed, close} = useClose(false);

  // render
  return (
    <ScreenLayout
      title={`Signed out`}
      buttons={[
        {
          primary: false,
          text: "Close",
          onClick: close,
          loading: closed,
          tabIndex: 1,
        },
      ]}
      error={closed ? "Please close the window manually." : undefined}
    >
      <Text>
        All you sessions have been closed successfully.
      </Text>
    </ScreenLayout>
  );
};
