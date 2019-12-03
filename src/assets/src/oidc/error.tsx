import React, { useState } from "react";
import { DefaultButton, MessageBar, MessageBarType, Stack, AnimationStyles } from "office-ui-fabric-react/lib";
import { Interaction } from "./interaction";
import { ButtonStyles, TextFieldStyles } from "./styles";
import { OIDCError } from "./types";

export const ErrorInteraction: React.FunctionComponent<{
  error: Error | OIDCError,
}> = ({ error }) => {
  // @ts-ignore
  const title = error && (error.name || error.error);
  // @ts-ignore
  const subtitle = error && (error.error_description || error.message);

  const [closed, setClosed] = useState(false);

  return (
    <Interaction
      title={`Error${title ? ": " + title : ""}`}
      subtitle={subtitle || "unknown error"}
      footer={
        <Stack tokens={{childrenGap: 15}}>
          <DefaultButton text="Close" allowDisabledFocus styles={ButtonStyles.large} onClick={() => { window.close(); setTimeout(() => setClosed(true), 500); }} />
          { closed ? <MessageBar messageBarType={MessageBarType.error} styles={{root: AnimationStyles.slideDownIn20}}>
            Cannot close the window, you can close the browser manually.
          </MessageBar> : null }
        </Stack>
      }
    />
  );
};
