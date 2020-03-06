import React from "react";
import { useAppState, useWithLoading, useNavigation } from "../hook";
import { Text, Persona, ScreenLayout } from "./component";

export const ConsentScreen: React.FunctionComponent = () => {
  // states
  const { loading, withLoading, errors, setErrors } = useWithLoading();
  const { nav } = useNavigation();
  const [state, dispatch] = useAppState();

  // handlers
  const handleAccept = withLoading(() => {
    return dispatch("consent.accept")
      .catch((err: any) => setErrors(err));
  });

  // const handleReject = withLoading(() => {
  //   return request("consent.reject")
  //     .catch((err: any) => setErrors(err));
  // });

  const handleChangeAccount = withLoading(() => {
    // return request("consent.change_account")
    //   .catch((err: any) => setErrors(err));
    return nav.navigate("login", {
      screen: "login.index",
      params: {},
    });
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
        {scopes.new.concat(scopes.accepted).join(", ")} permissions are required to continue authorization.
      </Text>
    </ScreenLayout>
  );
};
