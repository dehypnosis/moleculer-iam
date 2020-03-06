import React, { createContext, useContext } from "react";
import { createStackNavigator, StackNavigationOptions } from "@react-navigation/stack";
import { useThemePalette } from "../screen/component";
import { ConsentScreen } from "../screen/consent";
import { ErrorScreen } from "../screen/error";
import { routeConfig } from "./routes";
import { AppOptionsProvider } from "./options";
import { AppStateProvider } from "./state";
import { AppNavigationProvider } from "./navigation";
import { ApplicationThemeProvider } from "./theme";

import { FindEmailIndexScreen } from "../screen/find_email.index";
import { FindEmailVerifyScreen } from "../screen/find_email.verify";
import { LoginCheckPasswordScreen } from "../screen/login.check_password";
import { LoginIndexScreen } from "../screen/login.index";
import { LogoutEndScreen } from "../screen/logout.end";
import { LogoutIndexScreen } from "../screen/logout.index";
import { RegisterDetailScreen } from "../screen/register.detail";
import { RegisterEndScreen } from "../screen/register.end";
import { RegisterIndexScreen } from "../screen/register.index";
import { ResetPasswordEndScreen } from "../screen/reset_password.end";
import { ResetPasswordIndexScreen } from "../screen/reset_password.index";
import { ResetPasswordSentScreen } from "../screen/reset_password.sent";
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
      <ApplicationThemeProvider>
        <AppStateProvider>
          <AppNavigationProvider routeConfig={routeConfig}>
            <AppStacks />
          </AppNavigationProvider>
        </AppStateProvider>
      </ApplicationThemeProvider>
    </AppOptionsProvider>
  )
};


const NavOptionsProvider = createContext<StackNavigationOptions>(undefined as any);
const useNavOptions = () => useContext(NavOptionsProvider);

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
          name={"error"}
          component={ErrorScreen}
        />
        <RootStack.Screen
          name={"consent"}
          component={ConsentScreen}
        />
        <RootStack.Screen
          name={"login"}
          component={LoginStackScreen}
        />
        <RootStack.Screen
          name={"find_email"}
          component={FindEmailStackScreen}
        />
        <RootStack.Screen
          name={"reset_password"}
          component={ResetPasswordStackScreen}
        />
        <RootStack.Screen
          name={"register"}
          component={RegisterStackScreen}
        />
        <RootStack.Screen
          name={"logout"}
          component={LogoutStackScreen}
        />
        <RootStack.Screen
          name={"verify_phone"}
          component={VerifyPhoneStackScreen}
        />
        <RootStack.Screen
          name={"verify_email"}
          component={VerifyEmailStackScreen}
        />
      </RootStack.Navigator>
    </NavOptionsProvider.Provider>
  )
}

const RootStack = createStackNavigator();

const LoginStack = createStackNavigator();
const LoginStackScreen: React.FunctionComponent<{backgroundColor: string}> = ({ backgroundColor }) => (
  <LoginStack.Navigator
    screenOptions={useNavOptions()}
  >
    <LoginStack.Screen
      name={"login.index"}
      component={LoginIndexScreen}
    />
    <LoginStack.Screen
      name={"login.check_password"}
      component={LoginCheckPasswordScreen}
    />
  </LoginStack.Navigator>
);

const LogoutStack = createStackNavigator();
const LogoutStackScreen = () => (
  <LogoutStack.Navigator
    screenOptions={useNavOptions()}
  >
    <LogoutStack.Screen
      name={"logout.index"}
      component={LogoutIndexScreen}
    />
    <LogoutStack.Screen
      name={"logout.end"}
      component={LogoutEndScreen}
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
      name={"find_email.verify"}
      component={FindEmailVerifyScreen}
    />
  </FindEmailStack.Navigator>
);

const ResetPasswordStack = createStackNavigator();
const ResetPasswordStackScreen = () => (
  <ResetPasswordStack.Navigator
    screenOptions={useNavOptions()}
  >
    <ResetPasswordStack.Screen
      name={"reset_password.index"}
      component={ResetPasswordIndexScreen}
    />
    <ResetPasswordStack.Screen
      name={"reset_password.sent"}
      component={ResetPasswordSentScreen}
    />
    <ResetPasswordStack.Screen
      name={"reset_password.set"}
      component={ResetPasswordSetScreen}
    />
    <ResetPasswordStack.Screen
      name={"reset_password.end"}
      component={ResetPasswordEndScreen}
    />
  </ResetPasswordStack.Navigator>
);

const RegisterStack = createStackNavigator();
const RegisterStackScreen = () => (
  <RegisterStack.Navigator
    screenOptions={useNavOptions()}
  >
    <RegisterStack.Screen
      name={"register.index"}
      component={RegisterIndexScreen}
    />
    <RegisterStack.Screen
      name={"register.detail"}
      component={RegisterDetailScreen}
    />
    <RegisterStack.Screen
      name={"register.end"}
      component={RegisterEndScreen}
    />
  </RegisterStack.Navigator>
);

const VerifyPhoneStack = createStackNavigator();
const VerifyPhoneStackScreen = () => (
  <VerifyPhoneStack.Navigator
    screenOptions={useNavOptions()}
  >
    <VerifyPhoneStack.Screen
      name={"verify_phone.index"}
      component={VerifyPhoneIndexScreen}
    />
    <VerifyPhoneStack.Screen
      name={"verify_phone.verify"}
      component={VerifyPhoneVerifyScreen}
    />
    <VerifyPhoneStack.Screen
      name={"verify_phone.end"}
      component={VerifyPhoneEndScreen}
    />
  </VerifyPhoneStack.Navigator>
);

const VerifyEmailStack = createStackNavigator();
const VerifyEmailStackScreen = () => (
  <VerifyEmailStack.Navigator
    screenOptions={useNavOptions()}
  >
    <VerifyEmailStack.Screen
      name={"verify_email.index"}
      component={VerifyEmailIndexScreen}
    />
    <VerifyEmailStack.Screen
      name={"verify_email.verify"}
      component={VerifyEmailVerifyScreen}
    />
    <VerifyEmailStack.Screen
      name={"verify_email.end"}
      component={VerifyEmailEndScreen}
    />
  </VerifyEmailStack.Navigator>
);
