import React from "react";
import { createStackNavigator, StackNavigationOptions } from "@react-navigation/stack";
import { useThemePalette } from "../screen/component";
import { ConsentScreen } from "../screen/consent";
import { ErrorScreen } from "../screen/error";
import { routeConfig } from "./routes";
import { AppOptionsProvider } from "./options";
import { AppStateProvider } from "./state";
import { AppNavigationProvider } from "./navigation";
import { AppThemeProvider } from "./theme";
import { AppI18NProvider } from "./i18n";

import { FindEmailIndexScreen } from "../screen/find_email.index";
import { FindEmailEndScreen } from "../screen/find_email.end";
import { LoginCheckPasswordScreen } from "../screen/login.check_password";
import { LoginIndexScreen } from "../screen/login.index";
import { LogoutEndScreen } from "../screen/logout.end";
import { LogoutIndexScreen } from "../screen/logout.index";
import { RegisterDetailScreen } from "../screen/register.detail";
import { RegisterEndScreen } from "../screen/register.end";
import { RegisterIndexScreen } from "../screen/register.index";
import { ResetPasswordEndScreen } from "../screen/reset_password.end";
import { ResetPasswordIndexScreen } from "../screen/reset_password.index";
import { ResetPasswordSetScreen } from "../screen/reset_password.set";
import { VerifyEmailEndScreen } from "../screen/verify_email.end";
import { VerifyEmailIndexScreen } from "../screen/verify_email.index";
import { VerifyEmailVerifyScreen } from "../screen/verify_email.verify";
import { VerifyPhoneEndScreen } from "../screen/verify_phone.end";
import { VerifyPhoneIndexScreen } from "../screen/verify_phone.index";
import { VerifyPhoneVerifyScreen } from "../screen/verify_phone.verify";

export const App: React.FunctionComponent = () => {
  return (
    <AppOptionsProvider>
      <AppThemeProvider>
        <AppStateProvider>
          <AppNavigationProvider routeConfig={routeConfig}>
            <AppI18NProvider>
              <AppStack/>
            </AppI18NProvider>
          </AppNavigationProvider>
        </AppStateProvider>
      </AppThemeProvider>
    </AppOptionsProvider>
  );
};

const RootStack = createStackNavigator();
const AppStack = () => {
  const backgroundColor = useThemePalette()["background-basic-color-1"];
  const navOptions: StackNavigationOptions = {
    headerShown: false,
    cardStyle: {
      backgroundColor,
    },
    gestureEnabled: false,
    animationEnabled: false,
    // transitionSpec: {
    //   open: RevealFromBottomAndroid,
    //   close: RevealFromBottomAndroid,
    // },
  };

  return (
    <RootStack.Navigator
      screenOptions={navOptions}
    >
      <RootStack.Screen
        name={"error.index"}
        component={ErrorScreen}
      />

      <RootStack.Screen
        name={"consent.index"}
        component={ConsentScreen}
      />

      <RootStack.Screen
        name={"login.index"}
        component={LoginIndexScreen}
      />
      <RootStack.Screen
        name={"login.check_password"}
        component={LoginCheckPasswordScreen}
      />

      <RootStack.Screen
        name={"logout.index"}
        component={LogoutIndexScreen}
      />
      <RootStack.Screen
        name={"logout.end"}
        component={LogoutEndScreen}
      />

      <RootStack.Screen
        name={"find_email.index"}
        component={FindEmailIndexScreen}
      />
      <RootStack.Screen
        name={"find_email.end"}
        component={FindEmailEndScreen}
      />

      <RootStack.Screen
        name={"reset_password.index"}
        component={ResetPasswordIndexScreen}
      />
      <RootStack.Screen
        name={"reset_password.set"}
        component={ResetPasswordSetScreen}
      />
      <RootStack.Screen
        name={"reset_password.end"}
        component={ResetPasswordEndScreen}
      />

      <RootStack.Screen
        name={"register.index"}
        component={RegisterIndexScreen}
      />
      <RootStack.Screen
        name={"register.detail"}
        component={RegisterDetailScreen}
      />
      <RootStack.Screen
        name={"register.end"}
        component={RegisterEndScreen}
      />

      <RootStack.Screen
        name={"verify_phone.index"}
        component={VerifyPhoneIndexScreen}
      />
      <RootStack.Screen
        name={"verify_phone.verify"}
        component={VerifyPhoneVerifyScreen}
      />
      <RootStack.Screen
        name={"verify_phone.end"}
        component={VerifyPhoneEndScreen}
      />

      <RootStack.Screen
        name={"verify_email.index"}
        component={VerifyEmailIndexScreen}
      />
      <RootStack.Screen
        name={"verify_email.verify"}
        component={VerifyEmailVerifyScreen}
      />
      <RootStack.Screen
        name={"verify_email.end"}
        component={VerifyEmailEndScreen}
      />
    </RootStack.Navigator>
  );
};
