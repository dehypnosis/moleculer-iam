import React from "react";
import { LinkingOptions } from "@react-navigation/native/lib/typescript/src/types";
import { createStackNavigator, StackNavigationOptions } from "@react-navigation/stack";
import { getAppOptions } from "../hook";

// error
import { ErrorScreen } from "../screen/error";
// import { LoadingScreen } from "../screen/loading";

// login
import { LoginIndexScreen } from "../screen/login.index";
import { LoginCheckPasswordScreen } from "../screen/login.check_password";

// consent
import { ConsentScreen } from "../screen/consent";

// logout
import { LogoutIndexScreen } from "../screen/logout.index";
import { LogoutEndScreen } from "../screen/logout.end";

// find email
import { FindEmailIndexScreen } from "../screen/find_email.index";
import { FindEmailVerifyScreen } from "../screen/find_email.verify";

// reset password
import { ResetPasswordIndexScreen } from "../screen/reset_password.index";
import { ResetPasswordSentScreen } from "../screen/reset_password.sent";
import { ResetPasswordSetScreen } from "../screen/reset_password.set";
import { ResetPasswordEndScreen } from "../screen/reset_password.end";

// register
import { RegisterIndexScreen } from "../screen/register.index";
import { RegisterDetailScreen } from "../screen/register.detail";
import { RegisterEndScreen } from "../screen/register.end";

// verify phone
import { VerifyPhoneIndexScreen } from "../screen/verify_phone.index";
import { VerifyPhoneVerifyScreen } from "../screen/verify_phone.verify";
import { VerifyPhoneEndScreen } from "../screen/verify_phone.end";

// verify email
import { VerifyEmailIndexScreen } from "../screen/verify_email.index";
import { VerifyEmailVerifyScreen } from "../screen/verify_email.verify";
import { VerifyEmailEndScreen } from "../screen/verify_email.end";


let prefix = getAppOptions().prefix;
if (prefix.startsWith("/")) prefix = prefix.substr(1);

export const routeConfig: LinkingOptions["config"] = {
  "login": {
    screens: {
      "login.check_password": `${prefix}/login/check_password`,
      "login.index": `${prefix}/login`,
    },
  },
  "consent": `${prefix}/consent`,
  "logout": {
    screens: {
      "logout.end": `${prefix}/session/end/success`,
      "logout.index": `${prefix}/session/end`,
    },
  },
  "find_email": {
    screens: {
      "find_email.verify": `${prefix}/find_email/verify`,
      "find_email.index": `${prefix}/find_email`,
    },
  },
  "reset_password": {
    screens: {
      "reset_password.end": `${prefix}/reset_password/end`,
      "reset_password.set": `${prefix}/reset_password/set`,
      "reset_password.sent": `${prefix}/reset_password/sent`,
      "reset_password.index": `${prefix}/reset_password`,
    },
  },
  "register": {
    screens: {
      "register.end": `${prefix}/register/end`,
      "register.detail": `${prefix}/register/detail`,
      "register.index": `${prefix}/register`,
    },
  },
  "verify_phone": {
    screens: {
      "verify_phone.end": `${prefix}/verify_phone/end`,
      "verify_phone.verify": `${prefix}/verify_phone/verify`,
      "verify_phone.index": `${prefix}/verify_phone`,
    },
  },
  "verify_email": {
    screens: {
      "verify_email.end": `${prefix}/verify_email/end`,
      "verify_email.verify": `${prefix}/verify_email/verify`,
      "verify_email.index": `${prefix}/verify_email`,
    },
  },
  "error": "",
};

const RootStack = createStackNavigator();
const screenOptions: StackNavigationOptions = {
  headerShown: false,
  cardStyle: {
    backgroundColor: "#ffffff",
  },
};

const LoginStack = createStackNavigator();
const LoginStackScreen = () => (
  <LoginStack.Navigator
    screenOptions={screenOptions}
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
    screenOptions={screenOptions}
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
    screenOptions={screenOptions}
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
    screenOptions={screenOptions}
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
    screenOptions={screenOptions}
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
    screenOptions={screenOptions}
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
    screenOptions={screenOptions}
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

export const AppNavigator: React.FunctionComponent<{loading: boolean}> = ({ loading }) => {
  if (loading) {
    return null;
    // return <LoadingScreen />;
  }

  return (
    <RootStack.Navigator
      screenOptions={screenOptions}
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
  );
};
