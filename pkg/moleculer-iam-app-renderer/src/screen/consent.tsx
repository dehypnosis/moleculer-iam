import React from "react";
import { useAppState, useWithLoading, useNavigation } from "../hook";
import { Text, Persona, ScreenLayout } from "./component";

export const ConsentScreen: React.FunctionComponent = () => {
  // states
  const { loading, withLoading, errors, setErrors } = useWithLoading();
  const { nav } = useNavigation();
  const [state, dispatch] = useAppState();

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
    nav.navigate("login.stack", {
      screen: "login.index",
    });
    setErrors({});
  });

  const user = state.user!;
  const client = state.client!;
  const scopes = state.interaction!.prompt.details.scopes as { new: string[], rejected: string[], accepted: string[] };

  // render
  return (
    <ScreenLayout
      title={client.client_name}
      subtitle={"Authorization consent required"}
      loading={loading}
      error={errors.global}
      buttons={[
        {
          status: "primary",
          children: "Continue",
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
              children: "Privacy policy",
              onPress: () => window.open(client.policy_uri, "_blank"),
              disabled: !client.policy_uri,
              tabIndex: 4,
            },
            {
              children: "Terms of service",
              onPress: () => window.open(client.tos_uri, "_blank"),
              disabled: !client.tos_uri,
              tabIndex: 5,
            },
          ],
        },
        {
          separator: "OR",
        },
        {
          appearance: "ghost",
          size: "small",
          children: "Continue with other account",
          onPress: handleChangeAccount,
          loading: handleChangeAccountLoading,
          tabIndex: 3,
        },
        ...(client.client_uri ? [
          {
            appearance: "ghost",
            size: "small",
            children: "Visit service homepage",
            onPress: () => window.open(client.client_uri, "_blank"),
            disabled: !client.client_uri,
            tabIndex: 6,
          },
        ] : []),
      ]}
    >

      <Persona {...user} style={{marginBottom: 30}}/>
      <Text>
        {scopes.new.concat(scopes.accepted).join(", ")} permissions are required.
      </Text>
    </ScreenLayout>
  );
};
