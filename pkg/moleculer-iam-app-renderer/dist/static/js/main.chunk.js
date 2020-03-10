(this["webpackJsonpmoleculer-iam-app-renderer"] = this["webpackJsonpmoleculer-iam-app-renderer"] || []).push([["main"],{

/***/ "../../node_modules/css-loader/dist/cjs.js?!../../node_modules/postcss-loader/src/index.js?!./src/app/theme.css":
/*!******************************************************************************************************************************************************************************************************************!*\
  !*** /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/css-loader/dist/cjs.js??ref--6-oneOf-3-1!/Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/postcss-loader/src??postcss!./src/app/theme.css ***!
  \******************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/api.js */ "../../node_modules/css-loader/dist/runtime/api.js");
exports = ___CSS_LOADER_API_IMPORT___(false);
exports.push([module.i, "@import url(https://fonts.googleapis.com/css?family=Noto+Sans+KR:400,500,700&display=swap&subset=korean);"]);
// Module
exports.push([module.i, "body {\n  margin: 0;\n  padding: 0;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n  font-family: 'Noto Sans KR', sans-serif;\n}\n\n#root {\n  height: 100vh;\n  min-width: 320px;\n}\n\n#theme-container {\n  height: 100vh;\n}\n\n#nav-container {\n  height: 100vh;\n  width: 100%;\n}\n\n@media (min-width: 640px) {\n  #nav-container {\n    width: 375px;\n  }\n}\n\n@media (pointer:none) and (max-width: 640px), (pointer:coarse) and (max-width: 640px) {\n  [data-role=\"scroll-container\"] {\n    margin-top: 50px !important;\n    margi-bottom: 0px !important;\n  }\n}\n", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ "./inject.js":
/*!*******************!*\
  !*** ./inject.js ***!
  \*******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
}); // parse app options from html document

function getAppOptions() {
  if (typeof window === "undefined") {
    throw new Error("cannot call getAppOptions from server-side");
  }

  return window.__APP_OPTIONS__ || {};
}

exports.getAppOptions = getAppOptions; // parse initial app state from html document

function getInitialAppState() {
  if (typeof window === "undefined") {
    throw new Error("cannot call getInitialAppState from server-side");
  }

  return window.__APP_STATE__ || {
    name: "error",
    error: {
      error: "unexpected_error",
      error_description: "Unrecognized state received from server."
    }
  };
}

exports.getInitialAppState = getInitialAppState;

function getAppPrefix() {
  if (typeof window === "undefined") {
    throw new Error("cannot call getAppPrefix from server-side");
  }

  return window.__APP_PREFIX__ || "/op";
}

exports.getAppPrefix = getAppPrefix;

function getAppDev() {
  if (typeof window === "undefined") {
    throw new Error("cannot call getAppDev from server-side");
  }

  return window.__APP_DEV__ !== false;
}

exports.getAppDev = getAppDev;

/***/ }),

/***/ "./src/app/app.tsx":
/*!*************************!*\
  !*** ./src/app/app.tsx ***!
  \*************************/
/*! exports provided: App */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "App", function() { return App; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _react_navigation_stack__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @react-navigation/stack */ "../../node_modules/@react-navigation/stack/lib/module/index.js");
/* harmony import */ var _screen_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../screen/component */ "./src/screen/component/index.ts");
/* harmony import */ var _screen_consent__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../screen/consent */ "./src/screen/consent.tsx");
/* harmony import */ var _screen_error__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../screen/error */ "./src/screen/error.tsx");
/* harmony import */ var _routes__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./routes */ "./src/app/routes.ts");
/* harmony import */ var _options__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./options */ "./src/app/options.tsx");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./state */ "./src/app/state.tsx");
/* harmony import */ var _navigation__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./navigation */ "./src/app/navigation.tsx");
/* harmony import */ var _theme__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./theme */ "./src/app/theme.tsx");
/* harmony import */ var _screen_find_email_index__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../screen/find_email.index */ "./src/screen/find_email.index.tsx");
/* harmony import */ var _screen_find_email_end__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../screen/find_email.end */ "./src/screen/find_email.end.tsx");
/* harmony import */ var _screen_login_check_password__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../screen/login.check_password */ "./src/screen/login.check_password.tsx");
/* harmony import */ var _screen_login_index__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../screen/login.index */ "./src/screen/login.index.tsx");
/* harmony import */ var _screen_logout_end__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../screen/logout.end */ "./src/screen/logout.end.tsx");
/* harmony import */ var _screen_logout_index__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../screen/logout.index */ "./src/screen/logout.index.tsx");
/* harmony import */ var _screen_register_detail__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../screen/register.detail */ "./src/screen/register.detail.tsx");
/* harmony import */ var _screen_register_end__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../screen/register.end */ "./src/screen/register.end.tsx");
/* harmony import */ var _screen_register_index__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../screen/register.index */ "./src/screen/register.index.tsx");
/* harmony import */ var _screen_reset_password_end__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../screen/reset_password.end */ "./src/screen/reset_password.end.tsx");
/* harmony import */ var _screen_reset_password_index__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../screen/reset_password.index */ "./src/screen/reset_password.index.tsx");
/* harmony import */ var _screen_reset_password_set__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ../screen/reset_password.set */ "./src/screen/reset_password.set.tsx");
/* harmony import */ var _screen_verify_email_end__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ../screen/verify_email.end */ "./src/screen/verify_email.end.tsx");
/* harmony import */ var _screen_verify_email_index__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ../screen/verify_email.index */ "./src/screen/verify_email.index.tsx");
/* harmony import */ var _screen_verify_email_verify__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ../screen/verify_email.verify */ "./src/screen/verify_email.verify.tsx");
/* harmony import */ var _screen_verify_phone_end__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ../screen/verify_phone.end */ "./src/screen/verify_phone.end.tsx");
/* harmony import */ var _screen_verify_phone_index__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ../screen/verify_phone.index */ "./src/screen/verify_phone.index.tsx");
/* harmony import */ var _screen_verify_phone_verify__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ../screen/verify_phone.verify */ "./src/screen/verify_phone.verify.tsx");
var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/src/app/app.tsx";




























const App = () => {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_options__WEBPACK_IMPORTED_MODULE_6__["AppOptionsProvider"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 34
    },
    __self: undefined
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_theme__WEBPACK_IMPORTED_MODULE_9__["ApplicationThemeProvider"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 35
    },
    __self: undefined
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_state__WEBPACK_IMPORTED_MODULE_7__["AppStateProvider"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 36
    },
    __self: undefined
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_navigation__WEBPACK_IMPORTED_MODULE_8__["AppNavigationProvider"], {
    routeConfig: _routes__WEBPACK_IMPORTED_MODULE_5__["routeConfig"],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 37
    },
    __self: undefined
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(AppTabs, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 38
    },
    __self: undefined
  })))));
};
const NavOptionsProvider = Object(react__WEBPACK_IMPORTED_MODULE_0__["createContext"])(undefined);

const useNavOptions = () => Object(react__WEBPACK_IMPORTED_MODULE_0__["useContext"])(NavOptionsProvider);

const RootStack = Object(_react_navigation_stack__WEBPACK_IMPORTED_MODULE_1__["createStackNavigator"])();

const AppTabs = () => {
  const backgroundColor = Object(_screen_component__WEBPACK_IMPORTED_MODULE_2__["useThemePalette"])()["background-basic-color-1"];
  const navOptions = {
    headerShown: false,
    cardStyle: {
      backgroundColor
    },
    gestureEnabled: false // animationEnabled: false,
    // transitionSpec: {
    //   open: RevealFromBottomAndroid,
    //   close: RevealFromBottomAndroid,
    // },

  };
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(NavOptionsProvider.Provider, {
    value: navOptions,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 68
    },
    __self: undefined
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(RootStack.Navigator, {
    screenOptions: navOptions,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 69
    },
    __self: undefined
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(RootStack.Screen, {
    name: "error.stack",
    component: ErrorStackScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 72
    },
    __self: undefined
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(RootStack.Screen, {
    name: "consent.stack",
    component: ConsentStackScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 76
    },
    __self: undefined
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(RootStack.Screen, {
    name: "login.stack",
    component: LoginStackScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 80
    },
    __self: undefined
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(RootStack.Screen, {
    name: "find_email.stack",
    component: FindEmailStackScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 84
    },
    __self: undefined
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(RootStack.Screen, {
    name: "reset_password.stack",
    component: ResetPasswordStackScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 88
    },
    __self: undefined
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(RootStack.Screen, {
    name: "register.stack",
    component: RegisterStackScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 92
    },
    __self: undefined
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(RootStack.Screen, {
    name: "logout.stack",
    component: LogoutStackScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 96
    },
    __self: undefined
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(RootStack.Screen, {
    name: "verify_phone.stack",
    component: VerifyPhoneStackScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 100
    },
    __self: undefined
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(RootStack.Screen, {
    name: "verify_email.stack",
    component: VerifyEmailStackScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 104
    },
    __self: undefined
  })));
};

const ErrorStack = Object(_react_navigation_stack__WEBPACK_IMPORTED_MODULE_1__["createStackNavigator"])();

const ErrorStackScreen = () => react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ErrorStack.Navigator, {
  screenOptions: useNavOptions(),
  __source: {
    fileName: _jsxFileName,
    lineNumber: 115
  },
  __self: undefined
}, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ErrorStack.Screen, {
  name: "error.index",
  component: _screen_error__WEBPACK_IMPORTED_MODULE_4__["ErrorScreen"],
  __source: {
    fileName: _jsxFileName,
    lineNumber: 118
  },
  __self: undefined
}));

const ConsentStack = Object(_react_navigation_stack__WEBPACK_IMPORTED_MODULE_1__["createStackNavigator"])();

const ConsentStackScreen = () => react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ConsentStack.Navigator, {
  screenOptions: useNavOptions(),
  __source: {
    fileName: _jsxFileName,
    lineNumber: 127
  },
  __self: undefined
}, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ConsentStack.Screen, {
  name: "consent.index",
  component: _screen_consent__WEBPACK_IMPORTED_MODULE_3__["ConsentScreen"],
  __source: {
    fileName: _jsxFileName,
    lineNumber: 130
  },
  __self: undefined
}));

const LoginStack = Object(_react_navigation_stack__WEBPACK_IMPORTED_MODULE_1__["createStackNavigator"])();

const LoginStackScreen = () => react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(LoginStack.Navigator, {
  screenOptions: useNavOptions(),
  __source: {
    fileName: _jsxFileName,
    lineNumber: 139
  },
  __self: undefined
}, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(LoginStack.Screen, {
  name: "login.check_password",
  component: _screen_login_check_password__WEBPACK_IMPORTED_MODULE_12__["LoginCheckPasswordScreen"],
  __source: {
    fileName: _jsxFileName,
    lineNumber: 142
  },
  __self: undefined
}), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(LoginStack.Screen, {
  name: "login.index",
  component: _screen_login_index__WEBPACK_IMPORTED_MODULE_13__["LoginIndexScreen"],
  __source: {
    fileName: _jsxFileName,
    lineNumber: 146
  },
  __self: undefined
}));

const LogoutStack = Object(_react_navigation_stack__WEBPACK_IMPORTED_MODULE_1__["createStackNavigator"])();

const LogoutStackScreen = () => react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(LogoutStack.Navigator, {
  screenOptions: useNavOptions(),
  __source: {
    fileName: _jsxFileName,
    lineNumber: 155
  },
  __self: undefined
}, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(LogoutStack.Screen, {
  name: "logout.end",
  component: _screen_logout_end__WEBPACK_IMPORTED_MODULE_14__["LogoutEndScreen"],
  __source: {
    fileName: _jsxFileName,
    lineNumber: 158
  },
  __self: undefined
}), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(LogoutStack.Screen, {
  name: "logout.index",
  component: _screen_logout_index__WEBPACK_IMPORTED_MODULE_15__["LogoutIndexScreen"],
  __source: {
    fileName: _jsxFileName,
    lineNumber: 162
  },
  __self: undefined
}));

const FindEmailStack = Object(_react_navigation_stack__WEBPACK_IMPORTED_MODULE_1__["createStackNavigator"])();

const FindEmailStackScreen = () => react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(FindEmailStack.Navigator, {
  screenOptions: useNavOptions(),
  __source: {
    fileName: _jsxFileName,
    lineNumber: 171
  },
  __self: undefined
}, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(FindEmailStack.Screen, {
  name: "find_email.index",
  component: _screen_find_email_index__WEBPACK_IMPORTED_MODULE_10__["FindEmailIndexScreen"],
  __source: {
    fileName: _jsxFileName,
    lineNumber: 174
  },
  __self: undefined
}), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(FindEmailStack.Screen, {
  name: "find_email.end",
  component: _screen_find_email_end__WEBPACK_IMPORTED_MODULE_11__["FindEmailEndScreen"],
  __source: {
    fileName: _jsxFileName,
    lineNumber: 178
  },
  __self: undefined
}));

const ResetPasswordStack = Object(_react_navigation_stack__WEBPACK_IMPORTED_MODULE_1__["createStackNavigator"])();

const ResetPasswordStackScreen = () => react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ResetPasswordStack.Navigator, {
  screenOptions: useNavOptions(),
  __source: {
    fileName: _jsxFileName,
    lineNumber: 187
  },
  __self: undefined
}, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ResetPasswordStack.Screen, {
  name: "reset_password.set",
  component: _screen_reset_password_set__WEBPACK_IMPORTED_MODULE_21__["ResetPasswordSetScreen"],
  __source: {
    fileName: _jsxFileName,
    lineNumber: 190
  },
  __self: undefined
}), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ResetPasswordStack.Screen, {
  name: "reset_password.end",
  component: _screen_reset_password_end__WEBPACK_IMPORTED_MODULE_19__["ResetPasswordEndScreen"],
  __source: {
    fileName: _jsxFileName,
    lineNumber: 194
  },
  __self: undefined
}), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ResetPasswordStack.Screen, {
  name: "reset_password.index",
  component: _screen_reset_password_index__WEBPACK_IMPORTED_MODULE_20__["ResetPasswordIndexScreen"],
  __source: {
    fileName: _jsxFileName,
    lineNumber: 198
  },
  __self: undefined
}));

const RegisterStack = Object(_react_navigation_stack__WEBPACK_IMPORTED_MODULE_1__["createStackNavigator"])();

const RegisterStackScreen = () => react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(RegisterStack.Navigator, {
  screenOptions: useNavOptions(),
  __source: {
    fileName: _jsxFileName,
    lineNumber: 207
  },
  __self: undefined
}, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(RegisterStack.Screen, {
  name: "register.detail",
  component: _screen_register_detail__WEBPACK_IMPORTED_MODULE_16__["RegisterDetailScreen"],
  __source: {
    fileName: _jsxFileName,
    lineNumber: 210
  },
  __self: undefined
}), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(RegisterStack.Screen, {
  name: "register.end",
  component: _screen_register_end__WEBPACK_IMPORTED_MODULE_17__["RegisterEndScreen"],
  __source: {
    fileName: _jsxFileName,
    lineNumber: 214
  },
  __self: undefined
}), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(RegisterStack.Screen, {
  name: "register.index",
  component: _screen_register_index__WEBPACK_IMPORTED_MODULE_18__["RegisterIndexScreen"],
  __source: {
    fileName: _jsxFileName,
    lineNumber: 218
  },
  __self: undefined
}));

const VerifyPhoneStack = Object(_react_navigation_stack__WEBPACK_IMPORTED_MODULE_1__["createStackNavigator"])();

const VerifyPhoneStackScreen = () => react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(VerifyPhoneStack.Navigator, {
  screenOptions: useNavOptions(),
  __source: {
    fileName: _jsxFileName,
    lineNumber: 227
  },
  __self: undefined
}, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(VerifyPhoneStack.Screen, {
  name: "verify_phone.verify",
  component: _screen_verify_phone_verify__WEBPACK_IMPORTED_MODULE_27__["VerifyPhoneVerifyScreen"],
  __source: {
    fileName: _jsxFileName,
    lineNumber: 230
  },
  __self: undefined
}), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(VerifyPhoneStack.Screen, {
  name: "verify_phone.end",
  component: _screen_verify_phone_end__WEBPACK_IMPORTED_MODULE_25__["VerifyPhoneEndScreen"],
  __source: {
    fileName: _jsxFileName,
    lineNumber: 234
  },
  __self: undefined
}), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(VerifyPhoneStack.Screen, {
  name: "verify_phone.index",
  component: _screen_verify_phone_index__WEBPACK_IMPORTED_MODULE_26__["VerifyPhoneIndexScreen"],
  __source: {
    fileName: _jsxFileName,
    lineNumber: 238
  },
  __self: undefined
}));

const VerifyEmailStack = Object(_react_navigation_stack__WEBPACK_IMPORTED_MODULE_1__["createStackNavigator"])();

const VerifyEmailStackScreen = () => react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(VerifyEmailStack.Navigator, {
  screenOptions: useNavOptions(),
  __source: {
    fileName: _jsxFileName,
    lineNumber: 247
  },
  __self: undefined
}, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(VerifyEmailStack.Screen, {
  name: "verify_email.verify",
  component: _screen_verify_email_verify__WEBPACK_IMPORTED_MODULE_24__["VerifyEmailVerifyScreen"],
  __source: {
    fileName: _jsxFileName,
    lineNumber: 250
  },
  __self: undefined
}), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(VerifyEmailStack.Screen, {
  name: "verify_email.end",
  component: _screen_verify_email_end__WEBPACK_IMPORTED_MODULE_22__["VerifyEmailEndScreen"],
  __source: {
    fileName: _jsxFileName,
    lineNumber: 254
  },
  __self: undefined
}), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(VerifyEmailStack.Screen, {
  name: "verify_email.index",
  component: _screen_verify_email_index__WEBPACK_IMPORTED_MODULE_23__["VerifyEmailIndexScreen"],
  __source: {
    fileName: _jsxFileName,
    lineNumber: 258
  },
  __self: undefined
}));

/***/ }),

/***/ "./src/app/index.ts":
/*!**************************!*\
  !*** ./src/app/index.ts ***!
  \**************************/
/*! exports provided: useAppOptions, useAppState, useNavigation, App */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _options__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./options */ "./src/app/options.tsx");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "useAppOptions", function() { return _options__WEBPACK_IMPORTED_MODULE_0__["useAppOptions"]; });

/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./state */ "./src/app/state.tsx");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "useAppState", function() { return _state__WEBPACK_IMPORTED_MODULE_1__["useAppState"]; });

/* harmony import */ var _navigation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./navigation */ "./src/app/navigation.tsx");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "useNavigation", function() { return _navigation__WEBPACK_IMPORTED_MODULE_2__["useNavigation"]; });

/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app */ "./src/app/app.tsx");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "App", function() { return _app__WEBPACK_IMPORTED_MODULE_3__["App"]; });






/***/ }),

/***/ "./src/app/navigation.tsx":
/*!********************************!*\
  !*** ./src/app/navigation.tsx ***!
  \********************************/
/*! exports provided: AppNavigationProvider, useNavigation */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppNavigationProvider", function() { return AppNavigationProvider; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "useNavigation", function() { return useNavigation; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _react_navigation_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @react-navigation/core */ "../../node_modules/@react-navigation/core/lib/module/index.js");
/* harmony import */ var _react_navigation_native__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @react-navigation/native */ "../../node_modules/@react-navigation/native/lib/module/index.js");
/* harmony import */ var react_native__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-native */ "../../node_modules/react-native-web/dist/index.js");
/* harmony import */ var _hook__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../hook */ "./src/hook.ts");
/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./state */ "./src/app/state.tsx");
var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/src/app/navigation.tsx";






const AppNavigationProvider = ({
  routeConfig,
  children
}) => {
  const [appState] = Object(_state__WEBPACK_IMPORTED_MODULE_5__["useAppState"])(); // link nav state with URL

  const ref = Object(react__WEBPACK_IMPORTED_MODULE_0__["useRef"])();
  const deepLinking = Object(_react_navigation_native__WEBPACK_IMPORTED_MODULE_2__["useLinking"])(ref, {
    prefixes: [window.location.origin],
    config: routeConfig,
    getStateFromPath: Object(react__WEBPACK_IMPORTED_MODULE_0__["useCallback"])((path, options) => {
      const navState = Object(_react_navigation_core__WEBPACK_IMPORTED_MODULE_1__["getStateFromPath"])(path, options);

      if (navState) {
        // show error route on server error
        if (appState.error) {
          navState.routes[0].name = "error";
          console.error(`appState.error`, appState);
        }

        console.debug("nav state update:", navState);
      }

      return navState;
    }, [appState])
  }); // load initial nav state

  const [initialState, setInitialState] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(null);
  const [loading, setLoading] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(true);
  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(() => {
    deepLinking.getInitialState().then(nav => setInitialState(nav), err => console.error(err)).finally(() => setLoading(false));
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  []);

  if (loading) {
    return null;
  }

  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_react_navigation_native__WEBPACK_IMPORTED_MODULE_2__["NavigationContainer"], {
    initialState: initialState,
    ref: ref,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 50
    },
    __self: undefined
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_native__WEBPACK_IMPORTED_MODULE_3__["View"], {
    nativeID: "nav-container",
    style: {
      alignSelf: "center"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 54
    },
    __self: undefined
  }, children));
}; // enhance navigation instance methods

function useNavigation() {
  // set undefined params as empty object
  const route = Object(_react_navigation_native__WEBPACK_IMPORTED_MODULE_2__["useRoute"])(); // override nav methods to include locale query for navigation

  const nav = Object(_react_navigation_core__WEBPACK_IMPORTED_MODULE_1__["useNavigation"])();
  const navigate = nav.navigate; // @ts-ignore

  if (!navigate.__enhanced) {
    nav.navigate = (...args) => {
      includeLocaleQuery(args, route);
      navigate(...args); // call navigate twice as a workaround to fix a bug which does not update existing screen's params

      if (args[1] && args[1].screen && nav.dangerouslyGetState().routes.every(r => r.name !== args[1].screen)) {
        navigate(...args);
      }
    }; // @ts-ignore


    nav.navigate.__enhanced = true;
  }

  const [appOptions] = Object(_hook__WEBPACK_IMPORTED_MODULE_4__["useAppOptions"])();

  if (appOptions.dev) {
    // @ts-ignore
    window.__APP_DEV__.nav = nav;
  }

  if (!route.params) route.params = {};
  return {
    nav,
    route
  };
}

function includeLocaleQuery(args, route) {
  if (route.params && route.params.locale) {
    if (!args[1] || !args[1].params || !args[1].params.locale) {
      if (!args[1]) {
        args[1] = {};
      }

      if (!args[1].params) {
        args[1].params = {};
      }

      args[1].params.locale = route.params.locale;
    }
  }
}

/***/ }),

/***/ "./src/app/options.tsx":
/*!*****************************!*\
  !*** ./src/app/options.tsx ***!
  \*****************************/
/*! exports provided: AppOptionsContext, useAppOptions, AppOptionsProvider */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppOptionsContext", function() { return AppOptionsContext; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "useAppOptions", function() { return useAppOptions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppOptionsProvider", function() { return AppOptionsProvider; });
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash */ "../../node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "../../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _inject__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../inject */ "./inject.js");
/* harmony import */ var _inject__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_inject__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _theme__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../theme */ "./theme.js");
/* harmony import */ var _theme__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_theme__WEBPACK_IMPORTED_MODULE_3__);
var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/src/app/options.tsx";




const AppOptionsContext = Object(react__WEBPACK_IMPORTED_MODULE_1__["createContext"])([]);
function useAppOptions() {
  return Object(react__WEBPACK_IMPORTED_MODULE_1__["useContext"])(AppOptionsContext);
}
class AppOptionsProvider extends react__WEBPACK_IMPORTED_MODULE_1___default.a.Component {
  constructor(...args) {
    super(...args);
    this.state = lodash__WEBPACK_IMPORTED_MODULE_0__["defaultsDeep"]({ ...Object(_inject__WEBPACK_IMPORTED_MODULE_2__["getAppOptions"])(),
      dev: Object(_inject__WEBPACK_IMPORTED_MODULE_2__["getAppDev"])()
    }, {
      logo: {
        uri: null,
        align: "flex-start",
        height: "50px",
        width: "92px"
      },
      login: {
        federationOptionsVisible: false
      },
      register: {
        skipDetailClaims: false,
        skipEmailVerification: false,
        skipPhoneVerification: false
      },
      theme: "light",
      palette: {
        light: _theme__WEBPACK_IMPORTED_MODULE_3__["lightTheme"],
        dark: _theme__WEBPACK_IMPORTED_MODULE_3__["darkTheme"]
      }
    });
  }

  render() {
    console.debug("app options update:", this.state);
    return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(AppOptionsContext.Provider, {
      value: [this.state, this.setState.bind(this)],
      __source: {
        fileName: _jsxFileName,
        lineNumber: 42
      },
      __self: this
    }, this.props.children);
  }

}

/***/ }),

/***/ "./src/app/routes.ts":
/*!***************************!*\
  !*** ./src/app/routes.ts ***!
  \***************************/
/*! exports provided: routeConfig */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "routeConfig", function() { return routeConfig; });
/* harmony import */ var _inject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../inject */ "./inject.js");
/* harmony import */ var _inject__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_inject__WEBPACK_IMPORTED_MODULE_0__);

let prefix = Object(_inject__WEBPACK_IMPORTED_MODULE_0__["getAppPrefix"])();
prefix = prefix.startsWith("/") ? prefix.substr(1) : prefix;
const routeConfig = {
  "login.stack": {
    screens: {
      "login.check_password": `${prefix}/login/check_password`,
      "login.index": `${prefix}/login`
    }
  },
  "consent.stack": {
    screens: {
      "consent.index": `${prefix}/consent`
    }
  },
  "logout.stack": {
    screens: {
      "logout.end": `${prefix}/session/end/success`,
      "logout.index": `${prefix}/session/end`
    }
  },
  "find_email.stack": {
    screens: {
      "find_email.end": `${prefix}/find_email/end`,
      "find_email.index": `${prefix}/find_email`
    }
  },
  "reset_password.stack": {
    screens: {
      "reset_password.end": `${prefix}/reset_password/end`,
      "reset_password.set": `${prefix}/reset_password/set`,
      "reset_password.index": `${prefix}/reset_password`
    }
  },
  "register.stack": {
    screens: {
      "register.end": `${prefix}/register/end`,
      "register.detail": `${prefix}/register/detail`,
      "register.index": `${prefix}/register`
    }
  },
  "verify_phone.stack": {
    screens: {
      "verify_phone.end": `${prefix}/verify_phone/end`,
      "verify_phone.verify": `${prefix}/verify_phone/verify`,
      "verify_phone.index": `${prefix}/verify_phone`
    }
  },
  "verify_email.stack": {
    screens: {
      "verify_email.end": `${prefix}/verify_email/end`,
      "verify_email.verify": `${prefix}/verify_email/verify`,
      "verify_email.index": `${prefix}/verify_email`
    }
  },
  "error.stack": {
    screens: {
      "error.index": ""
    }
  }
};

/***/ }),

/***/ "./src/app/state.tsx":
/*!***************************!*\
  !*** ./src/app/state.tsx ***!
  \***************************/
/*! exports provided: AppStateContext, useAppState, AppStateProvider */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppStateContext", function() { return AppStateContext; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "useAppState", function() { return useAppState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppStateProvider", function() { return AppStateProvider; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _screen_error__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../screen/error */ "./src/screen/error.tsx");
/* harmony import */ var _inject__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../inject */ "./inject.js");
/* harmony import */ var _inject__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_inject__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _options__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./options */ "./src/app/options.tsx");
var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/src/app/state.tsx";



 // read server state and create endpoint request helper

const AppStateContext = Object(react__WEBPACK_IMPORTED_MODULE_0__["createContext"])([]);
function useAppState() {
  return Object(react__WEBPACK_IMPORTED_MODULE_0__["useContext"])(AppStateContext);
}
class AppStateProvider extends react__WEBPACK_IMPORTED_MODULE_0___default.a.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      error: null,
      appState: Object(_inject__WEBPACK_IMPORTED_MODULE_2__["getInitialAppState"])()
    };

    this.dispatch = async (name, userPayload = {}) => {
      const routes = this.state.appState.routes;
      const route = routes && routes[name];

      if (!route) {
        const err = {
          global: "Cannot make a request to unsupported route."
        };
        console.error(err, name, userPayload); // eslint-disable-next-line no-throw-literal

        throw err;
      } // merge user payload with hint payload


      const {
        url,
        synchronous = false,
        method,
        payload
      } = route;
      const mergedPayload = { ...payload,
        ...userPayload
      }; // form submission required (application/x-www-form-urlencoded)

      if (synchronous) {
        const form = document.createElement("form");
        form.action = url;
        form.method = method;
        form.style.display = "none"; // tslint:disable-next-line:forin

        for (const k in mergedPayload) {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = k;
          input.value = mergedPayload[k];
          form.appendChild(input);
        }

        document.body.appendChild(form);
        form.submit();
        return new Promise(() => {});
      } // as xhr


      return fetch(url, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json;charset=UTF-8"
        },
        credentials: "same-origin",
        method,
        body: method !== "GET" ? JSON.stringify(mergedPayload) : undefined
      }).then(res => {
        // parse json response
        return res.json().then(data => {
          if (data.error) {
            // got error response
            if (res.status === 422 && data.error.fields) {
              // got validation error
              console.error("validation error", data.error); // eslint-disable-next-line no-throw-literal

              throw data.error.fields;
            } else {
              const err = {
                global: typeof data.error === "object" ? data.error.error_description || data.error.error || JSON.stringify(data.error) : data.error.toString()
              };
              console.error("global error", err, data); // eslint-disable-next-line no-throw-literal

              throw err;
            }
          } else if (data.session) {
            // got session state update
            const appState = { ...this.state.appState,
              session: data.session
            };
            this.setState(prev => ({ ...prev,
              appState
            }));
            return appState;
          } else if (data.state) {
            // got whole app state update
            const appState = data.state;
            this.setState(prev => ({ ...prev,
              appState
            }));
            console.error("whole application state response received from XHR, this is unexpected behavior but commit update", data);
            return appState;
          } else if (data.redirect) {
            // got redirection request
            window.location.assign(data.redirect);
            return new Promise(() => {});
          } else {
            console.error("unrecognized response structure", data);
          }

          return this.state.appState;
        }, err => {
          console.error("failed to parse xhr response", err); // eslint-disable-next-line no-throw-literal

          throw {
            global: err.message || err.name
          };
        });
      }, err => {
        console.error("failed to get response", err); // eslint-disable-next-line no-throw-literal

        throw {
          global: err.message || err.name
        };
      });
    };
  }

  render() {
    const {
      error,
      appState
    } = this.state;
    console.debug("app state update:", appState); // expose dev helper

    const [appOptions, setAppOptions] = this.context;

    if (appOptions.dev) {
      // @ts-ignore
      window.__APP_DEV__ = {
        options: appOptions,
        setOptions: setAppOptions,
        state: appState,
        dispatch: this.dispatch
      };
    }

    if (error) {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_screen_error__WEBPACK_IMPORTED_MODULE_1__["ClientErrorScreen"], {
        error: error,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 39
        },
        __self: this
      });
    }

    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(AppStateContext.Provider, {
      value: [appState, this.dispatch],
      __source: {
        fileName: _jsxFileName,
        lineNumber: 43
      },
      __self: this
    }, this.props.children);
  } // wrap with error boundary


  componentDidCatch(error, info) {
    this.setState(prev => ({ ...prev,
      error
    }));
    console.error(error, info); // can report uncaught client error here
  } // call xhr request and update app state


}
AppStateProvider.contextType = _options__WEBPACK_IMPORTED_MODULE_3__["AppOptionsContext"];

/***/ }),

/***/ "./src/app/theme.css":
/*!***************************!*\
  !*** ./src/app/theme.css ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../../node_modules/css-loader/dist/cjs.js??ref--6-oneOf-3-1!../../../../node_modules/postcss-loader/src??postcss!./theme.css */ "../../node_modules/css-loader/dist/cjs.js?!../../node_modules/postcss-loader/src/index.js?!./src/app/theme.css");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../../node_modules/style-loader/lib/addStyles.js */ "../../node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(true) {
	module.hot.accept(/*! !../../../../node_modules/css-loader/dist/cjs.js??ref--6-oneOf-3-1!../../../../node_modules/postcss-loader/src??postcss!./theme.css */ "../../node_modules/css-loader/dist/cjs.js?!../../node_modules/postcss-loader/src/index.js?!./src/app/theme.css", function() {
		var newContent = __webpack_require__(/*! !../../../../node_modules/css-loader/dist/cjs.js??ref--6-oneOf-3-1!../../../../node_modules/postcss-loader/src??postcss!./theme.css */ "../../node_modules/css-loader/dist/cjs.js?!../../node_modules/postcss-loader/src/index.js?!./src/app/theme.css");

		if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./src/app/theme.tsx":
/*!***************************!*\
  !*** ./src/app/theme.tsx ***!
  \***************************/
/*! exports provided: ApplicationThemeProvider */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ApplicationThemeProvider", function() { return ApplicationThemeProvider; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _ui_kitten_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ui-kitten/components */ "../../node_modules/@ui-kitten/components/index.js");
/* harmony import */ var _ui_kitten_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_ui_kitten_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _ui_kitten_eva_icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ui-kitten/eva-icons */ "../../node_modules/@ui-kitten/eva-icons/index.js");
/* harmony import */ var _ui_kitten_eva_icons__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_ui_kitten_eva_icons__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _eva_design_eva__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @eva-design/eva */ "../../node_modules/@eva-design/eva/index.js");
/* harmony import */ var _eva_design_eva__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_eva_design_eva__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _options__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./options */ "./src/app/options.tsx");
/* harmony import */ var _theme_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./theme.css */ "./src/app/theme.css");
/* harmony import */ var _theme_css__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_theme_css__WEBPACK_IMPORTED_MODULE_5__);
var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/src/app/theme.tsx";
 // import { View } from "react-native";





 // ref: https://akveo.github.io/react-native-ui-kitten/docs/guides/branding#fonts

const customMapping = {
  "strict": {
    "text-font-family": "'Noto Sans KR', sans-serif"
  },
  components: {},
  version: 1
};
const ApplicationThemeProvider = ({
  children
}) => {
  const [appOptions] = Object(_options__WEBPACK_IMPORTED_MODULE_4__["useAppOptions"])();
  const {
    theme,
    palette
  } = appOptions;
  const currentTheme = palette && theme && palette[theme] || _eva_design_eva__WEBPACK_IMPORTED_MODULE_3__["light"] || _eva_design_eva__WEBPACK_IMPORTED_MODULE_3__["dark"];
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_ui_kitten_components__WEBPACK_IMPORTED_MODULE_1__["IconRegistry"], {
    icons: _ui_kitten_eva_icons__WEBPACK_IMPORTED_MODULE_2__["EvaIconsPack"],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 27
    },
    __self: undefined
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_ui_kitten_components__WEBPACK_IMPORTED_MODULE_1__["ApplicationProvider"], {
    mapping: _eva_design_eva__WEBPACK_IMPORTED_MODULE_3__["mapping"],
    customMapping: customMapping,
    theme: currentTheme,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 28
    },
    __self: undefined
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_ui_kitten_components__WEBPACK_IMPORTED_MODULE_1__["Layout"], {
    nativeID: "theme-container",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 33
    },
    __self: undefined
  }, children)));
};
/*
// to fix mobile browser 100vh mis-calculation
if (typeof window !== "undefined") {
  const fullHeightElems = window.document.querySelectorAll("#root, #theme-container, #nav-container");
  const setDocHeight = () => {
    const fullHeight = `${window.innerHeight}px`;
    fullHeightElems.forEach(elem => {
      (elem as any).style.height = fullHeight;
    });
  };

  setDocHeight();
  window.addEventListener("resize", _.throttle(setDocHeight, 500));
  window.addEventListener("orientationchange", setDocHeight);
}
*/

/***/ }),

/***/ "./src/assets/logo.svg":
/*!*****************************!*\
  !*** ./src/assets/logo.svg ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/media/logo.060b0e6c.svg";

/***/ }),

/***/ "./src/assets/screen_sent.svg":
/*!************************************!*\
  !*** ./src/assets/screen_sent.svg ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/media/screen_sent.1ae0604c.svg";

/***/ }),

/***/ "./src/assets/screen_verify.svg":
/*!**************************************!*\
  !*** ./src/assets/screen_verify.svg ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/media/screen_verify.465fe378.svg";

/***/ }),

/***/ "./src/hook.ts":
/*!*********************!*\
  !*** ./src/hook.ts ***!
  \*********************/
/*! exports provided: useNavigation, useAppState, useAppOptions, useWithLoading, useClose */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "useWithLoading", function() { return useWithLoading; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "useClose", function() { return useClose; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app */ "./src/app/index.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "useNavigation", function() { return _app__WEBPACK_IMPORTED_MODULE_1__["useNavigation"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "useAppState", function() { return _app__WEBPACK_IMPORTED_MODULE_1__["useAppState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "useAppOptions", function() { return _app__WEBPACK_IMPORTED_MODULE_1__["useAppOptions"]; });



 // do async job with loading state

function useWithLoading() {
  const [loading, setLoading] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(false);
  const [errors, setErrors] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])({});
  const unmounted = Object(react__WEBPACK_IMPORTED_MODULE_0__["useRef"])(false);
  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(() => {
    return () => {
      unmounted.current = true;
    };
  }, []);

  const withLoading = (callback, deps = []) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [callbackLoading, setCallbackLoading] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(false); // eslint-disable-next-line react-hooks/rules-of-hooks, react-hooks/exhaustive-deps

    const callWithLoading = Object(react__WEBPACK_IMPORTED_MODULE_0__["useCallback"])((...args) => {
      if (loading) return;
      setLoading(true);
      setCallbackLoading(true);
      setTimeout(async () => {
        try {
          await callback(...args);
        } catch (error) {
          console.error("global error from withLoading callback", error);
          setErrors({
            global: error.message || error.toString()
          });
        } finally {
          setTimeout(() => {
            if (!unmounted.current) {
              setLoading(false);
              setCallbackLoading(false);
            }
          }, 100);
        }
      }, 100);
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [callback, ...deps]);
    return [callWithLoading, callbackLoading];
  };

  return {
    withLoading,
    loading,
    errors,
    setErrors
  };
} // close screen

function useClose(tryGoBack = true) {
  const [closed, setClosed] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(false);
  const {
    nav
  } = Object(_app__WEBPACK_IMPORTED_MODULE_1__["useNavigation"])();
  const close = Object(react__WEBPACK_IMPORTED_MODULE_0__["useCallback"])(() => {
    if (tryGoBack && nav.canGoBack()) {
      nav.goBack();
    } else {
      window.close();
      setTimeout(() => setClosed(true), 500);
    }
  }, [nav, tryGoBack]);
  return {
    closed,
    setClosed,
    close
  };
}

/***/ }),

/***/ "./src/index.tsx":
/*!***********************!*\
  !*** ./src/index.tsx ***!
  \***********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "../../node_modules/react-dom/index.js");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _service_worker__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./service-worker */ "./src/service-worker.ts");
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app */ "./src/app/index.ts");
var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/src/index.tsx";




react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_app__WEBPACK_IMPORTED_MODULE_3__["App"], {
  __source: {
    fileName: _jsxFileName,
    lineNumber: 6
  },
  __self: undefined
}), document.getElementById("root")); // If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

_service_worker__WEBPACK_IMPORTED_MODULE_2__["unregister"]();

/***/ }),

/***/ "./src/screen/component/form.tsx":
/*!***************************************!*\
  !*** ./src/screen/component/form.tsx ***!
  \***************************************/
/*! exports provided: Form, FormInput, FormDatePicker, FormSelect */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Form", function() { return Form; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FormInput", function() { return FormInput; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FormDatePicker", function() { return FormDatePicker; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FormSelect", function() { return FormSelect; });
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! moment */ "../../node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "../../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./index */ "./src/screen/component/index.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./util */ "./src/screen/component/util.ts");
var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/src/screen/component/form.tsx";




const Form = ({
  onSubmit,
  children
}) => {
  return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement("form", {
    noValidate: true,
    onSubmit: e => {
      e.preventDefault();

      if (onSubmit) {
        onSubmit();
      }
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 18
    },
    __self: undefined
  }, children);
};
const FormInput = props => {
  const {
    value,
    error,
    setValue,
    tabIndex,
    autoCompleteType,
    onEnter,
    autoFocus,
    secureTextEntry,
    ...restProps
  } = props;
  const [passwordVisible, setPasswordVisible] = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])(false);
  return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_index__WEBPACK_IMPORTED_MODULE_2__["Input"], Object.assign({
    ref: Object(_util__WEBPACK_IMPORTED_MODULE_3__["withAttrs"])({
      tabindex: tabIndex || null,
      autofocus: autoFocus ? "autofocus" : null
    }, "input") // default
    ,
    size: "large",
    autoCompleteType: autoCompleteType,
    autoCapitalize: "none",
    keyboardType: "default",
    returnKeyType: "next",
    autoCorrect: false,
    autoFocus: autoFocus,
    blurOnSubmit: typeof onEnter !== "function",
    clearButtonMode: "while-editing",
    label: "",
    placeholder: "",
    secureTextEntry: secureTextEntry && !passwordVisible,
    value: value,
    onChangeText: setValue ? v => setValue(v || "") : undefined,
    onKeyPress: typeof onEnter === "function" ? e => e.nativeEvent.key === "Enter" && onEnter() : restProps.onKeyPress,
    icon: secureTextEntry ? style => react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_index__WEBPACK_IMPORTED_MODULE_2__["Icon"], {
      style: { ...style,
        ...{
          cursor: "pointer"
        }
      },
      name: passwordVisible ? 'eye' : 'eye-off',
      __source: {
        fileName: _jsxFileName,
        lineNumber: 57
      },
      __self: undefined
    }) : undefined,
    onIconPress: secureTextEntry ? () => setPasswordVisible(!passwordVisible) : undefined // custom

  }, restProps, {
    // override
    caption: error || restProps.caption,
    status: error ? "danger" : restProps.status || "basic",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 38
    },
    __self: undefined
  }));
};
const FormDatePicker = props => {
  const {
    value,
    setValue,
    error,
    tabIndex,
    format = "YYYY-MM-DD",
    ...restProps
  } = props;
  const pickerRef = Object(react__WEBPACK_IMPORTED_MODULE_1__["useRef"])();
  return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_index__WEBPACK_IMPORTED_MODULE_2__["Datepicker"], Object.assign({
    ref: ref => {
      Object(_util__WEBPACK_IMPORTED_MODULE_3__["withAttrs"])({
        tabindex: tabIndex || null
      }, "[data-focusable=true]")(ref);
      pickerRef.current = ref;
    },
    onFocus: () => {
      if (!value && setValue) {
        console.log("set value..");
        setValue(moment__WEBPACK_IMPORTED_MODULE_0___default()().subtract(20, "y").format(format));
      }

      if (pickerRef.current && !pickerRef.current.state.visible) {
        pickerRef.current.setPickerVisible();
      }
    },
    label: "",
    placeholder: "",
    size: "large",
    min: moment__WEBPACK_IMPORTED_MODULE_0___default()().subtract(100, "y").toDate(),
    max: moment__WEBPACK_IMPORTED_MODULE_0___default()().toDate(),
    date: value ? moment__WEBPACK_IMPORTED_MODULE_0___default()(value).toDate() : undefined,
    onSelect: v => {
      if (setValue) {
        setValue(moment__WEBPACK_IMPORTED_MODULE_0___default()(v).format(format));
      }

      if (pickerRef.current && pickerRef.current.state.visible) {
        pickerRef.current.setPickerInvisible();
      }
    },
    icon: s => react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_index__WEBPACK_IMPORTED_MODULE_2__["Icon"], {
      style: s,
      name: "calendar",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 111
      },
      __self: undefined
    }) // custom

  }, restProps, {
    // override
    caption: error || restProps.caption,
    status: error ? "danger" : restProps.status || "basic",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 82
    },
    __self: undefined
  }));
};
const FormSelect = props => {
  const {
    value,
    setValue,
    error,
    data = [],
    tabIndex,
    caption,
    ...restProps
  } = props;
  const selectRef = Object(react__WEBPACK_IMPORTED_MODULE_1__["useRef"])();
  return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_1___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_index__WEBPACK_IMPORTED_MODULE_2__["Select"], Object.assign({
    ref: ref => {
      Object(_util__WEBPACK_IMPORTED_MODULE_3__["withAttrs"])({
        tabindex: tabIndex || null
      }, "[data-focusable=true]")(ref);
      selectRef.current = ref;
    },
    onFocus: () => {
      console.log(selectRef.current, !selectRef.current.state.optionsVisible);

      if (selectRef.current && !selectRef.current.state.optionsVisible) {
        selectRef.current.setOptionsListVisible();
      }
    },
    onBlur: () => {
      if (selectRef.current && selectRef.current.state.optionsVisible) {
        selectRef.current.setOptionsListInvisible();
      }
    },
    label: "",
    placeholder: "",
    size: "large",
    data: data,
    selectedOption: data.find(d => d.value === value),
    onSelect: v => setValue ? props.setValue(v.value) : undefined // custom

  }, restProps, {
    // override
    status: error ? "danger" : restProps.status || "basic",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 138
    },
    __self: undefined
  })), error || caption ? react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_index__WEBPACK_IMPORTED_MODULE_2__["Text"], {
    category: "c1",
    status: error ? "danger" : restProps.status || "basic",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 169
    },
    __self: undefined
  }, error || caption) : null);
};

/***/ }),

/***/ "./src/screen/component/index.ts":
/*!***************************************!*\
  !*** ./src/screen/component/index.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ui_kitten_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ui-kitten/components */ "../../node_modules/@ui-kitten/components/index.js");
/* harmony import */ var _ui_kitten_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_ui_kitten_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _ui_kitten_components__WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _ui_kitten_components__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util */ "./src/screen/component/util.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "withElements", function() { return _util__WEBPACK_IMPORTED_MODULE_1__["withElements"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "withElement", function() { return _util__WEBPACK_IMPORTED_MODULE_1__["withElement"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "withAttrs", function() { return _util__WEBPACK_IMPORTED_MODULE_1__["withAttrs"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "activateAutoFocus", function() { return _util__WEBPACK_IMPORTED_MODULE_1__["activateAutoFocus"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "isTouchDevice", function() { return _util__WEBPACK_IMPORTED_MODULE_1__["isTouchDevice"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "useThemePalette", function() { return _util__WEBPACK_IMPORTED_MODULE_1__["useThemePalette"]; });

/* harmony import */ var _separator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./separator */ "./src/screen/component/separator.tsx");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Separator", function() { return _separator__WEBPACK_IMPORTED_MODULE_2__["Separator"]; });

/* harmony import */ var _form__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./form */ "./src/screen/component/form.tsx");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Form", function() { return _form__WEBPACK_IMPORTED_MODULE_3__["Form"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FormInput", function() { return _form__WEBPACK_IMPORTED_MODULE_3__["FormInput"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FormDatePicker", function() { return _form__WEBPACK_IMPORTED_MODULE_3__["FormDatePicker"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FormSelect", function() { return _form__WEBPACK_IMPORTED_MODULE_3__["FormSelect"]; });

/* harmony import */ var _persona__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./persona */ "./src/screen/component/persona.tsx");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Persona", function() { return _persona__WEBPACK_IMPORTED_MODULE_4__["Persona"]; });

/* harmony import */ var _layout__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./layout */ "./src/screen/component/layout.tsx");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ScreenLayout", function() { return _layout__WEBPACK_IMPORTED_MODULE_5__["ScreenLayout"]; });








/***/ }),

/***/ "./src/screen/component/layout.tsx":
/*!*****************************************!*\
  !*** ./src/screen/component/layout.tsx ***!
  \*****************************************/
/*! exports provided: ScreenLayout */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ScreenLayout", function() { return ScreenLayout; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_native__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-native */ "../../node_modules/react-native-web/dist/index.js");
/* harmony import */ var _hook__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../hook */ "./src/hook.ts");
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./index */ "./src/screen/component/index.ts");
/* harmony import */ var _assets_logo_svg__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../assets/logo.svg */ "./src/assets/logo.svg");
/* harmony import */ var _assets_logo_svg__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_assets_logo_svg__WEBPACK_IMPORTED_MODULE_4__);
var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/src/screen/component/layout.tsx";






/*
<View
  style={{
    top: 0, right: 0, zIndex: 1000, alignItems: "flex-end", flex: 0,
    ...({
      position: "sticky",
      transition: "opacity 1s",
      opacity: loading ? 0.3 : 0,
    } as unknown as ViewStyle)
  }}>
  <View style={{margin: 20}}>
    <Spinner size={"tiny"} status={"primary"} />
  </View>
</View>
*/
const ScreenLayout = ({
  title = "undefined",
  subtitle = null,
  loading = false,
  children = null,
  buttons = [],
  error = null,
  footer = null
}) => {
  const {
    nav
  } = Object(_hook__WEBPACK_IMPORTED_MODULE_2__["useNavigation"])();
  const scrollableRef = Object(react__WEBPACK_IMPORTED_MODULE_0__["useRef"])(null);
  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(() => {
    if (_index__WEBPACK_IMPORTED_MODULE_3__["isTouchDevice"]) return;
    return nav.addListener("focus", () => {
      if (scrollableRef.current) {
        const node = scrollableRef.current.getInnerViewNode();
        setTimeout(() => {
          Object(_index__WEBPACK_IMPORTED_MODULE_3__["activateAutoFocus"])(node);
        }, 300); // delay for transition animation
      }
    });
  }, [nav]);
  const [options] = Object(_hook__WEBPACK_IMPORTED_MODULE_2__["useAppOptions"])();
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_native__WEBPACK_IMPORTED_MODULE_1__["ScrollView"], {
    ref: ref => {
      scrollableRef.current = ref;
    },
    style: {
      width: "100%"
    },
    contentContainerStyle: {
      width: "100%",
      marginVertical: "auto",
      padding: 30
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 65
    },
    __self: undefined
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_native__WEBPACK_IMPORTED_MODULE_1__["View"], {
    style: {
      alignItems: options.logo.align,
      marginBottom: 20
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 70
    },
    __self: undefined
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_native__WEBPACK_IMPORTED_MODULE_1__["Image"], {
    source: {
      uri: options.logo.uri || _assets_logo_svg__WEBPACK_IMPORTED_MODULE_4___default.a
    },
    style: {
      height: options.logo.height,
      width: options.logo.width,
      resizeMode: "contain"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 71
    },
    __self: undefined
  })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_native__WEBPACK_IMPORTED_MODULE_1__["View"], {
    style: {
      marginBottom: 30
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 74
    },
    __self: undefined
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_index__WEBPACK_IMPORTED_MODULE_3__["Text"], {
    category: "h5",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 75
    },
    __self: undefined
  }, title), subtitle && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_index__WEBPACK_IMPORTED_MODULE_3__["Text"], {
    category: "s2",
    style: {
      marginTop: 5
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 76
    },
    __self: undefined
  }, subtitle)), children ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_native__WEBPACK_IMPORTED_MODULE_1__["View"], {
    style: {
      marginBottom: 30
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 79
    },
    __self: undefined
  }, children) : null, error ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_index__WEBPACK_IMPORTED_MODULE_3__["Text"], {
    status: "danger",
    category: "c2",
    style: {
      marginBottom: 15
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 81
    },
    __self: undefined
  }, error) : null, buttons.length > 0 ? buttons.map((args, index) => {
    if (args.hidden === true) {
      return null;
    } // render separator


    const s = args;

    if (s.separator) {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_index__WEBPACK_IMPORTED_MODULE_3__["Separator"], {
        key: index,
        text: typeof s.separator === "string" ? s.separator : undefined,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 93
        },
        __self: undefined
      });
    } // render button groups


    const g = args;

    if (g.group) {
      // tslint:disable-next-line:no-shadowed-variable
      const {
        group,
        loading,
        ...groupProps
      } = g;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_native__WEBPACK_IMPORTED_MODULE_1__["View"], {
        key: index,
        style: {
          marginBottom: 15
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 106
        },
        __self: undefined
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_index__WEBPACK_IMPORTED_MODULE_3__["ButtonGroup"] // default
      , Object.assign({
        status: "basic",
        size: "large",
        appearance: "filled" // custom

      }, groupProps, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 110
        },
        __self: undefined
      }), g.group.map((btn, key) => {
        // tslint:disable-next-line:no-shadowed-variable
        const {
          hidden,
          tabIndex,
          loading,
          ...props
        } = btn;
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_index__WEBPACK_IMPORTED_MODULE_3__["Button"], Object.assign({
          ref: Object(_index__WEBPACK_IMPORTED_MODULE_3__["withAttrs"])({
            tabindex: tabIndex || null
          }),
          key: key // default
          ,
          status: "basic",
          size: "large",
          style: {
            flexGrow: 1,
            flexShrink: 1
          },
          textStyle: {
            textAlign: "center"
          } // custom

        }, props, {
          // override
          appearance: g.loading || btn.loading ? "outline" : props.appearance || "filled",
          onPress: loading ? undefined : props.onPress,
          onPressOut: loading ? undefined : props.onPressOut,
          onPressIn: loading ? undefined : props.onPressIn,
          onLongPress: loading ? undefined : props.onLongPress,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 123
          },
          __self: undefined
        }));
      })));
    } // render button
    // tslint:disable-next-line:no-shadowed-variable


    const {
      hidden,
      tabIndex,
      loading,
      ...props
    } = args;
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_native__WEBPACK_IMPORTED_MODULE_1__["View"], {
      key: index,
      style: {
        marginBottom: 15
      },
      __source: {
        fileName: _jsxFileName,
        lineNumber: 154
      },
      __self: undefined
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_index__WEBPACK_IMPORTED_MODULE_3__["Button"], Object.assign({
      ref: Object(_index__WEBPACK_IMPORTED_MODULE_3__["withAttrs"])({
        tabindex: tabIndex || null
      }) // default
      ,
      status: "basic",
      size: "large" // custom

    }, props, {
      // override
      appearance: loading ? "outline" : props.appearance || "filled",
      onPress: loading ? undefined : props.onPress,
      onPressOut: loading ? undefined : props.onPressOut,
      onPressIn: loading ? undefined : props.onPressIn,
      onLongPress: loading ? undefined : props.onLongPress,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 158
      },
      __self: undefined
    })));
  }) : null, footer);
};

/***/ }),

/***/ "./src/screen/component/persona.tsx":
/*!******************************************!*\
  !*** ./src/screen/component/persona.tsx ***!
  \******************************************/
/*! exports provided: Persona */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Persona", function() { return Persona; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_native__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-native */ "../../node_modules/react-native-web/dist/index.js");
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./index */ "./src/screen/component/index.ts");
var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/src/screen/component/persona.tsx";



const Persona = ({
  name = "?",
  email = "?",
  picture,
  style
}) => {
  const size = 50;
  const palette = Object(_index__WEBPACK_IMPORTED_MODULE_2__["useThemePalette"])();
  const [pictureVisible, setPictureVisible] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(!!picture);
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_native__WEBPACK_IMPORTED_MODULE_1__["View"], {
    style: style,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 17
    },
    __self: undefined
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_native__WEBPACK_IMPORTED_MODULE_1__["View"], {
    style: {
      flexDirection: "row"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 18
    },
    __self: undefined
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_native__WEBPACK_IMPORTED_MODULE_1__["View"], {
    style: {
      width: size,
      height: size,
      flexBasis: size,
      flexShrink: 0,
      marginRight: 15,
      alignSelf: "center",
      position: "relative"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 21
    },
    __self: undefined
  }, pictureVisible ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_index__WEBPACK_IMPORTED_MODULE_2__["Avatar"], {
    source: {
      uri: picture
    },
    onError: err => setPictureVisible(false),
    style: {
      width: size + 2,
      height: size + 2,
      resizeMode: "stretch",
      backgroundColor: palette["background-basic-color-2"]
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 31
    },
    __self: undefined
  }) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_native__WEBPACK_IMPORTED_MODULE_1__["View"], {
    style: {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: palette["background-basic-color-2"],
      justifyContent: "center",
      alignItems: "center"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 42
    },
    __self: undefined
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_index__WEBPACK_IMPORTED_MODULE_2__["Text"], {
    style: {
      textAlign: "center",
      marginTop: -size / 10,
      color: palette["text-hint-color"]
    },
    children: name[0] || "?",
    category: "h4",
    appearance: "alternative",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 50
    },
    __self: undefined
  }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_native__WEBPACK_IMPORTED_MODULE_1__["View"], {
    style: {
      justifyContent: "center",
      flexDirection: "column",
      flexGrow: 1,
      flexShrink: 1
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 62
    },
    __self: undefined
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_index__WEBPACK_IMPORTED_MODULE_2__["Text"], {
    category: "h6",
    style: {
      marginBottom: 2
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 68
    },
    __self: undefined
  }, name), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_index__WEBPACK_IMPORTED_MODULE_2__["Text"], {
    category: "p2",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 69
    },
    __self: undefined
  }, email))));
};

/***/ }),

/***/ "./src/screen/component/separator.tsx":
/*!********************************************!*\
  !*** ./src/screen/component/separator.tsx ***!
  \********************************************/
/*! exports provided: Separator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Separator", function() { return Separator; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_native__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-native */ "../../node_modules/react-native-web/dist/index.js");
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./index */ "./src/screen/component/index.ts");
var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/src/screen/component/separator.tsx";



const Separator = ({
  text,
  marginTop = 10,
  marginBottom = 20
}) => {
  const palette = Object(_index__WEBPACK_IMPORTED_MODULE_2__["useThemePalette"])();
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_native__WEBPACK_IMPORTED_MODULE_1__["View"], {
    style: {
      position: "relative",
      marginTop,
      marginBottom
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 9
    },
    __self: undefined
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_native__WEBPACK_IMPORTED_MODULE_1__["View"], {
    style: {
      borderTopWidth: 1,
      borderTopColor: palette["text-disabled-color"],
      position: "absolute",
      top: "50%",
      width: "100%",
      left: "0%",
      height: 1
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 10
    },
    __self: undefined
  }), text ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_native__WEBPACK_IMPORTED_MODULE_1__["View"], {
    style: {
      flexDirection: "row"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 12
    },
    __self: undefined
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_native__WEBPACK_IMPORTED_MODULE_1__["View"], {
    style: {
      flexGrow: 1
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 13
    },
    __self: undefined
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_index__WEBPACK_IMPORTED_MODULE_2__["Text"], {
    category: "c1",
    appearance: "hint",
    style: {
      textAlign: "center",
      flexGrow: 0,
      paddingLeft: 10,
      paddingRight: 10,
      backgroundColor: palette["background-basic-color-1"]
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 14
    },
    __self: undefined
  }, text), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_native__WEBPACK_IMPORTED_MODULE_1__["View"], {
    style: {
      flexGrow: 1
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 17
    },
    __self: undefined
  })) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_index__WEBPACK_IMPORTED_MODULE_2__["Text"], {
    category: "c1",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 20
    },
    __self: undefined
  }, " "));
};

/***/ }),

/***/ "./src/screen/component/util.ts":
/*!**************************************!*\
  !*** ./src/screen/component/util.ts ***!
  \**************************************/
/*! exports provided: withElements, withElement, withAttrs, activateAutoFocus, isTouchDevice, useThemePalette */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "withElements", function() { return withElements; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "withElement", function() { return withElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "withAttrs", function() { return withAttrs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "activateAutoFocus", function() { return activateAutoFocus; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isTouchDevice", function() { return isTouchDevice; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "useThemePalette", function() { return useThemePalette; });
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-dom */ "../../node_modules/react-dom/index.js");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _ui_kitten_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ui-kitten/components */ "../../node_modules/@ui-kitten/components/index.js");
/* harmony import */ var _ui_kitten_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_ui_kitten_components__WEBPACK_IMPORTED_MODULE_1__);



/* for DOM manipulation */
function withElements(callback, selector) {
  return ref => {
    const node = react_dom__WEBPACK_IMPORTED_MODULE_0___default.a.findDOMNode(ref);
    if (!node) return;

    if (typeof node === "object") {
      callback(Array.prototype.slice.call(node.querySelectorAll(selector)));
      return;
    }
  };
}
function withElement(callback, selector, ignoreNotFound = false) {
  return ref => {
    const node = react_dom__WEBPACK_IMPORTED_MODULE_0___default.a.findDOMNode(ref);
    if (!node) return;
    let found = null;

    if (typeof node === "object") {
      found = node;

      if (selector) {
        found = found.querySelector(selector);
      }
    }

    if (!found) {
      if (!ignoreNotFound) {
        console.warn("cannot find element with", selector, ref);
      }

      return;
    }

    callback(found);
  };
}
function withAttrs(attrs = {}, selector, ignoreNotFound = false) {
  return withElement(elem => {
    for (const [k, v] of Object.entries(attrs)) {
      if (typeof v === "string") {
        elem.setAttribute(k, v);
      } else if (typeof v === "number") {
        elem.setAttribute(k, v.toString());
      } else if (typeof v === "boolean") {
        elem.setAttribute(k, v ? "true" : "false");
      } else {
        elem.removeAttribute(k);
      }
    }
  }, selector, ignoreNotFound);
} // workaround to make autofocus works

function activateAutoFocus(ref) {
  withElements(elems => {
    elems.find(elem => {
      if (!elem.focus) {
        return false;
      }

      if (elem.offsetParent === null) {
        // check visibility
        console.debug("autofocus DOM element focus failed", elem);
        return false;
      }

      elem.focus(); // console.debug("autofocus DOM element focused", elem);

      return true;
    });
  }, "[autofocus]")(ref);
}
const isTouchDevice = (() => {
  if ("ontouchstart" in window || window.DocumentTouch && document instanceof window.DocumentTouch) {
    return true;
  }

  const prefixes = " -webkit- -moz- -o- -ms- ".split(" ");
  const query = ["(", prefixes.join("touch-enabled),("), "heartz", ")"].join("");
  return window.matchMedia && window.matchMedia(query).matches;
})();
/* for typing */

function useThemePalette() {
  return Object(_ui_kitten_components__WEBPACK_IMPORTED_MODULE_1__["useTheme"])();
}

/***/ }),

/***/ "./src/screen/consent.tsx":
/*!********************************!*\
  !*** ./src/screen/consent.tsx ***!
  \********************************/
/*! exports provided: ConsentScreen */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ConsentScreen", function() { return ConsentScreen; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _hook__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../hook */ "./src/hook.ts");
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./component */ "./src/screen/component/index.ts");
var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/src/screen/consent.tsx";



const ConsentScreen = () => {
  // states
  const {
    loading,
    withLoading,
    errors,
    setErrors
  } = Object(_hook__WEBPACK_IMPORTED_MODULE_1__["useWithLoading"])();
  const {
    nav
  } = Object(_hook__WEBPACK_IMPORTED_MODULE_1__["useNavigation"])();
  const [state, dispatch] = Object(_hook__WEBPACK_IMPORTED_MODULE_1__["useAppState"])(); // handlers

  const [handleAccept, handleAcceptLoading] = withLoading(() => {
    return dispatch("consent.accept").then(() => setErrors({})).catch(err => setErrors(err));
  }); // const handleReject = withLoading(() => {
  //   setErrors({});
  //   return request("consent.reject")
  //     .catch((err: any) => setErrors(err));
  // });

  const [handleChangeAccount, handleChangeAccountLoading] = withLoading(() => {
    // return request("consent.change_account")
    //   .catch((err: any) => setErrors(err));
    nav.navigate("login.stack", {
      screen: "login.index"
    });
    setErrors({});
  });
  const user = state.user;
  const client = state.client;
  const scopes = state.interaction.prompt.details.scopes; // render

  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_2__["ScreenLayout"], {
    title: client.client_name,
    subtitle: "Authorization consent required",
    loading: loading,
    error: errors.global,
    buttons: [{
      status: "primary",
      children: "Continue",
      onPress: handleAccept,
      loading: handleAcceptLoading,
      tabIndex: 1
    }, // {
    //   children: "Cancel",
    //   onPress: handleReject,
    //   loading,
    //   tabIndex: 2,
    // },
    {
      size: "medium",
      group: [{
        children: "Privacy policy",
        onPress: () => window.open(client.policy_uri, "_blank"),
        disabled: !client.policy_uri,
        tabIndex: 4
      }, {
        children: "Terms of service",
        onPress: () => window.open(client.tos_uri, "_blank"),
        disabled: !client.tos_uri,
        tabIndex: 5
      }]
    }, {
      separator: "OR"
    }, {
      appearance: "ghost",
      size: "small",
      children: "Continue with other account",
      onPress: handleChangeAccount,
      loading: handleChangeAccountLoading,
      tabIndex: 3
    }, ...(client.client_uri ? [{
      appearance: "ghost",
      size: "small",
      children: "Visit service homepage",
      onPress: () => window.open(client.client_uri, "_blank"),
      disabled: !client.client_uri,
      tabIndex: 6
    }] : [])],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 39
    },
    __self: undefined
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_2__["Persona"], Object.assign({}, user, {
    style: {
      marginBottom: 30
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 99
    },
    __self: undefined
  })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_2__["Text"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 100
    },
    __self: undefined
  }, scopes.new.concat(scopes.accepted).join(", "), " permissions are required."));
};

/***/ }),

/***/ "./src/screen/error.tsx":
/*!******************************!*\
  !*** ./src/screen/error.tsx ***!
  \******************************/
/*! exports provided: ErrorScreen, ClientErrorScreen */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ErrorScreen", function() { return ErrorScreen; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ClientErrorScreen", function() { return ClientErrorScreen; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _component_layout__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./component/layout */ "./src/screen/component/layout.tsx");
/* harmony import */ var _hook__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../hook */ "./src/hook.ts");
var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/src/screen/error.tsx";



const ErrorScreen = () => {
  const [state] = Object(_hook__WEBPACK_IMPORTED_MODULE_2__["useAppState"])();
  const error = state.error || {
    error: "unexpected_server_error",
    error_description: "unrecognized state received from server."
  };
  const {
    closed,
    close
  } = Object(_hook__WEBPACK_IMPORTED_MODULE_2__["useClose"])();
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component_layout__WEBPACK_IMPORTED_MODULE_1__["ScreenLayout"], {
    title: error.error.split("_").map(w => w[0].toUpperCase() + w.substr(1)).join(" "),
    subtitle: error.error_description,
    error: closed ? "Please close the window manually." : undefined,
    loading: closed,
    buttons: [{
      children: "Close",
      tabIndex: 1,
      onPress: close
    }],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 10
    },
    __self: undefined
  });
};
const ClientErrorScreen = props => {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component_layout__WEBPACK_IMPORTED_MODULE_1__["ScreenLayout"], {
    title: props.error.name,
    subtitle: props.error.message,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 28
    },
    __self: undefined
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("pre", {
    style: {
      fontSize: "0.8em",
      color: "gray",
      wordBreak: "break-all",
      whiteSpace: "pre-wrap"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 32
    },
    __self: undefined
  }, props.error.stack));
};

/***/ }),

/***/ "./src/screen/find_email.end.tsx":
/*!***************************************!*\
  !*** ./src/screen/find_email.end.tsx ***!
  \***************************************/
/*! exports provided: FindEmailEndScreen */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FindEmailEndScreen", function() { return FindEmailEndScreen; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _hook__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../hook */ "./src/hook.ts");
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./component */ "./src/screen/component/index.ts");
var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/src/screen/find_email.end.tsx";



const FindEmailEndScreen = () => {
  // states
  const [state] = Object(_hook__WEBPACK_IMPORTED_MODULE_1__["useAppState"])(); // handlers

  const {
    nav
  } = Object(_hook__WEBPACK_IMPORTED_MODULE_1__["useNavigation"])();
  const {
    loading,
    withLoading
  } = Object(_hook__WEBPACK_IMPORTED_MODULE_1__["useWithLoading"])();
  const [handleLogin, handleLoginLoading] = withLoading(() => {
    nav.navigate("login.stack", {
      screen: "login.index",
      params: {
        email: state.session.findEmail.user.email
      }
    });
  }, [state]);
  const {
    closed,
    close
  } = Object(_hook__WEBPACK_IMPORTED_MODULE_1__["useClose"])(false); // render

  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_2__["ScreenLayout"], {
    title: `Find your account`,
    subtitle: `With mobile phone`,
    loading: loading || closed,
    error: closed ? "Please close the window manually." : undefined,
    buttons: [{
      hidden: !state.routes.login,
      status: "primary",
      children: "Sign in",
      tabIndex: 210,
      onPress: handleLogin,
      loading: handleLoginLoading
    }, {
      hidden: !!state.routes.login,
      tabIndex: 211,
      children: "Close",
      onPress: close,
      loading: closed
    }],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 25
    },
    __self: undefined
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_2__["Persona"], Object.assign({}, state.session.findEmail.user, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 48
    },
    __self: undefined
  })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_2__["Text"], {
    style: {
      marginTop: 30
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 49
    },
    __self: undefined
  }, "Found your account."));
};

/***/ }),

/***/ "./src/screen/find_email.index.tsx":
/*!*****************************************!*\
  !*** ./src/screen/find_email.index.tsx ***!
  \*****************************************/
/*! exports provided: FindEmailIndexScreen */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FindEmailIndexScreen", function() { return FindEmailIndexScreen; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _hook__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../hook */ "./src/hook.ts");
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./component */ "./src/screen/component/index.ts");
var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/src/screen/find_email.index.tsx";



const FindEmailIndexScreen = () => {
  const {
    nav
  } = Object(_hook__WEBPACK_IMPORTED_MODULE_1__["useNavigation"])();
  const [state, dispatch] = Object(_hook__WEBPACK_IMPORTED_MODULE_1__["useAppState"])();
  const [phoneNumber, setPhoneNumber] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(""); // handlers

  const {
    loading,
    errors,
    setErrors,
    withLoading
  } = Object(_hook__WEBPACK_IMPORTED_MODULE_1__["useWithLoading"])();
  const [handleCheckPhoneNumber, handleCheckPhoneNumberLoading] = withLoading(() => {
    dispatch("verify_phone.check_phone", {
      phone_number: `${state.locale.country}|${phoneNumber}`,
      registered: true
    }).then(() => {
      setErrors({});
      nav.navigate("verify_phone.stack", {
        screen: "verify_phone.verify",
        params: {
          callback: "find_email"
        }
      });
    }).catch(err => setErrors(err));
  }, [phoneNumber]);
  const [handleCancel, handleCancelLoading] = withLoading(() => {
    nav.navigate("login.stack", {
      screen: "login.index",
      params: {}
    });
    setErrors({});
  }); // render

  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_2__["ScreenLayout"], {
    title: `Find your account`,
    subtitle: `With phone verification`,
    loading: loading,
    buttons: [{
      status: "primary",
      children: "Continue",
      onPress: handleCheckPhoneNumber,
      loading: handleCheckPhoneNumberLoading,
      tabIndex: 22
    }, {
      children: "Cancel",
      onPress: handleCancel,
      loading: handleCancelLoading,
      tabIndex: 23,
      hidden: !state.routes.login
    }],
    error: errors.global,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 39
    },
    __self: undefined
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_2__["Text"], {
    style: {
      marginBottom: 30
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 61
    },
    __self: undefined
  }, "Have you registered a phone number?"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_2__["FormInput"], {
    autoFocus: true,
    tabIndex: 21,
    label: `Phone number`,
    placeholder: `Enter your mobile phone number (${state.locale.country})`,
    blurOnSubmit: false,
    keyboardType: "phone-pad",
    autoCompleteType: "tel",
    value: phoneNumber,
    error: errors.phone_number,
    setValue: setPhoneNumber,
    onEnter: handleCheckPhoneNumber,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 64
    },
    __self: undefined
  }));
};

/***/ }),

/***/ "./src/screen/login.check_password.tsx":
/*!*********************************************!*\
  !*** ./src/screen/login.check_password.tsx ***!
  \*********************************************/
/*! exports provided: LoginCheckPasswordScreen */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoginCheckPasswordScreen", function() { return LoginCheckPasswordScreen; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _hook__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../hook */ "./src/hook.ts");
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./component */ "./src/screen/component/index.ts");
var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/src/screen/login.check_password.tsx";



const LoginCheckPasswordScreen = () => {
  // state
  const [password, setPassword] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])("");
  const [state, dispatch] = Object(_hook__WEBPACK_IMPORTED_MODULE_1__["useAppState"])(); // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const {
    email,
    name,
    picture
  } = state.session.login.user; // handlers

  const {
    nav
  } = Object(_hook__WEBPACK_IMPORTED_MODULE_1__["useNavigation"])();
  const {
    loading,
    errors,
    setErrors,
    withLoading
  } = Object(_hook__WEBPACK_IMPORTED_MODULE_1__["useWithLoading"])();
  const [handleCheckLoginPassword, handleCheckLoginPasswordLoading] = withLoading(async () => {
    return dispatch("login.check_password", {
      email,
      password
    }).catch(err => setErrors(err));
  }, [password]);
  const [handleResetPassword, handleResetPasswordLoading] = withLoading(() => {
    dispatch("verify_email.check_email", {
      email,
      registered: true
    }).then(() => {
      setErrors({});
      nav.navigate("verify_email.stack", {
        screen: "verify_email.verify",
        params: {
          callback: "reset_password"
        }
      });
    }).catch(err => setErrors(err));
  }, []);
  const [handleCancel, handleCancelLoading] = withLoading(() => {
    nav.navigate("login.stack", {
      screen: "login.index",
      params: {
        email,
        change_account: "true"
      }
    });
    setErrors({});
  }, [email]); // render

  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_2__["ScreenLayout"], {
    title: `Hi, ${name}`,
    subtitle: email,
    loading: loading,
    error: errors.global,
    buttons: [{
      status: "primary",
      children: "Sign in",
      onPress: handleCheckLoginPassword,
      loading: handleCheckLoginPasswordLoading,
      tabIndex: 22
    }, {
      children: "Cancel",
      onPress: handleCancel,
      loading: handleCancelLoading,
      tabIndex: 23
    }, {
      separator: "OR"
    }, {
      children: "Forgot password?",
      tabIndex: 24,
      onPress: handleResetPassword,
      loading: handleResetPasswordLoading,
      appearance: "ghost",
      size: "small"
    }],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 51
    },
    __self: undefined
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_2__["Form"], {
    onSubmit: handleCheckLoginPassword,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 83
    },
    __self: undefined
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_2__["FormInput"], {
    autoCompleteType: "username",
    value: email,
    style: {
      display: "none"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 85
    },
    __self: undefined
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_2__["FormInput"], {
    label: "Password",
    tabIndex: 21,
    autoFocus: true,
    secureTextEntry: true,
    autoCompleteType: "password",
    placeholder: "Enter your password",
    value: password,
    setValue: setPassword,
    error: errors.password,
    onEnter: handleCheckLoginPassword,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 90
    },
    __self: undefined
  })));
};

/***/ }),

/***/ "./src/screen/login.index.tsx":
/*!************************************!*\
  !*** ./src/screen/login.index.tsx ***!
  \************************************/
/*! exports provided: LoginIndexScreen */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoginIndexScreen", function() { return LoginIndexScreen; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _hook__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../hook */ "./src/hook.ts");
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./component */ "./src/screen/component/index.ts");
var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/src/screen/login.index.tsx";



const LoginIndexScreen = () => {
  // state
  const {
    nav,
    route
  } = Object(_hook__WEBPACK_IMPORTED_MODULE_1__["useNavigation"])();
  const [email, setEmail] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])("");
  const [state, dispatch] = Object(_hook__WEBPACK_IMPORTED_MODULE_1__["useAppState"])();
  const [options] = Object(_hook__WEBPACK_IMPORTED_MODULE_1__["useAppOptions"])();
  const [federationOptionsVisible, setFederationOptionsVisible] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(options.login.federationOptionsVisible === true);
  const federationProviders = state.metadata.federationProviders; // handlers

  const {
    loading,
    errors,
    setErrors,
    withLoading
  } = Object(_hook__WEBPACK_IMPORTED_MODULE_1__["useWithLoading"])(); // const handleAbort = withLoading(() => {
  //   return dispatch("login.abort")
  //     .catch((err: any) => setErrors(err));
  // });

  const [handleCheckLoginEmail, handleCheckLoginEmailLoading] = withLoading(() => {
    return dispatch("login.check_email", {
      email
    }).then(() => {
      setErrors({});
      nav.navigate("login.stack", {
        screen: "login.check_password",
        params: {
          email
        }
      });
    }).catch(err => setErrors(err));
  }, [email]);
  const [handleFindEmail, handleFindEmailLoading] = withLoading(() => nav.navigate("find_email.stack", {
    screen: "find_email.index"
  }));
  const [handleSignUp, handleSignUpLoading] = withLoading(() => nav.navigate("register.stack", {
    screen: "register.index"
  }));
  const [handleFederation, handleFederationLoading] = withLoading(provider => {
    return dispatch("login.federate", {
      provider
    }).catch(err => setErrors(err));
  });
  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(() => {
    // update email when route params updated
    if (route.params.email && route.params.email !== email) {
      setEmail(route.params.email);
      setErrors({});
    } // submit email if has in URL params
    // if (route.params.email && route.params.change_account !== "true") {
    //   console.debug("automatically continue sign in with:", email);
    //   handleCheckLoginEmail();
    // }
    // re-hide federation options on blur


    return nav.addListener("blur", () => {
      setTimeout(() => setFederationOptionsVisible(false), 500);
    });
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  [nav, route]);
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_2__["ScreenLayout"], {
    title: "Sign In",
    subtitle: state.client.client_name,
    error: errors.global,
    loading: loading,
    buttons: [{
      status: "primary",
      children: "Continue",
      onPress: handleCheckLoginEmail,
      loading: handleCheckLoginEmailLoading,
      tabIndex: 12
    }, {
      children: "Sign up",
      onPress: handleSignUp,
      loading: handleSignUpLoading,
      tabIndex: 13
    }, ...(federationProviders.length > 0 ? [{
      separator: "OR"
    }, ...(federationOptionsVisible ? federationProviders.map((provider, i) => {
      const {
        style,
        textStyle
      } = getFederationStyle(provider);
      return {
        onPress: () => {
          handleFederation(provider);
        },
        loading: handleFederationLoading,
        children: getFederationText(provider),
        tabIndex: 14 + i,
        style,
        textStyle,
        size: "medium"
      };
    }) : [{
      onPress: () => setFederationOptionsVisible(true),
      children: "Find more login options?",
      tabIndex: 14,
      appearance: "ghost",
      size: "small"
    }])] : []), {
      onPress: handleFindEmail,
      loading: handleFindEmailLoading,
      children: "Forgot your email address?",
      appearance: "ghost",
      size: "small"
    }],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 77
    },
    __self: undefined
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_2__["Form"], {
    onSubmit: handleCheckLoginEmail,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 130
    },
    __self: undefined
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_2__["FormInput"], {
    label: "Email",
    keyboardType: "email-address",
    placeholder: "Enter your email address",
    autoCompleteType: "username",
    autoFocus: true,
    value: email,
    setValue: setEmail,
    error: errors.email,
    onEnter: handleCheckLoginEmail,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 131
    },
    __self: undefined
  })));
};
const federationText = {
  google: "Login with Google",
  facebook: "Login with Facebook",
  kakao: "Login with Kakaotalk",
  default: "Login with {provider}"
};
const federationStyle = {
  google: {
    style: {
      backgroundColor: "#f5f5f5",
      borderWidth: 0
    },
    textStyle: {
      color: "#222b45"
    }
  },
  facebook: {
    style: {
      backgroundColor: "#1876f2",
      borderWidth: 0
    },
    textStyle: {
      color: "#ffffff"
    }
  },
  kakao: {
    style: {
      backgroundColor: "#ffdc00",
      borderWidth: 0
    },
    textStyle: {
      color: "#222b45"
    }
  },
  default: {
    style: {
      backgroundColor: "#f5f5f5",
      borderWidth: 0
    },
    textStyle: {
      color: "#222b45"
    }
  }
};

function getFederationText(provider) {
  return federationText[provider] || federationText.default.replace("{provider}", provider.toLocaleUpperCase());
}

function getFederationStyle(provider) {
  return federationStyle[provider] || federationStyle.default;
}

/***/ }),

/***/ "./src/screen/logout.end.tsx":
/*!***********************************!*\
  !*** ./src/screen/logout.end.tsx ***!
  \***********************************/
/*! exports provided: LogoutEndScreen, ActiveSessionList */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LogoutEndScreen", function() { return LogoutEndScreen; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ActiveSessionList", function() { return ActiveSessionList; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _hook__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../hook */ "./src/hook.ts");
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./component */ "./src/screen/component/index.ts");
var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/src/screen/logout.end.tsx";



const LogoutEndScreen = () => {
  // states
  const {
    closed,
    close
  } = Object(_hook__WEBPACK_IMPORTED_MODULE_1__["useClose"])(false);
  const [state] = Object(_hook__WEBPACK_IMPORTED_MODULE_1__["useAppState"])();
  const user = state.user;
  const authorizedClients = state.authorizedClients; // render

  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_2__["ScreenLayout"], {
    title: `Sign out`,
    subtitle: user ? user.email : "Signed out",
    buttons: [{
      children: "Close",
      onPress: close,
      tabIndex: 21
    }],
    loading: closed,
    error: closed ? "Please close the window manually." : undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 15
    },
    __self: undefined
  }, user ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ActiveSessionList, {
    authorizedClients: authorizedClients,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 29
    },
    __self: undefined
  }) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_2__["Text"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 31
    },
    __self: undefined
  }, "Account session not exists."));
};
const ActiveSessionList = ({
  authorizedClients
}) => {
  const palette = Object(_component__WEBPACK_IMPORTED_MODULE_2__["useThemePalette"])();
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, authorizedClients ? react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_2__["Text"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 43
    },
    __self: undefined
  }, "Below sessions are active."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_2__["List"], {
    style: {
      marginTop: 15,
      borderColor: palette["border-basic-color-3"],
      borderWidth: 1
    },
    data: authorizedClients,
    renderItem: ({
      item,
      index
    }) => {
      const uri = item.client_uri || item.policy_uri || item.tos_uri;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_2__["ListItem"], {
        key: index,
        style: {
          paddingLeft: 15,
          paddingRight: 15,
          paddingTop: 15,
          paddingBottom: 15,
          marginBottom: 1
        },
        title: item.client_name,
        description: uri || item.client_id,
        disabled: !uri,
        onPress: uri ? () => window.open(uri) : undefined,
        accessory: uri ? style => react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_2__["Icon"], {
          style: { ...style,
            width: 20
          },
          fill: palette["text-hint-color"],
          name: "external-link-outline",
          __source: {
            fileName: _jsxFileName,
            lineNumber: 57
          },
          __self: undefined
        }) : undefined,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 50
        },
        __self: undefined
      });
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 44
    },
    __self: undefined
  })) : react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_2__["Text"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 64
    },
    __self: undefined
  }, "There are no active sessions."));
};

/***/ }),

/***/ "./src/screen/logout.index.tsx":
/*!*************************************!*\
  !*** ./src/screen/logout.index.tsx ***!
  \*************************************/
/*! exports provided: LogoutIndexScreen */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LogoutIndexScreen", function() { return LogoutIndexScreen; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _hook__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../hook */ "./src/hook.ts");
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./component */ "./src/screen/component/index.ts");
/* harmony import */ var _logout_end__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./logout.end */ "./src/screen/logout.end.tsx");
var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/src/screen/logout.index.tsx";




const LogoutIndexScreen = () => {
  // states
  const {
    loading,
    withLoading,
    errors,
    setErrors
  } = Object(_hook__WEBPACK_IMPORTED_MODULE_1__["useWithLoading"])();
  const [state, dispatch] = Object(_hook__WEBPACK_IMPORTED_MODULE_1__["useAppState"])();
  const [handleSignOutAll, handleSignOutAllLoading] = withLoading(() => {
    return dispatch("logout.confirm").then(() => setErrors({})).catch(err => setErrors(err));
  });
  const [handleRedirect, handleRedirectLoading] = withLoading(() => {
    return dispatch("logout.redirect").then(() => setErrors({})).catch(err => setErrors(err));
  }); // render

  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_2__["ScreenLayout"], {
    title: `Sign out`,
    subtitle: state.user.email,
    loading: loading,
    buttons: [{
      status: "primary",
      children: "Done",
      onPress: handleRedirect,
      loading: handleRedirectLoading,
      tabIndex: 1
    }, {
      children: "Sign out from all",
      onPress: handleSignOutAll,
      loading: handleSignOutAllLoading,
      tabIndex: 2
    }],
    error: errors.global,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 24
    },
    __self: undefined
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_logout_end__WEBPACK_IMPORTED_MODULE_3__["ActiveSessionList"], {
    authorizedClients: state.authorizedClients,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 45
    },
    __self: undefined
  }));
};

/***/ }),

/***/ "./src/screen/register.detail.tsx":
/*!****************************************!*\
  !*** ./src/screen/register.detail.tsx ***!
  \****************************************/
/*! exports provided: RegisterDetailScreen */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RegisterDetailScreen", function() { return RegisterDetailScreen; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./component */ "./src/screen/component/index.ts");
/* harmony import */ var _hook__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../hook */ "./src/hook.ts");
var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/src/screen/register.detail.tsx";



const RegisterDetailScreen = () => {
  // state
  const [state, dispatch] = Object(_hook__WEBPACK_IMPORTED_MODULE_2__["useAppState"])();
  const [options] = Object(_hook__WEBPACK_IMPORTED_MODULE_2__["useAppOptions"])();
  const tmpState = state.session.register || {};
  const tmpClaims = tmpState.claims || {};
  const tmpCreds = tmpState.credentials || {};
  const [payload, setPayload] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])({
    phone_number: tmpClaims.phone_number || "",
    birthdate: tmpClaims.birthdate || "",
    gender: tmpClaims.gender || ""
  });
  const phoneNumberVerified = state.session.verifyPhone && state.session.verifyPhone.phoneNumber === payload.phone_number && state.session.verifyPhone.verified;
  const phoneNumberRequired = state.metadata.mandatoryScopes.includes("phone"); // handlers

  const {
    nav
  } = Object(_hook__WEBPACK_IMPORTED_MODULE_2__["useNavigation"])();
  const {
    loading,
    errors,
    setErrors,
    withLoading
  } = Object(_hook__WEBPACK_IMPORTED_MODULE_2__["useWithLoading"])();
  const [handlePayloadSubmit, handlePayloadSubmitLoading] = withLoading(async () => {
    const {
      phone_number,
      birthdate,
      gender
    } = payload;
    const data = {
      submit: false,
      claims: {
        phone_number: phone_number ? `${state.locale.country}|${phone_number}` : undefined,
        birthdate,
        gender,
        ...tmpClaims
      },
      credentials: tmpCreds,
      scope: ["email", "profile", "birthdate", "gender"].concat(phoneNumberRequired || phone_number ? "phone" : [])
    };
    return dispatch("register.submit", data).then(() => {
      setErrors({}); // verify email

      if (data.claims.phone_number && !options.register.skipPhoneVerification && !phoneNumberVerified) {
        return dispatch("verify_phone.check_phone", {
          phone_number: data.claims.phone_number,
          registered: false
        }).then(() => {
          nav.navigate("verify_phone.stack", {
            screen: "verify_phone.verify",
            params: {
              callback: "register"
            }
          });
        }); // register user
      } else {
        return dispatch("register.submit", { ...data,
          register: true
        }).then(() => {
          nav.navigate("register.stack", {
            screen: "register.end",
            params: {}
          });
        });
      }
    }).catch(errs => setErrors(errs));
  }, [payload]);
  const [handleCancel, handleCancelLoading] = withLoading(() => {
    nav.navigate("register.stack", {
      screen: "register.index",
      params: {}
    });
    setErrors({});
  }, []); // render

  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_1__["ScreenLayout"], {
    title: "Sign up",
    subtitle: tmpClaims.email,
    loading: loading,
    error: errors.global,
    buttons: [{
      status: "primary",
      children: "Continue",
      onPress: handlePayloadSubmit,
      loading: handlePayloadSubmitLoading,
      tabIndex: 64
    }, {
      children: "Cancel",
      onPress: handleCancel,
      loading: handleCancelLoading,
      tabIndex: 65
    }],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 83
    },
    __self: undefined
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_1__["Text"], {
    style: {
      marginBottom: 30
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 104
    },
    __self: undefined
  }, "Please enter the phone number to find the your account for the case of lost."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_1__["Form"], {
    onSubmit: handlePayloadSubmit,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 108
    },
    __self: undefined
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_1__["FormInput"], {
    autoFocus: !payload.phone_number,
    tabIndex: 61,
    label: `Phone number${phoneNumberRequired ? "" : " (optional)"}`,
    placeholder: `Enter your mobile phone number (${state.locale.country})`,
    blurOnSubmit: false,
    keyboardType: "phone-pad",
    autoCompleteType: "tel",
    value: payload.phone_number,
    setValue: v => setPayload(p => ({ ...p,
      phone_number: v
    })),
    error: errors.phone_number,
    onEnter: handlePayloadSubmit,
    icon: phoneNumberVerified ? s => react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_1__["Icon"], {
      name: "checkmark-circle-2-outline",
      style: s,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 121
      },
      __self: undefined
    }) : undefined,
    style: {
      marginBottom: 15
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 109
    },
    __self: undefined
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_1__["FormDatePicker"], {
    tabIndex: 62,
    label: "Birthdate",
    placeholder: "Select your birthdate",
    value: payload.birthdate,
    setValue: v => setPayload(p => ({ ...p,
      birthdate: v
    })),
    error: errors.birthdate,
    style: {
      marginBottom: 15
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 125
    },
    __self: undefined
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_1__["FormSelect"], {
    tabIndex: 63,
    label: "Gender",
    placeholder: "Select your gender",
    data: [{
      value: "male",
      text: "Male"
    }, {
      value: "female",
      text: "Female"
    }, {
      value: "other",
      text: "Other"
    }],
    value: payload.gender,
    setValue: v => setPayload(p => ({ ...p,
      gender: v
    })),
    error: errors.gender,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 135
    },
    __self: undefined
  })));
};

/***/ }),

/***/ "./src/screen/register.end.tsx":
/*!*************************************!*\
  !*** ./src/screen/register.end.tsx ***!
  \*************************************/
/*! exports provided: RegisterEndScreen */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RegisterEndScreen", function() { return RegisterEndScreen; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _hook__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../hook */ "./src/hook.ts");
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./component */ "./src/screen/component/index.ts");
var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/src/screen/register.end.tsx";



const RegisterEndScreen = () => {
  // states
  const [state, dispatch] = Object(_hook__WEBPACK_IMPORTED_MODULE_1__["useAppState"])();
  const user = state.session.registered || {}; // handlers

  const {
    close,
    closed
  } = Object(_hook__WEBPACK_IMPORTED_MODULE_1__["useClose"])(false);
  const {
    loading,
    errors,
    setErrors,
    withLoading
  } = Object(_hook__WEBPACK_IMPORTED_MODULE_1__["useWithLoading"])();
  const [handleSignIn, handleSignInLoading] = withLoading(() => {
    return dispatch("register.login").catch(errs => setErrors(errs));
  }); // render

  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_2__["ScreenLayout"], {
    title: "Signed up",
    loading: loading || closed,
    error: errors.global || (closed ? "Please close the window manually." : undefined),
    buttons: [{
      status: "primary",
      children: "Sign in",
      onPress: handleSignIn,
      loading: handleSignInLoading,
      tabIndex: 91,
      hidden: !state.routes.login
    }, {
      children: "Close",
      onPress: close,
      loading: closed,
      tabIndex: 92
    }],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 20
    },
    __self: undefined
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_2__["Persona"], Object.assign({}, user, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 41
    },
    __self: undefined
  })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_2__["Text"], {
    style: {
      marginTop: 30
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 42
    },
    __self: undefined
  }, "Congratulations! The account has been registered successfully."));
};

/***/ }),

/***/ "./src/screen/register.index.tsx":
/*!***************************************!*\
  !*** ./src/screen/register.index.tsx ***!
  \***************************************/
/*! exports provided: RegisterIndexScreen */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RegisterIndexScreen", function() { return RegisterIndexScreen; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./component */ "./src/screen/component/index.ts");
/* harmony import */ var _hook__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../hook */ "./src/hook.ts");
var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/src/screen/register.index.tsx";



const RegisterIndexScreen = () => {
  // state
  const [state, dispatch] = Object(_hook__WEBPACK_IMPORTED_MODULE_2__["useAppState"])();
  const [options] = Object(_hook__WEBPACK_IMPORTED_MODULE_2__["useAppOptions"])();
  const tmpState = state.session.register || {};
  const tmpClaims = tmpState.claims || {};
  const tmpCreds = tmpState.credentials || {};
  const [payload, setPayload] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])({
    name: tmpClaims.name || "",
    email: tmpClaims.email || "",
    password: tmpCreds.password || "",
    password_confirmation: tmpCreds.password_confirmation || ""
  });
  const emailVerified = state.session.verifyEmail && state.session.verifyEmail.email === payload.email && state.session.verifyEmail.verified; // handlers

  const {
    nav
  } = Object(_hook__WEBPACK_IMPORTED_MODULE_2__["useNavigation"])();
  const {
    loading,
    errors,
    setErrors,
    withLoading
  } = Object(_hook__WEBPACK_IMPORTED_MODULE_2__["useWithLoading"])();
  const [handlePayloadSubmit, handlePayloadSubmitLoading] = withLoading(async () => {
    const {
      name,
      email,
      password,
      password_confirmation
    } = payload;
    const data = {
      submit: false,
      claims: {
        name,
        email
      },
      credentials: {
        password,
        password_confirmation
      },
      scope: ["email", "profile"]
    };
    return dispatch("register.submit", data).then(() => {
      setErrors({}); // verify email

      if (!options.register.skipEmailVerification && !emailVerified) {
        return dispatch("verify_email.check_email", {
          email: data.claims.email,
          registered: false
        }).then(() => {
          nav.navigate("verify_email.stack", {
            screen: "verify_email.verify",
            params: {
              callback: "register"
            }
          });
        }); // enter detail claims
      } else if (!options.register.skipDetailClaims) {
        nav.navigate("register.stack", {
          screen: "register.detail",
          params: {}
        }); // register user
      } else {
        return dispatch("register.submit", { ...data,
          register: true
        }).then(() => {
          nav.navigate("register.stack", {
            screen: "register.end",
            params: {}
          });
        });
      }
    }).catch(errs => setErrors(errs));
  }, [payload]);
  const [handleCancel, handleCancelLoading] = withLoading(() => {
    nav.navigate("login.stack", {
      screen: "login.index",
      params: {}
    });
    setErrors({});
  }, []); // render

  const discovery = state.metadata.discovery;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_1__["ScreenLayout"], {
    title: "Sign up",
    subtitle: "Create an account",
    loading: loading,
    error: errors.global,
    buttons: [{
      status: "primary",
      children: "Continue",
      onPress: handlePayloadSubmit,
      loading: handlePayloadSubmitLoading,
      tabIndex: 55
    }, {
      size: "medium",
      group: [{
        children: "Privacy policy",
        onPress: () => window.open(discovery.op_policy_uri, "_blank"),
        disabled: !discovery.op_policy_uri,
        tabIndex: 4
      }, {
        children: "Terms of service",
        onPress: () => window.open(discovery.op_tos_uri, "_blank"),
        disabled: !discovery.op_tos_uri,
        tabIndex: 5
      }]
    }, {
      size: "medium",
      children: "Cancel",
      onPress: handleCancel,
      loading: handleCancelLoading,
      hidden: !state.routes.login,
      tabIndex: 56
    }],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 92
    },
    __self: undefined
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_1__["Form"], {
    onSubmit: handlePayloadSubmit,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 132
    },
    __self: undefined
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_1__["FormInput"], {
    label: "Name",
    tabIndex: 51,
    keyboardType: "default",
    placeholder: "Enter your name",
    autoCompleteType: "name",
    autoFocus: !payload.name,
    value: payload.name,
    setValue: v => setPayload(p => ({ ...p,
      name: v
    })),
    error: errors.name,
    onEnter: handlePayloadSubmit,
    style: {
      marginBottom: 15
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 133
    },
    __self: undefined
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_1__["FormInput"], {
    label: "Email",
    tabIndex: 52,
    keyboardType: "email-address",
    placeholder: "Enter your email address",
    autoCompleteType: "username",
    value: payload.email,
    setValue: v => setPayload(p => ({ ...p,
      email: v
    })),
    icon: emailVerified ? s => react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_1__["Icon"], {
      name: "checkmark-circle-2-outline",
      style: s,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 154
      },
      __self: undefined
    }) : undefined,
    error: errors.email,
    onEnter: handlePayloadSubmit,
    style: {
      marginBottom: 15
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 146
    },
    __self: undefined
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_1__["FormInput"], {
    label: "Password",
    tabIndex: 53,
    secureTextEntry: true,
    autoCompleteType: "password",
    placeholder: "Enter password",
    value: payload.password,
    setValue: v => setPayload(p => ({ ...p,
      password: v
    })),
    error: errors.password,
    onEnter: handlePayloadSubmit,
    style: {
      marginBottom: 15
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 159
    },
    __self: undefined
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_1__["FormInput"], {
    label: "Confirm",
    tabIndex: 54,
    secureTextEntry: true,
    autoCompleteType: "password",
    placeholder: "Confirm password",
    value: payload.password_confirmation,
    setValue: v => setPayload(p => ({ ...p,
      password_confirmation: v
    })),
    error: errors.password_confirmation,
    onEnter: handlePayloadSubmit,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 171
    },
    __self: undefined
  })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_1__["Text"], {
    style: {
      marginTop: 30
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 183
    },
    __self: undefined
  }, "By continuing, you are agreeing to the terms of service and the privacy policy."));
};

/***/ }),

/***/ "./src/screen/reset_password.end.tsx":
/*!*******************************************!*\
  !*** ./src/screen/reset_password.end.tsx ***!
  \*******************************************/
/*! exports provided: ResetPasswordEndScreen */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ResetPasswordEndScreen", function() { return ResetPasswordEndScreen; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _hook__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../hook */ "./src/hook.ts");
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./component */ "./src/screen/component/index.ts");
var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/src/screen/reset_password.end.tsx";



const ResetPasswordEndScreen = () => {
  // states
  const [state] = Object(_hook__WEBPACK_IMPORTED_MODULE_1__["useAppState"])();
  const email = state.session.resetPassword.user.email; // handlers

  const {
    nav
  } = Object(_hook__WEBPACK_IMPORTED_MODULE_1__["useNavigation"])();
  const {
    loading,
    withLoading
  } = Object(_hook__WEBPACK_IMPORTED_MODULE_1__["useWithLoading"])();
  const [handleLogin, handleLoginLoading] = withLoading(() => {
    nav.navigate("login.stack", {
      screen: "login.index",
      params: {
        email
      }
    });
  }, [state]);
  const {
    closed,
    close
  } = Object(_hook__WEBPACK_IMPORTED_MODULE_1__["useClose"])(false); // render

  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_2__["ScreenLayout"], {
    title: `Password reset`,
    subtitle: email,
    loading: loading || closed,
    error: closed ? "Please close the window manually." : undefined,
    buttons: [{
      hidden: !state.routes.login,
      status: "primary",
      children: "Sign in",
      tabIndex: 210,
      onPress: handleLogin,
      loading: handleLoginLoading
    }, {
      hidden: !!state.routes.login,
      tabIndex: 211,
      children: "Close",
      onPress: close,
      loading: closed
    }],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 26
    },
    __self: undefined
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_2__["Text"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 49
    },
    __self: undefined
  }, "The account credential has been updated successfully."));
};

/***/ }),

/***/ "./src/screen/reset_password.index.tsx":
/*!*********************************************!*\
  !*** ./src/screen/reset_password.index.tsx ***!
  \*********************************************/
/*! exports provided: ResetPasswordIndexScreen */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ResetPasswordIndexScreen", function() { return ResetPasswordIndexScreen; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _hook__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../hook */ "./src/hook.ts");
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./component */ "./src/screen/component/index.ts");
var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/src/screen/reset_password.index.tsx";



const ResetPasswordIndexScreen = () => {
  // states
  const [state, dispatch] = Object(_hook__WEBPACK_IMPORTED_MODULE_1__["useAppState"])();
  const [email, setEmail] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(state.user && state.user.email || "");
  const {
    nav,
    route
  } = Object(_hook__WEBPACK_IMPORTED_MODULE_1__["useNavigation"])(); // handlers

  const {
    loading,
    errors,
    setErrors,
    withLoading
  } = Object(_hook__WEBPACK_IMPORTED_MODULE_1__["useWithLoading"])();
  const [handleCheckEmail, handleCheckEmailLoading] = withLoading(() => {
    dispatch("verify_email.check_email", {
      email,
      registered: true
    }).then(() => {
      setErrors({});
      nav.navigate("verify_email.stack", {
        screen: "verify_email.verify",
        params: {
          callback: "reset_password"
        }
      });
    }).catch(errs => setErrors(errs));
  }, [email]);
  const [handleCancel, handleCancelLoading] = withLoading(() => {
    nav.navigate("login.stack", {
      screen: "login.check_password",
      params: {
        email
      }
    });
    setErrors({});
  }, [email]);
  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(() => {
    // update email when route params updated
    if (route.params.email && route.params.email !== email) {
      setEmail(route.params.email || "");
      setErrors({});
    }
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  [nav, route]); // render

  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_2__["ScreenLayout"], {
    title: `Reset password`,
    subtitle: `with email verification`,
    loading: loading,
    error: errors.global,
    buttons: [{
      status: "primary",
      children: "Continue",
      onPress: handleCheckEmail,
      loading: handleCheckEmailLoading,
      tabIndex: 22
    }, {
      children: "Cancel",
      onPress: handleCancel,
      loading: handleCancelLoading,
      tabIndex: 23,
      hidden: !state.routes.login
    }],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 52
    },
    __self: undefined
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_2__["Text"], {
    style: {
      marginBottom: 30
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 74
    },
    __self: undefined
  }, "Verify your registered email address."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_2__["FormInput"], {
    autoFocus: true,
    tabIndex: 21,
    label: `Email`,
    keyboardType: "email-address",
    placeholder: "Enter your email address",
    autoCompleteType: "username",
    blurOnSubmit: false,
    value: email,
    error: errors.email,
    setValue: setEmail,
    onEnter: handleCheckEmail,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 77
    },
    __self: undefined
  }));
};

/***/ }),

/***/ "./src/screen/reset_password.set.tsx":
/*!*******************************************!*\
  !*** ./src/screen/reset_password.set.tsx ***!
  \*******************************************/
/*! exports provided: ResetPasswordSetScreen */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ResetPasswordSetScreen", function() { return ResetPasswordSetScreen; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _hook__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../hook */ "./src/hook.ts");
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./component */ "./src/screen/component/index.ts");
var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/src/screen/reset_password.set.tsx";



const ResetPasswordSetScreen = () => {
  // states
  const [state, dispatch] = Object(_hook__WEBPACK_IMPORTED_MODULE_1__["useAppState"])();
  const email = state.session.resetPassword.user.email;
  const [payload, setPayload] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])({
    password: "",
    password_confirmation: ""
  }); // handlers

  const {
    nav
  } = Object(_hook__WEBPACK_IMPORTED_MODULE_1__["useNavigation"])();
  const {
    loading,
    errors,
    setErrors,
    withLoading
  } = Object(_hook__WEBPACK_IMPORTED_MODULE_1__["useWithLoading"])();
  const [handleResetPassword, handleResetPasswordLoading] = withLoading(() => {
    return dispatch("reset_password.set", {
      email,
      ...payload
    }).then(() => {
      setErrors({});
      nav.navigate("reset_password.stack", {
        screen: "reset_password.end",
        params: {}
      });
    }).catch(errs => setErrors(errs));
  }, [payload]);
  const [handleCancel, handleCancelLoading] = withLoading(() => {
    nav.navigate("login.stack", {
      screen: "login.check_password",
      params: {
        email
      }
    });
    setErrors({});
  }, []); // render

  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_2__["ScreenLayout"], {
    title: `Reset password`,
    subtitle: email,
    error: errors.global,
    loading: loading,
    buttons: [{
      status: "primary",
      children: "Continue",
      onPress: handleResetPassword,
      loading: handleResetPasswordLoading,
      tabIndex: 43
    }, {
      children: "Cancel",
      onPress: handleCancel,
      loading: handleCancelLoading,
      tabIndex: 44,
      hidden: !state.routes.login
    }],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 44
    },
    __self: undefined
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_2__["Text"], {
    style: {
      marginBottom: 30
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 66
    },
    __self: undefined
  }, "Set a new password for your account."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_2__["Form"], {
    onSubmit: handleResetPassword,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 69
    },
    __self: undefined
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_2__["FormInput"], {
    autoCompleteType: "username",
    value: email,
    style: {
      display: "none"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 71
    },
    __self: undefined
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_2__["FormInput"], {
    label: "Password",
    tabIndex: 41,
    autoFocus: true,
    secureTextEntry: true,
    autoCompleteType: "password",
    placeholder: "Enter new password",
    value: payload.password,
    setValue: v => setPayload(p => ({ ...p,
      password: v
    })),
    error: errors.password,
    onEnter: handleResetPassword,
    style: {
      marginBottom: 15
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 76
    },
    __self: undefined
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_2__["FormInput"], {
    label: "Confirm",
    tabIndex: 42,
    secureTextEntry: true,
    autoCompleteType: "password",
    placeholder: "Confirm new password",
    value: payload.password_confirmation,
    setValue: v => setPayload(p => ({ ...p,
      password_confirmation: v
    })),
    error: errors.password_confirmation,
    onEnter: handleResetPassword,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 89
    },
    __self: undefined
  })));
};

/***/ }),

/***/ "./src/screen/verify_email.end.tsx":
/*!*****************************************!*\
  !*** ./src/screen/verify_email.end.tsx ***!
  \*****************************************/
/*! exports provided: VerifyEmailEndScreen */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VerifyEmailEndScreen", function() { return VerifyEmailEndScreen; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _hook__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../hook */ "./src/hook.ts");
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./component */ "./src/screen/component/index.ts");
var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/src/screen/verify_email.end.tsx";



const VerifyEmailEndScreen = () => {
  // states
  const [state] = Object(_hook__WEBPACK_IMPORTED_MODULE_1__["useAppState"])();
  const {
    close,
    closed
  } = Object(_hook__WEBPACK_IMPORTED_MODULE_1__["useClose"])(false); // render

  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_2__["ScreenLayout"], {
    title: `Email address verified`,
    subtitle: state.session.verifyEmail.email,
    error: closed ? "Please close the window manually." : undefined,
    loading: closed,
    buttons: [{
      children: "Close",
      tabIndex: 1,
      onPress: close
    }],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 12
    },
    __self: undefined
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_2__["Text"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 25
    },
    __self: undefined
  }, "The account email address has been verified successfully."));
};

/***/ }),

/***/ "./src/screen/verify_email.index.tsx":
/*!*******************************************!*\
  !*** ./src/screen/verify_email.index.tsx ***!
  \*******************************************/
/*! exports provided: VerifyEmailIndexScreen */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VerifyEmailIndexScreen", function() { return VerifyEmailIndexScreen; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _hook__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../hook */ "./src/hook.ts");
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./component */ "./src/screen/component/index.ts");
var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/src/screen/verify_email.index.tsx";



const VerifyEmailIndexScreen = () => {
  // states
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, dispatch] = Object(_hook__WEBPACK_IMPORTED_MODULE_1__["useAppState"])();
  const [email, setEmail] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])("");
  const {
    nav,
    route
  } = Object(_hook__WEBPACK_IMPORTED_MODULE_1__["useNavigation"])(); // handlers

  const {
    loading,
    errors,
    setErrors,
    withLoading
  } = Object(_hook__WEBPACK_IMPORTED_MODULE_1__["useWithLoading"])();
  const [handleCheckEmail, handleCheckEmailLoading] = withLoading(() => {
    dispatch("verify_email.check_email", {
      email,
      registered: true
    }).then(() => {
      setErrors({});
      nav.navigate("verify_email.stack", {
        screen: "verify_email.verify",
        params: {}
      });
    }).catch(err => setErrors(err));
  }, [email]);
  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(() => {
    // update email when route params updated
    if (route.params.email !== email) {
      setEmail(route.params.email || "");
      setErrors({});
    }
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  [nav, route]); // render

  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_2__["ScreenLayout"], {
    title: `Verify your email`,
    loading: loading,
    error: errors.global,
    buttons: [{
      status: "primary",
      children: "Continue",
      onPress: handleCheckEmail,
      loading: handleCheckEmailLoading,
      tabIndex: 32
    }],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 41
    },
    __self: undefined
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_2__["Text"], {
    style: {
      marginBottom: 30
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 55
    },
    __self: undefined
  }, "Verify your registered email address."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_2__["FormInput"], {
    autoFocus: true,
    tabIndex: 31,
    label: `Email`,
    keyboardType: "email-address",
    placeholder: "Enter your email address",
    autoCompleteType: "username",
    blurOnSubmit: false,
    value: email,
    error: errors.email,
    setValue: setEmail,
    onEnter: handleCheckEmail,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 58
    },
    __self: undefined
  }));
};

/***/ }),

/***/ "./src/screen/verify_email.verify.tsx":
/*!********************************************!*\
  !*** ./src/screen/verify_email.verify.tsx ***!
  \********************************************/
/*! exports provided: VerifyEmailVerifyScreen */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VerifyEmailVerifyScreen", function() { return VerifyEmailVerifyScreen; });
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! moment */ "../../node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "../../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_native__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-native */ "../../node_modules/react-native-web/dist/index.js");
/* harmony import */ var _hook__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../hook */ "./src/hook.ts");
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./component */ "./src/screen/component/index.ts");
/* harmony import */ var _assets_screen_sent_svg__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../assets/screen_sent.svg */ "./src/assets/screen_sent.svg");
/* harmony import */ var _assets_screen_sent_svg__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_assets_screen_sent_svg__WEBPACK_IMPORTED_MODULE_5__);
var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/src/screen/verify_email.verify.tsx";






const VerifyEmailVerifyScreen = () => {
  // states
  const [state, dispatch] = Object(_hook__WEBPACK_IMPORTED_MODULE_3__["useAppState"])();
  const email = state.session.verifyEmail.email;
  const expiresAt = state.session.verifyEmail.expiresAt;
  const [secret, setSecret] = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])(state.session.dev && state.session.dev.verifyEmailSecret || "");
  const [remainingSeconds, setRemainingSeconds] = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])("00:00");
  const updateRemainingSeconds = Object(react__WEBPACK_IMPORTED_MODULE_1__["useCallback"])(() => {
    let updated = "";

    if (expiresAt) {
      const seconds = Math.max(moment__WEBPACK_IMPORTED_MODULE_0___default()(expiresAt).diff(moment__WEBPACK_IMPORTED_MODULE_0___default.a.now(), "s"), 0);
      updated = `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
    }

    if (updated !== remainingSeconds) {
      setRemainingSeconds(updated);
    }
  }, [expiresAt, remainingSeconds]);
  Object(react__WEBPACK_IMPORTED_MODULE_1__["useEffect"])(() => {
    updateRemainingSeconds();
    const timer = setInterval(updateRemainingSeconds, 500);
    return () => clearInterval(timer);
  }, [updateRemainingSeconds]); // handlers

  const {
    loading,
    errors,
    setErrors,
    withLoading
  } = Object(_hook__WEBPACK_IMPORTED_MODULE_3__["useWithLoading"])();
  const {
    nav,
    route
  } = Object(_hook__WEBPACK_IMPORTED_MODULE_3__["useNavigation"])();
  const {
    callback = ""
  } = route.params;
  const [handleSend, handleSendLoading] = withLoading(() => {
    return dispatch("verify_email.send", {
      email
    }).then(s => {
      setErrors({}); // for dev

      if (s.session.dev && s.session.dev.verifyEmailSecret) {
        console.debug("set secret automatically by dev mode");
        setSecret(s.session.dev.verifyEmailSecret);
      }

      updateRemainingSeconds();
    }).catch(errs => setErrors(errs));
  }, [state]);
  const [handleCancel, handleCancelLoading] = withLoading(() => {
    switch (callback) {
      case "reset_password":
        if (state.routes.login) {
          nav.navigate("login.stack", {
            screen: "login.check_password",
            params: {}
          });
        } else {
          nav.navigate("reset_password.stack", {
            screen: "reset_password.index",
            params: {}
          });
        }

        break;

      case "register":
        nav.navigate("register.stack", {
          screen: "register.index",
          params: {}
        });
        break;

      default:
        nav.navigate("verify_email.stack", {
          screen: "verify_email.index",
          params: {}
        });
        break;
    }

    setErrors({});
  }, [callback]);
  const [handleVerify, handleVerifyLoading] = withLoading(() => {
    return dispatch("verify_email.verify", {
      email,
      secret,
      callback
    }).then(() => {
      setErrors({});

      switch (callback) {
        case "reset_password":
          nav.navigate("reset_password.stack", {
            screen: "reset_password.set",
            params: {}
          });
          break;

        case "register":
          nav.navigate("register.stack", {
            screen: "register.index",
            params: {}
          });
          break;

        default:
          nav.navigate("verify_email.stack", {
            screen: "verify_email.end",
            params: {}
          });
      }
    }).catch(errs => setErrors(errs));
  }, [callback, state, secret]); // render

  return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_4__["ScreenLayout"], {
    title: `Verify email address`,
    subtitle: email,
    buttons: [...(expiresAt ? [{
      status: "primary",
      children: "Verify",
      onPress: handleVerify,
      loading: handleVerifyLoading,
      tabIndex: 111
    }] : []), {
      status: expiresAt ? "basic" : "primary",
      children: expiresAt ? "Resend" : "Send",
      onPress: handleSend,
      loading: handleSendLoading,
      tabIndex: 112
    }, {
      children: "Cancel",
      onPress: handleCancel,
      loading: handleCancelLoading,
      tabIndex: 113
    }],
    loading: loading,
    error: errors.global,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 118
    },
    __self: undefined
  }, expiresAt ? react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_1___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_4__["Text"], {
    style: {
      marginBottom: 30
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 148
    },
    __self: undefined
  }, "Enter the received 6-digit verification code."), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_4__["FormInput"], {
    label: "Verification code",
    keyboardType: "number-pad",
    placeholder: "Enter the verification code",
    autoFocus: true,
    tabIndex: 110,
    blurOnSubmit: false,
    value: secret,
    setValue: setSecret,
    error: errors.code,
    caption: remainingSeconds,
    onEnter: handleVerify,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 151
    },
    __self: undefined
  })) : react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_1___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_4__["Text"], {
    style: {
      marginBottom: 30
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 167
    },
    __self: undefined
  }, "An email with a verification code will be sent to verify the email address."), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(react_native__WEBPACK_IMPORTED_MODULE_2__["Image"], {
    source: {
      uri: _assets_screen_sent_svg__WEBPACK_IMPORTED_MODULE_5___default.a
    },
    style: {
      minHeight: 200,
      maxHeight: 300,
      resizeMode: "contain"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 170
    },
    __self: undefined
  })));
};

/***/ }),

/***/ "./src/screen/verify_phone.end.tsx":
/*!*****************************************!*\
  !*** ./src/screen/verify_phone.end.tsx ***!
  \*****************************************/
/*! exports provided: VerifyPhoneEndScreen */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VerifyPhoneEndScreen", function() { return VerifyPhoneEndScreen; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _hook__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../hook */ "./src/hook.ts");
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./component */ "./src/screen/component/index.ts");
var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/src/screen/verify_phone.end.tsx";



const VerifyPhoneEndScreen = () => {
  // states
  const [state] = Object(_hook__WEBPACK_IMPORTED_MODULE_1__["useAppState"])();
  const {
    close,
    closed
  } = Object(_hook__WEBPACK_IMPORTED_MODULE_1__["useClose"])(false); // render

  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_2__["ScreenLayout"], {
    title: `Phone number verified`,
    subtitle: state.session.verifyPhone.phoneNumber,
    error: closed ? "Please close the window manually." : undefined,
    loading: closed,
    buttons: [{
      children: "Close",
      tabIndex: 1,
      onPress: close
    }],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 12
    },
    __self: undefined
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_2__["Text"], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 25
    },
    __self: undefined
  }, "The account phone number has been verified successfully."));
};

/***/ }),

/***/ "./src/screen/verify_phone.index.tsx":
/*!*******************************************!*\
  !*** ./src/screen/verify_phone.index.tsx ***!
  \*******************************************/
/*! exports provided: VerifyPhoneIndexScreen */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VerifyPhoneIndexScreen", function() { return VerifyPhoneIndexScreen; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _hook__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../hook */ "./src/hook.ts");
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./component */ "./src/screen/component/index.ts");
var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/src/screen/verify_phone.index.tsx";



const VerifyPhoneIndexScreen = () => {
  // states
  const [state, dispatch] = Object(_hook__WEBPACK_IMPORTED_MODULE_1__["useAppState"])();
  const [phoneNumber, setPhoneNumber] = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(""); // handlers

  const {
    nav,
    route
  } = Object(_hook__WEBPACK_IMPORTED_MODULE_1__["useNavigation"])();
  const {
    loading,
    errors,
    setErrors,
    withLoading
  } = Object(_hook__WEBPACK_IMPORTED_MODULE_1__["useWithLoading"])();
  const [handleCheckPhoneNumber, handleCheckPhoneNumberLoading] = withLoading(() => {
    dispatch("verify_phone.check_phone", {
      phone_number: `${state.locale.country}|${phoneNumber}`,
      registered: true
    }).then(() => {
      setErrors({});
      nav.navigate("verify_phone.stack", {
        screen: "verify_phone.verify",
        params: {}
      });
    }).catch(err => setErrors(err));
  }, [phoneNumber]);
  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(() => {
    // update email when route params updated
    if (route.params.phone_number && route.params.phone_number !== phoneNumber) {
      setPhoneNumber(route.params.phone_number || "");
      setErrors({});
    }
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  [nav, route]); // render

  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_2__["ScreenLayout"], {
    title: `Verify your phone`,
    loading: loading,
    error: errors.global,
    buttons: [{
      status: "primary",
      children: "Continue",
      onPress: handleCheckPhoneNumber,
      loading: handleCheckPhoneNumberLoading,
      tabIndex: 22
    }],
    __source: {
      fileName: _jsxFileName,
      lineNumber: 39
    },
    __self: undefined
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_2__["Text"], {
    style: {
      marginBottom: 30
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 53
    },
    __self: undefined
  }, "Verify your registered phone number."), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_2__["FormInput"], {
    autoFocus: true,
    tabIndex: 21,
    label: `Phone number`,
    placeholder: `Enter your mobile phone number (${state.locale.country})`,
    blurOnSubmit: false,
    keyboardType: "phone-pad",
    autoCompleteType: "tel",
    value: phoneNumber,
    error: errors.phone_number,
    setValue: setPhoneNumber,
    onEnter: handleCheckPhoneNumber,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 56
    },
    __self: undefined
  }));
};

/***/ }),

/***/ "./src/screen/verify_phone.verify.tsx":
/*!********************************************!*\
  !*** ./src/screen/verify_phone.verify.tsx ***!
  \********************************************/
/*! exports provided: VerifyPhoneVerifyScreen */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VerifyPhoneVerifyScreen", function() { return VerifyPhoneVerifyScreen; });
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! moment */ "../../node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "../../node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_native__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-native */ "../../node_modules/react-native-web/dist/index.js");
/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./component */ "./src/screen/component/index.ts");
/* harmony import */ var _hook__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../hook */ "./src/hook.ts");
/* harmony import */ var _assets_screen_verify_svg__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../assets/screen_verify.svg */ "./src/assets/screen_verify.svg");
/* harmony import */ var _assets_screen_verify_svg__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_assets_screen_verify_svg__WEBPACK_IMPORTED_MODULE_5__);
var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/src/screen/verify_phone.verify.tsx";






const VerifyPhoneVerifyScreen = () => {
  // states
  const [state, dispatch] = Object(_hook__WEBPACK_IMPORTED_MODULE_4__["useAppState"])();
  const expiresAt = state.session.verifyPhone.expiresAt;
  const [secret, setSecret] = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])(state.session.dev && state.session.dev.verifyPhoneSecret || "");
  const [remainingSeconds, setRemainingSeconds] = Object(react__WEBPACK_IMPORTED_MODULE_1__["useState"])("00:00");
  const updateRemainingSeconds = Object(react__WEBPACK_IMPORTED_MODULE_1__["useCallback"])(() => {
    let updated = "";

    if (expiresAt) {
      const seconds = Math.max(moment__WEBPACK_IMPORTED_MODULE_0___default()(expiresAt).diff(moment__WEBPACK_IMPORTED_MODULE_0___default.a.now(), "s"), 0);
      updated = `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
    }

    if (updated !== remainingSeconds) {
      setRemainingSeconds(updated);
    }
  }, [expiresAt, remainingSeconds]);
  Object(react__WEBPACK_IMPORTED_MODULE_1__["useEffect"])(() => {
    updateRemainingSeconds();
    const timer = setInterval(updateRemainingSeconds, 500);
    return () => clearInterval(timer);
  }, [updateRemainingSeconds]); // handlers

  const {
    loading,
    errors,
    setErrors,
    withLoading
  } = Object(_hook__WEBPACK_IMPORTED_MODULE_4__["useWithLoading"])();
  const {
    nav,
    route
  } = Object(_hook__WEBPACK_IMPORTED_MODULE_4__["useNavigation"])();
  const {
    callback = ""
  } = route.params;
  const [handleSend, handleSendLoading] = withLoading(() => {
    return dispatch("verify_phone.send", {
      phone_number: state.session.verifyPhone.phoneNumber
    }).then(s => {
      setErrors({}); // for dev

      if (s.session.dev && s.session.dev.verifyPhoneSecret) {
        console.debug("set secret automatically by dev mode");
        setSecret(s.session.dev.verifyPhoneSecret);
      }

      updateRemainingSeconds();
    }).catch(errs => setErrors(errs));
  }, [state]);
  const [handleCancel, handleCancelLoading] = withLoading(() => {
    switch (callback) {
      case "find_email":
        nav.navigate("find_email.stack", {
          screen: "find_email.index",
          params: {}
        });
        break;

      case "register":
        nav.navigate("register.stack", {
          screen: "register.detail",
          params: {}
        });
        break;

      default:
        nav.navigate("verify_phone.stack", {
          screen: "verify_phone.index",
          params: {}
        });
        break;
    }

    setErrors({});
  }, [callback]);
  const [handleVerify, handleVerifyLoading] = withLoading(() => {
    return dispatch("verify_phone.verify", {
      phone_number: state.session.verifyPhone.phoneNumber,
      secret,
      callback
    }).then(() => {
      setErrors({});

      switch (callback) {
        case "find_email":
          nav.navigate("find_email.stack", {
            screen: "find_email.end",
            params: {}
          });
          break;

        case "register":
          nav.navigate("register.stack", {
            screen: "register.detail",
            params: {}
          });
          break;

        default:
          nav.navigate("verify_phone.stack", {
            screen: "verify_phone.end",
            params: {}
          });
      }
    }).catch(errs => setErrors(errs));
  }, [callback, state, secret, nav]); // render

  return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_3__["ScreenLayout"], {
    title: `Verify phone number`,
    subtitle: state.session.verifyPhone.phoneNumber,
    buttons: [...(expiresAt ? [{
      status: "primary",
      children: "Verify",
      onPress: handleVerify,
      loading: handleVerifyLoading,
      tabIndex: 111
    }] : []), {
      status: expiresAt ? "basic" : "primary",
      children: expiresAt ? "Resend" : "Send",
      onPress: handleSend,
      loading: handleSendLoading,
      tabIndex: 112
    }, {
      children: "Cancel",
      onPress: handleCancel,
      loading: handleCancelLoading,
      tabIndex: 113
    }],
    loading: loading,
    error: errors.global,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 110
    },
    __self: undefined
  }, expiresAt ? react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_1___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_3__["Text"], {
    style: {
      marginBottom: 30
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 140
    },
    __self: undefined
  }, "Enter the received 6-digit verification code."), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_3__["FormInput"], {
    label: "Verification code",
    keyboardType: "number-pad",
    placeholder: "Enter the verification code",
    autoFocus: true,
    tabIndex: 110,
    blurOnSubmit: false,
    value: secret,
    setValue: setSecret,
    error: errors.code,
    caption: remainingSeconds,
    onEnter: handleVerify,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 143
    },
    __self: undefined
  })) : react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_1___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(_component__WEBPACK_IMPORTED_MODULE_3__["Text"], {
    style: {
      marginBottom: 30
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 159
    },
    __self: undefined
  }, "A text message with a verification code will be sent to verify the phone number."), react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(react_native__WEBPACK_IMPORTED_MODULE_2__["Image"], {
    source: {
      uri: _assets_screen_verify_svg__WEBPACK_IMPORTED_MODULE_5___default.a
    },
    style: {
      minHeight: 200,
      maxHeight: 300,
      resizeMode: "contain"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 162
    },
    __self: undefined
  })));
};

/***/ }),

/***/ "./src/service-worker.ts":
/*!*******************************!*\
  !*** ./src/service-worker.ts ***!
  \*******************************/
/*! exports provided: register, unregister */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "register", function() { return register; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "unregister", function() { return unregister; });
// This optional code is used to register a service worker.
// register() is not called by default.
// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on subsequent visits to a page, after all the
// existing tabs open on the page have been closed, since previously cached
// resources are updated in the background.
// To learn more about the benefits of this model and instructions on how to
// opt-in, read https://bit.ly/CRA-PWA
const isLocalhost = Boolean(window.location.hostname === "localhost" || // [::1] is the IPv6 localhost address.
window.location.hostname === "[::1]" || // 127.0.0.1/8 is considered localhost for IPv4.
window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));
function register(config) {
  if (false) {}
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker.register(swUrl).then(registration => {
    registration.onupdatefound = () => {
      const installingWorker = registration.installing;

      if (installingWorker == null) {
        return;
      }

      installingWorker.onstatechange = () => {
        if (installingWorker.state === "installed") {
          if (navigator.serviceWorker.controller) {
            // At this point, the updated precached content has been fetched,
            // but the previous service worker will still serve the older
            // content until all client tabs are closed.
            console.log("New content is available and will be used when all " + "tabs for this page are closed. See https://bit.ly/CRA-PWA."); // Execute callback

            if (config && config.onUpdate) {
              config.onUpdate(registration);
            }
          } else {
            // At this point, everything has been precached.
            // It"s the perfect time to display a
            // "Content is cached for offline use." message.
            console.log("Content is cached for offline use."); // Execute callback

            if (config && config.onSuccess) {
              config.onSuccess(registration);
            }
          }
        }
      };
    };
  }).catch(error => {
    console.error("Error during service worker registration:", error);
  });
}

function checkValidServiceWorker(swUrl, config) {
  // Check if the service worker can be found. If it can"t reload the page.
  fetch(swUrl).then(response => {
    // Ensure service worker exists, and that we really are getting a JS file.
    const contentType = response.headers.get("content-type");

    if (response.status === 404 || contentType != null && contentType.indexOf("javascript") === -1) {
      // No service worker found. Probably a different app. Reload the page.
      navigator.serviceWorker.ready.then(registration => {
        registration.unregister().then(() => {
          window.location.reload();
        });
      });
    } else {
      // Service worker found. Proceed as normal.
      registerValidSW(swUrl, config);
    }
  }).catch(() => {
    console.log("No internet connection found. App is running in offline mode.");
  });
}

function unregister() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.unregister();
    });
  }
}

/***/ }),

/***/ "./theme.js":
/*!******************!*\
  !*** ./theme.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lightTheme = {
  "color-primary-100": "#D4DCFE",
  "color-primary-200": "#A9B8FD",
  "color-primary-300": "#7E92F9",
  "color-primary-400": "#5D73F3",
  "color-primary-500": "#2A44EC",
  "color-primary-600": "#1E33CA",
  "color-primary-700": "#1524A9",
  "color-primary-800": "#0D1888",
  "color-primary-900": "#081071",
  "color-primary-transparent-100": "rgba(42, 68, 236, 0.08)",
  "color-primary-transparent-200": "rgba(42, 68, 236, 0.16)",
  "color-primary-transparent-300": "rgba(42, 68, 236, 0.24)",
  "color-primary-transparent-400": "rgba(42, 68, 236, 0.32)",
  "color-primary-transparent-500": "rgba(42, 68, 236, 0.4)",
  "color-primary-transparent-600": "rgba(42, 68, 236, 0.48)",
  "color-success-100": "#F1FDD0",
  "color-success-200": "#E0FBA1",
  "color-success-300": "#C7F471",
  "color-success-400": "#ADEA4D",
  "color-success-500": "#88DD18",
  "color-success-600": "#6CBE11",
  "color-success-700": "#529F0C",
  "color-success-800": "#3C8007",
  "color-success-900": "#2C6A04",
  "color-success-transparent-100": "rgba(136, 221, 24, 0.08)",
  "color-success-transparent-200": "rgba(136, 221, 24, 0.16)",
  "color-success-transparent-300": "rgba(136, 221, 24, 0.24)",
  "color-success-transparent-400": "rgba(136, 221, 24, 0.32)",
  "color-success-transparent-500": "rgba(136, 221, 24, 0.4)",
  "color-success-transparent-600": "rgba(136, 221, 24, 0.48)",
  "color-info-100": "#CCFFFA",
  "color-info-200": "#99FFFD",
  "color-info-300": "#66F6FF",
  "color-info-400": "#3FE6FF",
  "color-info-500": "#00CBFF",
  "color-info-600": "#009EDB",
  "color-info-700": "#0076B7",
  "color-info-800": "#005493",
  "color-info-900": "#003D7A",
  "color-info-transparent-100": "rgba(0, 203, 255, 0.08)",
  "color-info-transparent-200": "rgba(0, 203, 255, 0.16)",
  "color-info-transparent-300": "rgba(0, 203, 255, 0.24)",
  "color-info-transparent-400": "rgba(0, 203, 255, 0.32)",
  "color-info-transparent-500": "rgba(0, 203, 255, 0.4)",
  "color-info-transparent-600": "rgba(0, 203, 255, 0.48)",
  "color-warning-100": "#FFF4CC",
  "color-warning-200": "#FFE799",
  "color-warning-300": "#FFD667",
  "color-warning-400": "#FFC541",
  "color-warning-500": "#FFAA02",
  "color-warning-600": "#DB8A01",
  "color-warning-700": "#B76D01",
  "color-warning-800": "#935300",
  "color-warning-900": "#7A4000",
  "color-warning-transparent-100": "rgba(255, 170, 2, 0.08)",
  "color-warning-transparent-200": "rgba(255, 170, 2, 0.16)",
  "color-warning-transparent-300": "rgba(255, 170, 2, 0.24)",
  "color-warning-transparent-400": "rgba(255, 170, 2, 0.32)",
  "color-warning-transparent-500": "rgba(255, 170, 2, 0.4)",
  "color-warning-transparent-600": "rgba(255, 170, 2, 0.48)",
  "color-danger-100": "#FFE7D6",
  "color-danger-200": "#FFC9AD",
  "color-danger-300": "#FFA483",
  "color-danger-400": "#FF8165",
  "color-danger-500": "#FF4732",
  "color-danger-600": "#DB2824",
  "color-danger-700": "#B71922",
  "color-danger-800": "#930F22",
  "color-danger-900": "#7A0922",
  "color-danger-transparent-100": "rgba(255, 71, 50, 0.08)",
  "color-danger-transparent-200": "rgba(255, 71, 50, 0.16)",
  "color-danger-transparent-300": "rgba(255, 71, 50, 0.24)",
  "color-danger-transparent-400": "rgba(255, 71, 50, 0.32)",
  "color-danger-transparent-500": "rgba(255, 71, 50, 0.4)",
  "color-danger-transparent-600": "rgba(255, 71, 50, 0.48)",
  // "color-primary-100": "#F2F6FF",
  // "color-primary-200": "#D9E4FF",
  // "color-primary-300": "#A6C1FF",
  // "color-primary-400": "#598BFF",
  // "color-primary-500": "#3366FF",
  // "color-primary-600": "#274BDB",
  // "color-primary-700": "#1A34B8",
  // "color-primary-800": "#102694",
  // "color-primary-900": "#091C7A",
  // "color-primary-transparent-100": "rgba(51, 102, 255, 0.08)",
  // "color-primary-transparent-200": "rgba(51, 102, 255, 0.16)",
  // "color-primary-transparent-300": "rgba(51, 102, 255, 0.24)",
  // "color-primary-transparent-400": "rgba(51, 102, 255, 0.32)",
  // "color-primary-transparent-500": "rgba(51, 102, 255, 0.40)",
  // "color-primary-transparent-600": "rgba(51, 102, 255, 0.48)",
  // "color-success-100": "#EDFFF3",
  // "color-success-200": "#B3FFD6",
  // "color-success-300": "#8CFAC7",
  // "color-success-400": "#51F0B0",
  // "color-success-500": "#00E096",
  // "color-success-600": "#00B383",
  // "color-success-700": "#008F72",
  // "color-success-800": "#007566",
  // "color-success-900": "#00524C",
  // "color-success-transparent-100": "rgba(0, 224, 150, 0.08)",
  // "color-success-transparent-200": "rgba(0, 224, 150, 0.16)",
  // "color-success-transparent-300": "rgba(0, 224, 150, 0.24)",
  // "color-success-transparent-400": "rgba(0, 224, 150, 0.32)",
  // "color-success-transparent-500": "rgba(0, 224, 150, 0.40)",
  // "color-success-transparent-600": "rgba(0, 224, 150, 0.48)",
  // "color-info-100": "#F2F8FF",
  // "color-info-200": "#C7E2FF",
  // "color-info-300": "#94CBFF",
  // "color-info-400": "#42AAFF",
  // "color-info-500": "#0095FF",
  // "color-info-600": "#006FD6",
  // "color-info-700": "#0057C2",
  // "color-info-800": "#0041A8",
  // "color-info-900": "#002885",
  // "color-info-transparent-100": "rgba(0, 149, 255, 0.08)",
  // "color-info-transparent-200": "rgba(0, 149, 255, 0.16)",
  // "color-info-transparent-300": "rgba(0, 149, 255, 0.24)",
  // "color-info-transparent-400": "rgba(0, 149, 255, 0.32)",
  // "color-info-transparent-500": "rgba(0, 149, 255, 0.40)",
  // "color-info-transparent-600": "rgba(0, 149, 255, 0.48)",
  // "color-warning-100": "#FFFDF2",
  // "color-warning-200": "#FFF1C2",
  // "color-warning-300": "#FFE59E",
  // "color-warning-400": "#FFC94D",
  // "color-warning-500": "#FFAA00",
  // "color-warning-600": "#DB8B00",
  // "color-warning-700": "#B86E00",
  // "color-warning-800": "#945400",
  // "color-warning-900": "#703C00",
  // "color-warning-transparent-100": "rgba(255, 170, 0, 0.08)",
  // "color-warning-transparent-200": "rgba(255, 170, 0, 0.16)",
  // "color-warning-transparent-300": "rgba(255, 170, 0, 0.24)",
  // "color-warning-transparent-400": "rgba(255, 170, 0, 0.32)",
  // "color-warning-transparent-500": "rgba(255, 170, 0, 0.40)",
  // "color-warning-transparent-600": "rgba(255, 170, 0, 0.48)",
  // "color-danger-100": "#FFF2F2",
  // "color-danger-200": "#FFD6D9",
  // "color-danger-300": "#FFA8B4",
  // "color-danger-400": "#FF708D",
  // "color-danger-500": "#FF3D71",
  // "color-danger-600": "#DB2C66",
  // "color-danger-700": "#B81D5B",
  // "color-danger-800": "#94124E",
  // "color-danger-900": "#700940",
  // "color-danger-transparent-100": "rgba(255, 61, 113, 0.08)",
  // "color-danger-transparent-200": "rgba(255, 61, 113, 0.16)",
  // "color-danger-transparent-300": "rgba(255, 61, 113, 0.24)",
  // "color-danger-transparent-400": "rgba(255, 61, 113, 0.32)",
  // "color-danger-transparent-500": "rgba(255, 61, 113, 0.40)",
  // "color-danger-transparent-600": "rgba(255, 61, 113, 0.48)",
  "color-basic-100": "#FFFFFF",
  "color-basic-200": "#F7F9FC",
  "color-basic-300": "#EDF1F7",
  "color-basic-400": "#E4E9F2",
  "color-basic-500": "#C5CEE0",
  "color-basic-600": "#8F9BB3",
  "color-basic-700": "#2E3A59",
  "color-basic-800": "#222B45",
  "color-basic-900": "#1A2138",
  "color-basic-1000": "#151A30",
  "color-basic-1100": "#101426",
  "color-basic-transparent-100": "rgba(143, 155, 179, 0.08)",
  "color-basic-transparent-200": "rgba(143, 155, 179, 0.16)",
  "color-basic-transparent-300": "rgba(143, 155, 179, 0.24)",
  "color-basic-transparent-400": "rgba(143, 155, 179, 0.32)",
  "color-basic-transparent-500": "rgba(143, 155, 179, 0.40)",
  "color-basic-transparent-600": "rgba(143, 155, 179, 0.48)",
  "color-basic-control-transparent-100": "rgba(255, 255, 255, 0.08)",
  "color-basic-control-transparent-200": "rgba(255, 255, 255, 0.16)",
  "color-basic-control-transparent-300": "rgba(255, 255, 255, 0.24)",
  "color-basic-control-transparent-400": "rgba(255, 255, 255, 0.32)",
  "color-basic-control-transparent-500": "rgba(255, 255, 255, 0.40)",
  "color-basic-control-transparent-600": "rgba(255, 255, 255, 0.48)",
  "color-basic-focus": "$color-basic-400",
  "color-basic-hover": "$color-basic-200",
  "color-basic-default": "$color-basic-300",
  "color-basic-active": "$color-basic-400",
  "color-basic-disabled": "$color-basic-transparent-300",
  "color-basic-focus-border": "$color-basic-500",
  "color-basic-hover-border": "$color-basic-hover",
  "color-basic-default-border": "$color-basic-default",
  "color-basic-active-border": "$color-basic-active",
  "color-basic-disabled-border": "$color-basic-disabled",
  "color-basic-transparent-focus": "$color-basic-transparent-300",
  "color-basic-transparent-hover": "$color-basic-transparent-200",
  "color-basic-transparent-default": "$color-basic-transparent-100",
  "color-basic-transparent-active": "$color-basic-transparent-300",
  "color-basic-transparent-disabled": "$color-basic-transparent-200",
  "color-basic-transparent-focus-border": "$color-basic-600",
  "color-basic-transparent-hover-border": "$color-basic-600",
  "color-basic-transparent-default-border": "$color-basic-600",
  "color-basic-transparent-active-border": "$color-basic-600",
  "color-basic-transparent-disabled-border": "$color-basic-transparent-300",
  "color-primary-focus": "$color-primary-600",
  "color-primary-hover": "$color-primary-400",
  "color-primary-default": "$color-primary-500",
  "color-primary-active": "$color-primary-600",
  "color-primary-disabled": "$color-basic-transparent-300",
  "color-primary-focus-border": "$color-primary-700",
  "color-primary-hover-border": "$color-primary-hover",
  "color-primary-default-border": "$color-primary-default",
  "color-primary-active-border": "$color-primary-active",
  "color-primary-disabled-border": "$color-primary-disabled",
  "color-primary-transparent-focus": "$color-primary-transparent-300",
  "color-primary-transparent-hover": "$color-primary-transparent-200",
  "color-primary-transparent-default": "$color-primary-transparent-100",
  "color-primary-transparent-active": "$color-primary-transparent-300",
  "color-primary-transparent-disabled": "$color-basic-transparent-200",
  "color-primary-transparent-focus-border": "$color-primary-500",
  "color-primary-transparent-hover-border": "$color-primary-500",
  "color-primary-transparent-default-border": "$color-primary-500",
  "color-primary-transparent-active-border": "$color-primary-500",
  "color-primary-transparent-disabled-border": "$color-basic-transparent-300",
  "color-success-focus": "$color-success-600",
  "color-success-hover": "$color-success-400",
  "color-success-default": "$color-success-500",
  "color-success-active": "$color-success-600",
  "color-success-disabled": "$color-basic-transparent-300",
  "color-success-focus-border": "$color-success-700",
  "color-success-hover-border": "$color-success-hover",
  "color-success-default-border": "$color-success-default",
  "color-success-active-border": "$color-success-active",
  "color-success-disabled-border": "$color-success-disabled",
  "color-success-transparent-focus": "$color-success-transparent-300",
  "color-success-transparent-hover": "$color-success-transparent-200",
  "color-success-transparent-default": "$color-success-transparent-100",
  "color-success-transparent-active": "$color-success-transparent-300",
  "color-success-transparent-disabled": "$color-basic-transparent-200",
  "color-success-transparent-focus-border": "$color-success-500",
  "color-success-transparent-hover-border": "$color-success-500",
  "color-success-transparent-default-border": "$color-success-500",
  "color-success-transparent-active-border": "$color-success-500",
  "color-success-transparent-disabled-border": "$color-basic-transparent-300",
  "color-info-focus": "$color-info-600",
  "color-info-hover": "$color-info-400",
  "color-info-default": "$color-info-500",
  "color-info-active": "$color-info-600",
  "color-info-disabled": "$color-basic-transparent-300",
  "color-info-focus-border": "$color-info-700",
  "color-info-hover-border": "$color-info-hover",
  "color-info-default-border": "$color-info-default",
  "color-info-active-border": "$color-info-active",
  "color-info-disabled-border": "$color-info-disabled",
  "color-info-transparent-focus": "$color-info-transparent-300",
  "color-info-transparent-hover": "$color-info-transparent-200",
  "color-info-transparent-default": "$color-info-transparent-100",
  "color-info-transparent-active": "$color-info-transparent-300",
  "color-info-transparent-disabled": "$color-basic-transparent-200",
  "color-info-transparent-focus-border": "$color-info-500",
  "color-info-transparent-hover-border": "$color-info-500",
  "color-info-transparent-default-border": "$color-info-500",
  "color-info-transparent-active-border": "$color-info-500",
  "color-info-transparent-disabled-border": "$color-basic-transparent-300",
  "color-warning-focus": "$color-warning-600",
  "color-warning-hover": "$color-warning-400",
  "color-warning-default": "$color-warning-500",
  "color-warning-active": "$color-warning-600",
  "color-warning-disabled": "$color-basic-transparent-300",
  "color-warning-focus-border": "$color-warning-700",
  "color-warning-hover-border": "$color-warning-hover",
  "color-warning-default-border": "$color-warning-default",
  "color-warning-active-border": "$color-warning-active",
  "color-warning-disabled-border": "$color-warning-disabled",
  "color-warning-transparent-focus": "$color-warning-transparent-300",
  "color-warning-transparent-hover": "$color-warning-transparent-200",
  "color-warning-transparent-default": "$color-warning-transparent-100",
  "color-warning-transparent-active": "$color-warning-transparent-300",
  "color-warning-transparent-disabled": "$color-basic-transparent-200",
  "color-warning-transparent-focus-border": "$color-warning-500",
  "color-warning-transparent-hover-border": "$color-warning-500",
  "color-warning-transparent-default-border": "$color-warning-500",
  "color-warning-transparent-active-border": "$color-warning-500",
  "color-warning-transparent-disabled-border": "$color-basic-transparent-300",
  "color-danger-focus": "$color-danger-600",
  "color-danger-hover": "$color-danger-400",
  "color-danger-default": "$color-danger-500",
  "color-danger-active": "$color-danger-600",
  "color-danger-disabled": "$color-basic-transparent-300",
  "color-danger-focus-border": "color-danger-700",
  "color-danger-hover-border": "$color-danger-hover",
  "color-danger-default-border": "$color-danger-default",
  "color-danger-active-border": "$color-danger-active",
  "color-danger-disabled-border": "$color-danger-disabled",
  "color-danger-transparent-focus": "$color-danger-transparent-300",
  "color-danger-transparent-hover": "$color-danger-transparent-200",
  "color-danger-transparent-default": "$color-danger-transparent-100",
  "color-danger-transparent-active": "$color-danger-transparent-300",
  "color-danger-transparent-disabled": "$color-basic-transparent-200",
  "color-danger-transparent-focus-border": "$color-danger-500",
  "color-danger-transparent-hover-border": "$color-danger-500",
  "color-danger-transparent-default-border": "$color-danger-500",
  "color-danger-transparent-active-border": "$color-danger-500",
  "color-danger-transparent-disabled-border": "$color-basic-transparent-300",
  "color-control-focus": "$color-basic-300",
  "color-control-hover": "$color-basic-200",
  "color-control-default": "$color-basic-100",
  "color-control-active": "$color-basic-300",
  "color-control-disabled": "$color-basic-transparent-300",
  "color-control-focus-border": "$color-basic-500",
  "color-control-hover-border": "$color-control-hover",
  "color-control-default-border": "$color-control-default",
  "color-control-active-border": "$color-control-active",
  "color-control-disabled-border": "$color-control-disabled",
  "color-control-transparent-focus": "$color-basic-control-transparent-300",
  "color-control-transparent-hover": "$color-basic-control-transparent-200",
  "color-control-transparent-default": "$color-basic-control-transparent-100",
  "color-control-transparent-active": "$color-basic-control-transparent-300",
  "color-control-transparent-disabled": "$color-basic-transparent-200",
  "color-control-transparent-focus-border": "$color-basic-100",
  "color-control-transparent-hover-border": "$color-basic-100",
  "color-control-transparent-default-border": "$color-basic-100",
  "color-control-transparent-active-border": "$color-basic-100",
  "color-control-transparent-disabled-border": "$color-basic-transparent-300",
  "background-basic-color-1": "$color-basic-100",
  "background-basic-color-2": "$color-basic-200",
  "background-basic-color-3": "$color-basic-300",
  "background-basic-color-4": "$color-basic-400",
  "background-alternative-color-1": "$color-basic-800",
  "background-alternative-color-2": "$color-basic-900",
  "background-alternative-color-3": "$color-basic-1000",
  "background-alternative-color-4": "$color-basic-1100",
  "border-basic-color-1": "$color-basic-100",
  "border-basic-color-2": "$color-basic-200",
  "border-basic-color-3": "$color-basic-300",
  "border-basic-color-4": "$color-basic-400",
  "border-basic-color-5": "$color-basic-500",
  "border-alternative-color-1": "$color-basic-800",
  "border-alternative-color-2": "$color-basic-900",
  "border-alternative-color-3": "$color-basic-1000",
  "border-alternative-color-4": "$color-basic-1100",
  "border-alternative-color-5": "$color-basic-1100",
  "border-primary-color-1": "$color-primary-500",
  "border-primary-color-2": "$color-primary-600",
  "border-primary-color-3": "$color-primary-700",
  "border-primary-color-4": "$color-primary-800",
  "border-primary-color-5": "$color-primary-900",
  "border-success-color-1": "$color-success-500",
  "border-success-color-2": "$color-success-600",
  "border-success-color-3": "$color-success-700",
  "border-success-color-4": "$color-success-800",
  "border-success-color-5": "$color-success-900",
  "border-info-color-1": "$color-info-500",
  "border-info-color-2": "$color-info-600",
  "border-info-color-3": "$color-info-700",
  "border-info-color-4": "$color-info-800",
  "border-info-color-5": "$color-info-900",
  "border-warning-color-1": "$color-warning-500",
  "border-warning-color-2": "$color-warning-600",
  "border-warning-color-3": "$color-warning-700",
  "border-warning-color-4": "$color-warning-800",
  "border-warning-color-5": "$color-warning-900",
  "border-danger-color-1": "$color-danger-500",
  "border-danger-color-2": "$color-danger-600",
  "border-danger-color-3": "$color-danger-700",
  "border-danger-color-4": "$color-danger-800",
  "border-danger-color-5": "$color-danger-900",
  "text-basic-color": "$color-basic-800",
  "text-alternate-color": "$color-basic-100",
  "text-control-color": "$color-basic-100",
  "text-disabled-color": "$color-basic-transparent-600",
  "text-hint-color": "$color-basic-600",
  "text-primary-color": "$color-primary-default",
  "text-primary-focus-color": "$color-primary-focus",
  "text-primary-hover-color": "$color-primary-hover",
  "text-primary-active-color": "$color-primary-active",
  "text-primary-disabled-color": "$color-primary-400",
  "text-success-color": "$color-success-default",
  "text-success-focus-color": "$color-success-focus",
  "text-success-hover-color": "$color-success-hover",
  "text-success-active-color": "$color-success-active",
  "text-success-disabled-color": "$color-success-400",
  "text-info-color": "$color-info-default",
  "text-info-focus-color": "$color-info-focus",
  "text-info-hover-color": "$color-info-hover",
  "text-info-active-color": "$color-info-active",
  "text-info-disabled-color": "$color-info-400",
  "text-warning-color": "$color-warning-default",
  "text-warning-focus-color": "$color-warning-focus",
  "text-warning-hover-color": "$color-warning-hover",
  "text-warning-active-color": "$color-warning-active",
  "text-warning-disabled-color": "$color-warning-400",
  "text-danger-color": "$color-danger-default",
  "text-danger-focus-color": "$color-danger-focus",
  "text-danger-hover-color": "$color-danger-hover",
  "text-danger-active-color": "$color-danger-active",
  "text-danger-disabled-color": "$color-danger-400",
  "outline-color": "$color-basic-transparent-200"
};
exports.darkTheme = {
  "color-primary-100": "#F2F6FF",
  "color-primary-200": "#D9E4FF",
  "color-primary-300": "#A6C1FF",
  "color-primary-400": "#598BFF",
  "color-primary-500": "#3366FF",
  "color-primary-600": "#274BDB",
  "color-primary-700": "#1A34B8",
  "color-primary-800": "#102694",
  "color-primary-900": "#091C7A",
  "color-primary-transparent-100": "rgba(51, 102, 255, 0.08)",
  "color-primary-transparent-200": "rgba(51, 102, 255, 0.16)",
  "color-primary-transparent-300": "rgba(51, 102, 255, 0.24)",
  "color-primary-transparent-400": "rgba(51, 102, 255, 0.32)",
  "color-primary-transparent-500": "rgba(51, 102, 255, 0.40)",
  "color-primary-transparent-600": "rgba(51, 102, 255, 0.48)",
  "color-success-100": "#EDFFF3",
  "color-success-200": "#B3FFD6",
  "color-success-300": "#8CFAC7",
  "color-success-400": "#51F0B0",
  "color-success-500": "#00E096",
  "color-success-600": "#00B383",
  "color-success-700": "#008F72",
  "color-success-800": "#007566",
  "color-success-900": "#00524C",
  "color-success-transparent-100": "rgba(0, 224, 150, 0.08)",
  "color-success-transparent-200": "rgba(0, 224, 150, 0.16)",
  "color-success-transparent-300": "rgba(0, 224, 150, 0.24)",
  "color-success-transparent-400": "rgba(0, 224, 150, 0.32)",
  "color-success-transparent-500": "rgba(0, 224, 150, 0.40)",
  "color-success-transparent-600": "rgba(0, 224, 150, 0.48)",
  "color-info-100": "#F2F8FF",
  "color-info-200": "#C7E2FF",
  "color-info-300": "#94CBFF",
  "color-info-400": "#42AAFF",
  "color-info-500": "#0095FF",
  "color-info-600": "#006FD6",
  "color-info-700": "#0057C2",
  "color-info-800": "#0041A8",
  "color-info-900": "#002885",
  "color-info-transparent-100": "rgba(0, 149, 255, 0.08)",
  "color-info-transparent-200": "rgba(0, 149, 255, 0.16)",
  "color-info-transparent-300": "rgba(0, 149, 255, 0.24)",
  "color-info-transparent-400": "rgba(0, 149, 255, 0.32)",
  "color-info-transparent-500": "rgba(0, 149, 255, 0.40)",
  "color-info-transparent-600": "rgba(0, 149, 255, 0.48)",
  "color-warning-100": "#FFFDF2",
  "color-warning-200": "#FFF1C2",
  "color-warning-300": "#FFE59E",
  "color-warning-400": "#FFC94D",
  "color-warning-500": "#FFAA00",
  "color-warning-600": "#DB8B00",
  "color-warning-700": "#B86E00",
  "color-warning-800": "#945400",
  "color-warning-900": "#703C00",
  "color-warning-transparent-100": "rgba(255, 170, 0, 0.08)",
  "color-warning-transparent-200": "rgba(255, 170, 0, 0.16)",
  "color-warning-transparent-300": "rgba(255, 170, 0, 0.24)",
  "color-warning-transparent-400": "rgba(255, 170, 0, 0.32)",
  "color-warning-transparent-500": "rgba(255, 170, 0, 0.40)",
  "color-warning-transparent-600": "rgba(255, 170, 0, 0.48)",
  "color-danger-100": "#FFF2F2",
  "color-danger-200": "#FFD6D9",
  "color-danger-300": "#FFA8B4",
  "color-danger-400": "#FF708D",
  "color-danger-500": "#FF3D71",
  "color-danger-600": "#DB2C66",
  "color-danger-700": "#B81D5B",
  "color-danger-800": "#94124E",
  "color-danger-900": "#700940",
  "color-danger-transparent-100": "rgba(255, 61, 113, 0.08)",
  "color-danger-transparent-200": "rgba(255, 61, 113, 0.16)",
  "color-danger-transparent-300": "rgba(255, 61, 113, 0.24)",
  "color-danger-transparent-400": "rgba(255, 61, 113, 0.32)",
  "color-danger-transparent-500": "rgba(255, 61, 113, 0.40)",
  "color-danger-transparent-600": "rgba(255, 61, 113, 0.48)",
  "color-basic-100": "#FFFFFF",
  "color-basic-200": "#F7F9FC",
  "color-basic-300": "#EDF1F7",
  "color-basic-400": "#E4E9F2",
  "color-basic-500": "#C5CEE0",
  "color-basic-600": "#8F9BB3",
  "color-basic-700": "#2E3A59",
  "color-basic-800": "#222B45",
  "color-basic-900": "#1A2138",
  "color-basic-1000": "#151A30",
  "color-basic-1100": "#101426",
  "color-basic-transparent-100": "rgba(143, 155, 179, 0.08)",
  "color-basic-transparent-200": "rgba(143, 155, 179, 0.16)",
  "color-basic-transparent-300": "rgba(143, 155, 179, 0.24)",
  "color-basic-transparent-400": "rgba(143, 155, 179, 0.32)",
  "color-basic-transparent-500": "rgba(143, 155, 179, 0.40)",
  "color-basic-transparent-600": "rgba(143, 155, 179, 0.48)",
  "color-basic-control-transparent-100": "rgba(255, 255, 255, 0.08)",
  "color-basic-control-transparent-200": "rgba(255, 255, 255, 0.16)",
  "color-basic-control-transparent-300": "rgba(255, 255, 255, 0.24)",
  "color-basic-control-transparent-400": "rgba(255, 255, 255, 0.32)",
  "color-basic-control-transparent-500": "rgba(255, 255, 255, 0.40)",
  "color-basic-control-transparent-600": "rgba(255, 255, 255, 0.48)",
  "color-basic-focus": "$color-basic-400",
  "color-basic-hover": "$color-basic-200",
  "color-basic-default": "$color-basic-300",
  "color-basic-active": "$color-basic-400",
  "color-basic-disabled": "$color-basic-transparent-300",
  "color-basic-focus-border": "$color-basic-500",
  "color-basic-hover-border": "$color-basic-hover",
  "color-basic-default-border": "$color-basic-default",
  "color-basic-active-border": "$color-basic-active",
  "color-basic-disabled-border": "$color-basic-disabled",
  "color-basic-transparent-focus": "$color-basic-transparent-300",
  "color-basic-transparent-hover": "$color-basic-transparent-200",
  "color-basic-transparent-default": "$color-basic-transparent-100",
  "color-basic-transparent-active": "$color-basic-transparent-300",
  "color-basic-transparent-disabled": "$color-basic-transparent-200",
  "color-basic-transparent-focus-border": "$color-basic-600",
  "color-basic-transparent-hover-border": "$color-basic-600",
  "color-basic-transparent-default-border": "$color-basic-600",
  "color-basic-transparent-active-border": "$color-basic-600",
  "color-basic-transparent-disabled-border": "$color-basic-transparent-300",
  "color-primary-focus": "$color-primary-600",
  "color-primary-hover": "$color-primary-400",
  "color-primary-default": "$color-primary-500",
  "color-primary-active": "$color-primary-600",
  "color-primary-disabled": "$color-basic-transparent-300",
  "color-primary-focus-border": "$color-primary-700",
  "color-primary-hover-border": "$color-primary-hover",
  "color-primary-default-border": "$color-primary-default",
  "color-primary-active-border": "$color-primary-active",
  "color-primary-disabled-border": "$color-primary-disabled",
  "color-primary-transparent-focus": "$color-primary-transparent-300",
  "color-primary-transparent-hover": "$color-primary-transparent-200",
  "color-primary-transparent-default": "$color-primary-transparent-100",
  "color-primary-transparent-active": "$color-primary-transparent-300",
  "color-primary-transparent-disabled": "$color-basic-transparent-200",
  "color-primary-transparent-focus-border": "$color-primary-500",
  "color-primary-transparent-hover-border": "$color-primary-500",
  "color-primary-transparent-default-border": "$color-primary-500",
  "color-primary-transparent-active-border": "$color-primary-500",
  "color-primary-transparent-disabled-border": "$color-basic-transparent-300",
  "color-success-focus": "$color-success-600",
  "color-success-hover": "$color-success-400",
  "color-success-default": "$color-success-500",
  "color-success-active": "$color-success-600",
  "color-success-disabled": "$color-basic-transparent-300",
  "color-success-focus-border": "$color-success-700",
  "color-success-hover-border": "$color-success-hover",
  "color-success-default-border": "$color-success-default",
  "color-success-active-border": "$color-success-active",
  "color-success-disabled-border": "$color-success-disabled",
  "color-success-transparent-focus": "$color-success-transparent-300",
  "color-success-transparent-hover": "$color-success-transparent-200",
  "color-success-transparent-default": "$color-success-transparent-100",
  "color-success-transparent-active": "$color-success-transparent-300",
  "color-success-transparent-disabled": "$color-basic-transparent-200",
  "color-success-transparent-focus-border": "$color-success-500",
  "color-success-transparent-hover-border": "$color-success-500",
  "color-success-transparent-default-border": "$color-success-500",
  "color-success-transparent-active-border": "$color-success-500",
  "color-success-transparent-disabled-border": "$color-basic-transparent-300",
  "color-info-focus": "$color-info-600",
  "color-info-hover": "$color-info-400",
  "color-info-default": "$color-info-500",
  "color-info-active": "$color-info-600",
  "color-info-disabled": "$color-basic-transparent-300",
  "color-info-focus-border": "$color-info-700",
  "color-info-hover-border": "$color-info-hover",
  "color-info-default-border": "$color-info-default",
  "color-info-active-border": "$color-info-active",
  "color-info-disabled-border": "$color-info-disabled",
  "color-info-transparent-focus": "$color-info-transparent-300",
  "color-info-transparent-hover": "$color-info-transparent-200",
  "color-info-transparent-default": "$color-info-transparent-100",
  "color-info-transparent-active": "$color-info-transparent-300",
  "color-info-transparent-disabled": "$color-basic-transparent-200",
  "color-info-transparent-focus-border": "$color-info-500",
  "color-info-transparent-hover-border": "$color-info-500",
  "color-info-transparent-default-border": "$color-info-500",
  "color-info-transparent-active-border": "$color-info-500",
  "color-info-transparent-disabled-border": "$color-basic-transparent-300",
  "color-warning-focus": "$color-warning-600",
  "color-warning-hover": "$color-warning-400",
  "color-warning-default": "$color-warning-500",
  "color-warning-active": "$color-warning-600",
  "color-warning-disabled": "$color-basic-transparent-300",
  "color-warning-focus-border": "$color-warning-700",
  "color-warning-hover-border": "$color-warning-hover",
  "color-warning-default-border": "$color-warning-default",
  "color-warning-active-border": "$color-warning-active",
  "color-warning-disabled-border": "$color-warning-disabled",
  "color-warning-transparent-focus": "$color-warning-transparent-300",
  "color-warning-transparent-hover": "$color-warning-transparent-200",
  "color-warning-transparent-default": "$color-warning-transparent-100",
  "color-warning-transparent-active": "$color-warning-transparent-300",
  "color-warning-transparent-disabled": "$color-basic-transparent-200",
  "color-warning-transparent-focus-border": "$color-warning-500",
  "color-warning-transparent-hover-border": "$color-warning-500",
  "color-warning-transparent-default-border": "$color-warning-500",
  "color-warning-transparent-active-border": "$color-warning-500",
  "color-warning-transparent-disabled-border": "$color-basic-transparent-300",
  "color-danger-focus": "$color-danger-600",
  "color-danger-hover": "$color-danger-400",
  "color-danger-default": "$color-danger-500",
  "color-danger-active": "$color-danger-600",
  "color-danger-disabled": "$color-basic-transparent-300",
  "color-danger-focus-border": "color-danger-700",
  "color-danger-hover-border": "$color-danger-hover",
  "color-danger-default-border": "$color-danger-default",
  "color-danger-active-border": "$color-danger-active",
  "color-danger-disabled-border": "$color-danger-disabled",
  "color-danger-transparent-focus": "$color-danger-transparent-300",
  "color-danger-transparent-hover": "$color-danger-transparent-200",
  "color-danger-transparent-default": "$color-danger-transparent-100",
  "color-danger-transparent-active": "$color-danger-transparent-300",
  "color-danger-transparent-disabled": "$color-basic-transparent-200",
  "color-danger-transparent-focus-border": "$color-danger-500",
  "color-danger-transparent-hover-border": "$color-danger-500",
  "color-danger-transparent-default-border": "$color-danger-500",
  "color-danger-transparent-active-border": "$color-danger-500",
  "color-danger-transparent-disabled-border": "$color-basic-transparent-300",
  "color-control-focus": "$color-basic-300",
  "color-control-hover": "$color-basic-200",
  "color-control-default": "$color-basic-100",
  "color-control-active": "$color-basic-300",
  "color-control-disabled": "$color-basic-transparent-300",
  "color-control-focus-border": "$color-basic-500",
  "color-control-hover-border": "$color-control-hover",
  "color-control-default-border": "$color-control-default",
  "color-control-active-border": "$color-control-active",
  "color-control-disabled-border": "$color-control-disabled",
  "color-control-transparent-focus": "$color-basic-control-transparent-300",
  "color-control-transparent-hover": "$color-basic-control-transparent-200",
  "color-control-transparent-default": "$color-basic-control-transparent-100",
  "color-control-transparent-active": "$color-basic-control-transparent-300",
  "color-control-transparent-disabled": "$color-basic-transparent-200",
  "color-control-transparent-focus-border": "$color-basic-100",
  "color-control-transparent-hover-border": "$color-basic-100",
  "color-control-transparent-default-border": "$color-basic-100",
  "color-control-transparent-active-border": "$color-basic-100",
  "color-control-transparent-disabled-border": "$color-basic-transparent-300",
  "background-basic-color-1": "$color-basic-800",
  "background-basic-color-2": "$color-basic-900",
  "background-basic-color-3": "$color-basic-1000",
  "background-basic-color-4": "$color-basic-1100",
  "background-alternative-color-1": "$color-basic-100",
  "background-alternative-color-2": "$color-basic-200",
  "background-alternative-color-3": "$color-basic-300",
  "background-alternative-color-4": "$color-basic-400",
  "border-basic-color-1": "$color-basic-800",
  "border-basic-color-2": "$color-basic-900",
  "border-basic-color-3": "$color-basic-1000",
  "border-basic-color-4": "$color-basic-1100",
  "border-basic-color-5": "$color-basic-1100",
  "border-alternative-color-1": "$color-basic-100",
  "border-alternative-color-2": "$color-basic-200",
  "border-alternative-color-3": "$color-basic-300",
  "border-alternative-color-4": "$color-basic-400",
  "border-alternative-color-5": "$color-basic-500",
  "border-primary-color-1": "$color-primary-500",
  "border-primary-color-2": "$color-primary-600",
  "border-primary-color-3": "$color-primary-700",
  "border-primary-color-4": "$color-primary-800",
  "border-primary-color-5": "$color-primary-900",
  "border-success-color-1": "$color-success-500",
  "border-success-color-2": "$color-success-600",
  "border-success-color-3": "$color-success-700",
  "border-success-color-4": "$color-success-800",
  "border-success-color-5": "$color-success-900",
  "border-info-color-1": "$color-info-500",
  "border-info-color-2": "$color-info-600",
  "border-info-color-3": "$color-info-700",
  "border-info-color-4": "$color-info-800",
  "border-info-color-5": "$color-info-900",
  "border-warning-color-1": "$color-warning-500",
  "border-warning-color-2": "$color-warning-600",
  "border-warning-color-3": "$color-warning-700",
  "border-warning-color-4": "$color-warning-800",
  "border-warning-color-5": "$color-warning-900",
  "border-danger-color-1": "$color-danger-500",
  "border-danger-color-2": "$color-danger-600",
  "border-danger-color-3": "$color-danger-700",
  "border-danger-color-4": "$color-danger-800",
  "border-danger-color-5": "$color-danger-900",
  "text-basic-color": "$color-basic-100",
  "text-alternate-color": "$color-basic-900",
  "text-control-color": "$color-basic-100",
  "text-disabled-color": "$color-basic-transparent-600",
  "text-hint-color": "$color-basic-600",
  "text-primary-color": "$color-primary-default",
  "text-primary-focus-color": "$color-primary-focus",
  "text-primary-hover-color": "$color-primary-hover",
  "text-primary-active-color": "$color-primary-active",
  "text-primary-disabled-color": "$color-primary-400",
  "text-success-color": "$color-success-default",
  "text-success-focus-color": "$color-success-focus",
  "text-success-hover-color": "$color-success-hover",
  "text-success-active-color": "$color-success-active",
  "text-success-disabled-color": "$color-success-400",
  "text-info-color": "$color-info-default",
  "text-info-focus-color": "$color-info-focus",
  "text-info-hover-color": "$color-info-hover",
  "text-info-active-color": "$color-info-active",
  "text-info-disabled-color": "$color-info-400",
  "text-warning-color": "$color-warning-default",
  "text-warning-focus-color": "$color-warning-focus",
  "text-warning-hover-color": "$color-warning-hover",
  "text-warning-active-color": "$color-warning-active",
  "text-warning-disabled-color": "$color-warning-400",
  "text-danger-color": "$color-danger-default",
  "text-danger-focus-color": "$color-danger-focus",
  "text-danger-hover-color": "$color-danger-hover",
  "text-danger-active-color": "$color-danger-active",
  "text-danger-disabled-color": "$color-danger-400",
  "outline-color": "$color-basic-700"
};

/***/ }),

/***/ 1:
/*!*********************************************************************************************************************************************************!*\
  !*** multi (webpack)/hot/dev-server.js /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/react-dev-utils/webpackHotDevClient.js ./src/index.tsx ***!
  \*********************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/webpack/hot/dev-server.js */"../../node_modules/webpack/hot/dev-server.js");
__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/react-dev-utils/webpackHotDevClient.js */"../../node_modules/react-dev-utils/webpackHotDevClient.js");
module.exports = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/src/index.tsx */"./src/index.tsx");


/***/ })

},[[1,"runtime-main",1]]]);
//# sourceMappingURL=main.chunk.js.map