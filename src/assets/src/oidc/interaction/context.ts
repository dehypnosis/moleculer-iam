import React from "react";
import { AnimationStyles } from "./styles";

export const OIDCInteractionStackContext = React.createContext({
  pop: () => {},
  push: (page: any) => {},
  animation: AnimationStyles.slideLeftIn40,
  key: 0,
});
