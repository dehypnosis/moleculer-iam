import React from "react";
import { OIDCError, OIDCProps } from "./oidc/types";
import { ErrorInteraction } from "./oidc/error";
import { LoginInteraction } from "./oidc/login";

export const App: React.FunctionComponent = () => {
  // handle global OIDC props
  const oidc: OIDCProps = (window as any).OIDC;
  if (oidc) {
    try {
      if (oidc.error) {
        return <ErrorInteraction error={oidc.error}/>;
      }

      switch (oidc.context!.prompt.name) {
        case "login":
          return <LoginInteraction oidc={oidc}/>;
        default:
          const error: OIDCError = {error: "unimplemented_prompt", error_description: `cannot handle ${oidc.context!.prompt.name} interaction`};
          return <ErrorInteraction error={error}/>;
      }
    } catch (error) {
      return  <ErrorInteraction error={error} />;
    }
  }

  // TODO: here router goes
  return <div>TODO: here goes router for others</div>;
};
