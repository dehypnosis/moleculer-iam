import { ApplicationState } from "moleculer-iam";
import React from "react";
import { useClose, useAppState, useAppI18N } from "../hook";
import { ScreenLayout, Text, List, ListItem, Icon, useThemePalette } from "../component";

export const LogoutEndScreen: React.FunctionComponent = () => {
  // states
  const { formatMessage: f } = useAppI18N();
  const { closed, close } = useClose(false);
  const [state] = useAppState();
  const user = state.user;
  const authorizedClients = state.authorizedClients;

  // render
  return (
    <ScreenLayout
      title={f({ id: "logout.signOut"})}
      subtitle={user ? user.email : f({ id: "logout.signedOut"})}
      buttons={[
        {
          children: f({ id: "button.close"}),
          onPress: close,
          tabIndex: 21,
        },
      ]}
      loading={closed}
      error={closed ? f({ id: "error.cannotClose"}) : undefined}
    >
      {user ? (
        <ActiveSessionList authorizedClients={authorizedClients} />
      ) : (
        <Text>{f({ id: "logout.sessionNotExists"})}</Text>
      )}
    </ScreenLayout>
  );
};

export const ActiveSessionList: React.FunctionComponent<{ authorizedClients: ApplicationState["authorizedClients"]}> = ({ authorizedClients }) => {
  const { formatMessage: f } = useAppI18N();
  const palette = useThemePalette();
  return (
    <>
      {authorizedClients ? (
        <>
          <Text>{f({ id: "logout.belowSessionsAreActive"})}</Text>
          <List
            style={{marginTop: 15, borderColor: palette["border-basic-color-3"], borderWidth: 1}}
            data={authorizedClients}
            renderItem={({ item, index}: {item: typeof authorizedClients[number], index: number }) => {
              const uri = item.client_uri || item.policy_uri || item.tos_uri;
              return (
                <ListItem
                  key={index}
                  style={{paddingLeft: 15, paddingRight: 15, paddingTop: 15, paddingBottom: 15, marginBottom: 1}}
                  title={item.client_name}
                  description={uri || item.client_id!}
                  disabled={!uri}
                  onPress={uri ? (() => window.open(uri)) : undefined}
                  accessoryRight={uri ? (evaProps => <Icon {...evaProps} style={[evaProps?.style, { width: 20}]} fill={palette["text-hint-color"]} name={"external-link-outline"}/>) : undefined}
                />
              );
            }}
          />
        </>
      ) : (
        <Text>{f({ id: "logout.noActiveSessions"})}</Text>
      )}
    </>
  );
}
