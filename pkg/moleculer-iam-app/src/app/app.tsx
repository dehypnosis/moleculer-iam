import { ApplicationState } from "moleculer-iam";
import React from "react";
import { ApplicationOptions } from "../../common";
import { AppOptionsProvider } from "./options";
import { AppStateProvider } from "./state";
import { AppNavigationProvider } from "./navigation";
import { AppThemeProvider } from "./theme";
import { AppI18NProvider } from "./i18n";

import { useThemePalette } from "../component";
import { LinkingOptions } from "@react-navigation/native/lib/typescript/src/types";
import { createStackNavigator, StackNavigationOptions } from "@react-navigation/stack";
import { ConsentScreen } from "../screen/consent";
import { ErrorScreen } from "../screen/error";
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


// create app container
export const App: React.FunctionComponent<{
  state: ApplicationState;
  options?: Partial<ApplicationOptions>;
  prefix?: "string";
  dev?: boolean;
}> = (props) => {
  const { prefix = "/op", dev = false, state, options = {} } = props;

  // define routes
  const p = prefix.startsWith("/") ? prefix.substr(1) : prefix;
  const routeConfig: NonNullable<LinkingOptions["config"]> = {
    "login.check_password": `${p}/login/check_password`,
    "login.index": `${p}/login`,
    "consent.index": `${p}/consent`,
    "logout.end": `${p}/session/end/success`,
    "logout.index": `${p}/session/end`,
    "find_email.end": `${p}/find_email/end`,
    "find_email.index": `${p}/find_email`,
    "reset_password.end": `${p}/reset_password/end`,
    "reset_password.set": `${p}/reset_password/set`,
    "reset_password.index": `${p}/reset_password`,
    "register.end": `${p}/register/end`,
    "register.detail": `${p}/register/detail`,
    "register.index": `${p}/register`,
    "verify_phone.end": `${p}/verify_phone/end`,
    "verify_phone.verify": `${p}/verify_phone/verify`,
    "verify_phone.index": `${p}/verify_phone`,
    "verify_email.end": `${p}/verify_email/end`,
    "verify_email.verify": `${p}/verify_email/verify`,
    "verify_email.index": `${p}/verify_email`,
    "error.index": "",
  };

  return (
    <AppOptionsProvider
      initialOptions={{
        ...options,
        dev,
        locale: state && state.locale,
      }}
    >
      <AppI18NProvider>
        <AppThemeProvider>
          <AppStateProvider
            initialState={state}
          >
            <AppNavigationProvider
              routeConfig={routeConfig}
            >
              <AppStack/>
            </AppNavigationProvider>
          </AppStateProvider>
        </AppThemeProvider>
      </AppI18NProvider>
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
