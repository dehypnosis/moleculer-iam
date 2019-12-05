import React from "react";
import { OIDCProps } from "./oidc/types";
import { OIDCInteractionStack } from "./oidc/interaction";

export const App: React.FunctionComponent = () => {
  // handle global OIDC props
  const oidc: OIDCProps = (window as any).OIDC;
  if (oidc) {
    return <OIDCInteractionStack oidc={oidc} />;
  }

  // TODO: here router goes
  return <div>TODO: here goes router for others</div>;
};
