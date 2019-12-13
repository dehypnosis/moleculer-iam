import React, { useCallback } from "react";
import { ThemeStyles, Link, Text, Persona, PersonaSize } from "../../styles";
import { OIDCInteractionData, OIDCInteractionPage, requestOIDCInteraction, useOIDCInteractionContext } from "../";
import { useWithLoading } from "../hook";

export const ConsentInteraction: React.FunctionComponent<{
  oidc: OIDCInteractionData,
}> = ({oidc}) => {
  // state
  const {loading, errors, setErrors, withLoading} = useWithLoading();

  // props
  const {client, user, consent} = oidc.interaction!.data!;

  // handlers
  const handleConfirm = withLoading(async () => {
    const result = await requestOIDCInteraction(oidc.interaction!.action!.submit);
    const {error, redirect} = result;
    if (error) {
      if (error.status === 422) {
        setErrors(error.detail);
      } else {
        setErrors({global: error.message});
      }
    } else if (redirect) {
      window.location.replace(redirect);
      await new Promise(() => {
      });
    } else {
      console.error("stuck to handle interaction:", result);
    }
  }, []);

  const handleReject = withLoading(async () => {
    const result = await requestOIDCInteraction(oidc.interaction!.action!.abort);
    const {error, redirect} = oidc;
    if (error) {
      setErrors({global: error.message});
    } else if (redirect) {
      window.location.replace(redirect);
      await new Promise(() => {
      });
    } else {
      console.error("stuck to handle interaction:", result);
    }
  }, []);

  const handleChangeAccount = withLoading(async () => {
    await requestOIDCInteraction(oidc.interaction!.action!.changeAccount);
  }, []);

  return (
    <OIDCInteractionPage
      title={<span>Connect to <Text style={{color: ThemeStyles.palette.orange}} variant="xLarge">{client.name}</Text></span>}
      buttons={[
        {
          primary: true,
          text: "Continue",
          onClick: handleConfirm,
          loading,
          tabIndex: 1,
        },
        // {
        //   text: "Cancel",
        //   onClick: handleReject,
        //   loading,
        //   tabIndex: 2,
        // },
        {
          text: "Use other account",
          onClick: handleChangeAccount,
          loading,
          tabIndex: 3,
        },
      ]}
      footer={
        <Text>
          To continue, plco will share your {consent.scopes.new.concat(consent.scopes.accepted).join(", ")} information.
          Before using this application, you can review the <Link href={client.homepage}>{client.name}</Link>'s <Link href={client.privacy} target="_blank" variant="small">privacy policy</Link> and <Link href={client.privacy} target="_blank" variant="small">terms
          of service</Link>.
        </Text>
      }
      error={errors.global}
    >
      <Persona
        text={user.name}
        secondaryText={user.email}
        size={PersonaSize.size56}
        imageUrl={user.picture}
      />
    </OIDCInteractionPage>
  );
};
