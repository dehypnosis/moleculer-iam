import React, { useCallback } from "react";
import { OIDCInteractionData, OIDCInteractionPage, requestOIDCInteraction } from "../";
import { useWithLoading, useClose } from "../hook";

export const LogoutInteraction: React.FunctionComponent<{ oidc: OIDCInteractionData }> = ({oidc}) => {
  // states
  const { loading, withLoading, errors, setErrors } = useWithLoading();
  const handleConfirm = withLoading(async () => {
    await requestOIDCInteraction({
      ...oidc.interaction!.action!.submit,
    });
  }, []);
  const { closed, close } = useClose({ tryBack: true });

  const { user, client} = oidc.interaction!.data!;
  return (
    <OIDCInteractionPage
      title={`Signed out`}
      subtitle={client ? `You has been signed out from ${client.name}. Do you want to sign out from plco account too?` : `Do you want to sign out from plco account?`}
      buttons={[
        {
          primary: true,
          text: "Yes",
          onClick: handleConfirm,
          loading,
        },
        {
          text: "No",
          onClick: close,
          loading,
          tabIndex: 2,
        },
      ]}
      error={errors.global || closed && "Cannot close the window, you can close the browser manually."}
    >
    </OIDCInteractionPage>
  );
};
