import React from "react";
import { useAppState, useWithLoading, useNavigation, useI18N } from "../hook";
import { Text, Persona, ScreenLayout } from "./component";

export const ConsentScreen: React.FunctionComponent = () => {
  // states
  const { loading, withLoading, errors, setErrors } = useWithLoading();
  const { nav } = useNavigation();
  const [state, dispatch] = useAppState();
  const { formatMessage: f } = useI18N();

  // handlers
  const [handleAccept, handleAcceptLoading] = withLoading(() => {
    return dispatch("consent.accept")
      .then(() => setErrors({}))
      .catch((err: any) => setErrors(err));
  });

  // const handleReject = withLoading(() => {
  //   setErrors({});
  //   return request("consent.reject")
  //     .catch((err: any) => setErrors(err));
  // });

  const [handleChangeAccount, handleChangeAccountLoading] = withLoading(() => {
    // return request("consent.change_account")
    //   .catch((err: any) => setErrors(err));
    nav.navigate("login.index");
    setErrors({});
  });

  const user = state.user!;
  const client = state.client!;
  const scopes = state.interaction!.prompt.details.scopes as { new: string[], rejected: string[], accepted: string[] };

  // render
  return (
    <ScreenLayout
      title={client.client_name}
      subtitle={f({id: "consent.consentRequired"})}
      loading={loading}
      error={errors.global}
      buttons={[
        {
          status: "primary",
          children: f({id: "button.continue"}),
          onPress: handleAccept,
          loading: handleAcceptLoading,
          tabIndex: 1,
        },
        // {
        //   children: "Cancel",
        //   onPress: handleReject,
        //   loading,
        //   tabIndex: 2,
        // },
        {
          size: "medium",
          group: [
            {
              children: f({id: "consent.privacyPolicy"}),
              onPress: () => window.open(client.policy_uri, "_blank"),
              disabled: !client.policy_uri,
              tabIndex: 4,
            },
            {
              children: f({id: "consent.termsOfService"}),
              onPress: () => window.open(client.tos_uri, "_blank"),
              disabled: !client.tos_uri,
              tabIndex: 5,
            },
          ],
        },
        {
          separator: f({id: "separator.or"}),
        },
        {
          appearance: "ghost",
          size: "small",
          children: f({id: "consent.changeAccount"}),
          onPress: handleChangeAccount,
          loading: handleChangeAccountLoading,
          tabIndex: 3,
        },
        ...(client.client_uri ? [
          {
            appearance: "ghost",
            size: "small",
            children: f({id: "consent.visitClientHomepage"}),
            onPress: () => window.open(client.client_uri, "_blank"),
            disabled: !client.client_uri,
            tabIndex: 6,
          },
        ] : []),
      ]}
    >
      <Persona {...user} style={{marginBottom: 30}}/>
      <Text>
        {f({id: "consent.givenScopesRequired"}, { scopes: scopes.new.concat(scopes.accepted).join(", ")})}
      </Text>
    </ScreenLayout>
  );
};
