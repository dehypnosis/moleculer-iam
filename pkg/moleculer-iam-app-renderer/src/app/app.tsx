import React, { createContext, useContext } from "react";
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
              <AppStacks />
            </AppI18NProvider>
          </AppNavigationProvider>
        </AppStateProvider>
      </AppThemeProvider>
    </AppOptionsProvider>
  )
};


const NavOptionsProvider = createContext<StackNavigationOptions>(undefined as any);
const useNavOptions = () => useContext(NavOptionsProvider);

const RootStack = createStackNavigator();

const AppStacks = () => {
  const backgroundColor = useThemePalette()["background-basic-color-1"];
  const navOptions: StackNavigationOptions = {
    headerShown: false,
    cardStyle: {
      backgroundColor,
    },
    gestureEnabled: false,
    // animationEnabled: false,
    // transitionSpec: {
    //   open: RevealFromBottomAndroid,
    //   close: RevealFromBottomAndroid,
    // },
  };

  return (
    <NavOptionsProvider.Provider value={navOptions}>
      <RootStack.Navigator
        screenOptions={navOptions}
      >
        <RootStack.Screen
          name={"error.stack"}
          component={ErrorStackScreen}
        />
        <RootStack.Screen
          name={"consent.stack"}
          component={ConsentStackScreen}
        />
        <RootStack.Screen
          name={"login.stack"}
          component={LoginStackScreen}
        />
        <RootStack.Screen
          name={"find_email.stack"}
          component={FindEmailStackScreen}
        />
        <RootStack.Screen
          name={"reset_password.stack"}
          component={ResetPasswordStackScreen}
        />
        <RootStack.Screen
          name={"register.stack"}
          component={RegisterStackScreen}
        />
        <RootStack.Screen
          name={"logout.stack"}
          component={LogoutStackScreen}
        />
        <RootStack.Screen
          name={"verify_phone.stack"}
          component={VerifyPhoneStackScreen}
        />
        <RootStack.Screen
          name={"verify_email.stack"}
          component={VerifyEmailStackScreen}
        />
      </RootStack.Navigator>
    </NavOptionsProvider.Provider>
  )
};

const ErrorStack = createStackNavigator();
const ErrorStackScreen: React.FunctionComponent = () => (
  <ErrorStack.Navigator
    screenOptions={useNavOptions()}
  >
    <ErrorStack.Screen
      name={"error.index"}
      component={ErrorScreen}
    />
  </ErrorStack.Navigator>
);

const ConsentStack = createStackNavigator();
const ConsentStackScreen: React.FunctionComponent = () => (
  <ConsentStack.Navigator
    screenOptions={useNavOptions()}
  >
    <ConsentStack.Screen
      name={"consent.index"}
      component={ConsentScreen}
    />
  </ConsentStack.Navigator>
);

const LoginStack = createStackNavigator();
const LoginStackScreen: React.FunctionComponent = () => (
  <LoginStack.Navigator
    screenOptions={useNavOptions()}
  >
    <LoginStack.Screen
      name={"login.check_password"}
      component={LoginCheckPasswordScreen}
    />
    <LoginStack.Screen
      name={"login.index"}
      component={LoginIndexScreen}
    />
  </LoginStack.Navigator>
);

const LogoutStack = createStackNavigator();
const LogoutStackScreen = () => (
  <LogoutStack.Navigator
    screenOptions={useNavOptions()}
  >
    <LogoutStack.Screen
      name={"logout.end"}
      component={LogoutEndScreen}
    />
    <LogoutStack.Screen
      name={"logout.index"}
      component={LogoutIndexScreen}
    />
  </LogoutStack.Navigator>
);

const FindEmailStack = createStackNavigator();
const FindEmailStackScreen = () => (
  <FindEmailStack.Navigator
    screenOptions={useNavOptions()}
  >
    <FindEmailStack.Screen
      name={"find_email.index"}
      component={FindEmailIndexScreen}
    />
    <FindEmailStack.Screen
      name={"find_email.end"}
      component={FindEmailEndScreen}
    />
  </FindEmailStack.Navigator>
);

const ResetPasswordStack = createStackNavigator();
const ResetPasswordStackScreen = () => (
  <ResetPasswordStack.Navigator
    screenOptions={useNavOptions()}
  >
    <ResetPasswordStack.Screen
      name={"reset_password.set"}
      component={ResetPasswordSetScreen}
    />
    <ResetPasswordStack.Screen
      name={"reset_password.end"}
      component={ResetPasswordEndScreen}
    />
    <ResetPasswordStack.Screen
      name={"reset_password.index"}
      component={ResetPasswordIndexScreen}
    />
  </ResetPasswordStack.Navigator>
);

const RegisterStack = createStackNavigator();
const RegisterStackScreen = () => (
  <RegisterStack.Navigator
    screenOptions={useNavOptions()}
  >
    <RegisterStack.Screen
      name={"register.detail"}
      component={RegisterDetailScreen}
    />
    <RegisterStack.Screen
      name={"register.end"}
      component={RegisterEndScreen}
    />
    <RegisterStack.Screen
      name={"register.index"}
      component={RegisterIndexScreen}
    />
  </RegisterStack.Navigator>
);

const VerifyPhoneStack = createStackNavigator();
const VerifyPhoneStackScreen = () => (
  <VerifyPhoneStack.Navigator
    screenOptions={useNavOptions()}
  >
    <VerifyPhoneStack.Screen
      name={"verify_phone.verify"}
      component={VerifyPhoneVerifyScreen}
    />
    <VerifyPhoneStack.Screen
      name={"verify_phone.end"}
      component={VerifyPhoneEndScreen}
    />
    <VerifyPhoneStack.Screen
      name={"verify_phone.index"}
      component={VerifyPhoneIndexScreen}
    />
  </VerifyPhoneStack.Navigator>
);

const VerifyEmailStack = createStackNavigator();
const VerifyEmailStackScreen = () => (
  <VerifyEmailStack.Navigator
    screenOptions={useNavOptions()}
  >
    <VerifyEmailStack.Screen
      name={"verify_email.verify"}
      component={VerifyEmailVerifyScreen}
    />
    <VerifyEmailStack.Screen
      name={"verify_email.end"}
      component={VerifyEmailEndScreen}
    />
    <VerifyEmailStack.Screen
      name={"verify_email.index"}
      component={VerifyEmailIndexScreen}
    />
  </VerifyEmailStack.Navigator>
);
