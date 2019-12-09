import React from "react";
import { OIDCInteraction, OIDCInteractionProps } from "./oidc/interaction";

export const App: React.FunctionComponent = () => {
  // handle global OIDC props
  const oidc: OIDCInteractionProps = (window as any).OIDC;
  if (oidc) {
    return <OIDCInteraction oidc={oidc} />;
  }

  // TODO: here router goes
  return <div>TODO: here goes router for others</div>;
};
