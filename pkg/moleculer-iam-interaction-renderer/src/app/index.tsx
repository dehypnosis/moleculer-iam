import React from "react";
import { AppNavigationContainer } from "./nav.state";
import { AppStateContainer } from "./state";

export const App: React.FunctionComponent = () => {
  return (
    <AppStateContainer>
      <AppNavigationContainer />
    </AppStateContainer>
  )
};
