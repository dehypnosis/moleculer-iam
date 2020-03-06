import React from "react";
import { useClose, useAppState } from "../hook";
import { ScreenLayout, Text, List, ListItem, Icon, useThemePalette } from "./component";

export const LogoutEndScreen: React.FunctionComponent = () => {
  // states
  const { closed, close } = useClose(false);
  const [state] = useAppState();
  const palette = useThemePalette();
  const user = state.user;
  const authorizedClients = state.authorizedClients;

  // render
  return (
    <ScreenLayout
      title={`Account session`}
      subtitle={user ? user.email : "Signed out"}
      buttons={[
        {
          children: "Close",
          onPress: close,
          tabIndex: 21,
        },
      ]}
      loading={closed}
      error={closed ? "Please close the window manually." : undefined}
    >
      {user ? (
        <>
          {authorizedClients ? (
            <>
              <Text>Below sessions are active.</Text>
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
                      accessory={uri ? (style => <Icon style={{...style, width: 20}} fill={palette["text-hint-color"]} name={"external-link-outline"}/>) : undefined}
                    />
                  );
                }}
              />
            </>
          ) : (
            <Text>There are no active sessions.</Text>
          )}
        </>
      ) : (
        <Text>Account session not exists.</Text>
      )}
    </ScreenLayout>
  );
};
