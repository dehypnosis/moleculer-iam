import React from "react";
import { LinkingOptions } from "@react-navigation/native/lib/typescript/src/types";
import { createStackNavigator } from "@react-navigation/stack";
import { InteractionScreen } from "./screen/interaction";
import { ErrorScreen } from "./screen/error";

export const routeConfig: LinkingOptions["config"] = {
  Interaction: "interaction/:name",
  Error: ":all",
};

const Stack = createStackNavigator();

export const Navigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {
          backgroundColor: "#ffffff",
        },
      }}
    >
      <Stack.Screen
        name={"Interaction"}
        component={InteractionScreen}
      />
      <Stack.Screen
        name={"Error"}
        component={ErrorScreen}
      />
    </Stack.Navigator>
  );
};
