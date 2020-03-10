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

/***/ "./build.shim.rnw.tsx":
/*!****************************!*\
  !*** ./build.shim.rnw.tsx ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _interopRequireDefault = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../node_modules/@babel/runtime/helpers/interopRequireDefault.js");

var _interopRequireWildcard = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireWildcard */ "../../node_modules/@babel/runtime/helpers/interopRequireWildcard.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  TouchableOpacity: true,
  TouchableWithoutFeedback: true,
  TouchableNativeFeedback: true,
  TouchableHighlight: true
};
exports.TouchableHighlight = exports.TouchableNativeFeedback = exports.TouchableWithoutFeedback = exports.TouchableOpacity = void 0;

var _extends2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/extends */ "../../node_modules/@babel/runtime/helpers/esm/extends.js"));

var _objectWithoutProperties2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/objectWithoutProperties */ "../../node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js"));

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var ReactNativeWeb = _interopRequireWildcard(__webpack_require__(/*! react-native-web */ "../../node_modules/react-native-web/dist/index.js"));

Object.keys(ReactNativeWeb).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return ReactNativeWeb[key];
    }
  });
});
var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/build.shim.rnw.tsx";

var fixTouchable = function fixTouchable(Touchable) {
  return function (props) {
    var onPress = props.onPress,
        restProps = (0, _objectWithoutProperties2.default)(props, ["onPress"]);
    var onClickCalled = (0, _react.useRef)(false);
    var onClick = onPress ? function (e) {
      onClickCalled.current = true;
      onPress(e);
    } : undefined;
    var onPressAlternative = onPress ? function (e) {
      setTimeout(function () {
        if (!onClickCalled.current) {
          onPress(e);
        }
      }, 100);
    } : undefined;
    return _react.default.createElement(Touchable, (0, _extends2.default)({}, restProps, {
      onPress: onPressAlternative,
      onClick: onClick,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 24
      },
      __self: this
    }));
  };
};

var TouchableOpacity = fixTouchable(ReactNativeWeb.TouchableOpacity);
exports.TouchableOpacity = TouchableOpacity;
var TouchableWithoutFeedback = fixTouchable(ReactNativeWeb.TouchableWithoutFeedback);
exports.TouchableWithoutFeedback = TouchableWithoutFeedback;
var TouchableNativeFeedback = fixTouchable(ReactNativeWeb.TouchableNativeFeedback);
exports.TouchableNativeFeedback = TouchableNativeFeedback;
var TouchableHighlight = fixTouchable(ReactNativeWeb.TouchableHighlight);
exports.TouchableHighlight = TouchableHighlight;

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
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _interopRequireWildcard = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireWildcard */ "../../node_modules/@babel/runtime/helpers/interopRequireWildcard.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.App = void 0;

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _stack = __webpack_require__(/*! @react-navigation/stack */ "../../node_modules/@react-navigation/stack/lib/module/index.js");

var _component = __webpack_require__(/*! ../screen/component */ "./src/screen/component/index.ts");

var _consent = __webpack_require__(/*! ../screen/consent */ "./src/screen/consent.tsx");

var _error = __webpack_require__(/*! ../screen/error */ "./src/screen/error.tsx");

var _routes = __webpack_require__(/*! ./routes */ "./src/app/routes.ts");

var _options = __webpack_require__(/*! ./options */ "./src/app/options.tsx");

var _state = __webpack_require__(/*! ./state */ "./src/app/state.tsx");

var _navigation = __webpack_require__(/*! ./navigation */ "./src/app/navigation.tsx");

var _theme = __webpack_require__(/*! ./theme */ "./src/app/theme.tsx");

var _find_email = __webpack_require__(/*! ../screen/find_email.index */ "./src/screen/find_email.index.tsx");

var _find_email2 = __webpack_require__(/*! ../screen/find_email.end */ "./src/screen/find_email.end.tsx");

var _login = __webpack_require__(/*! ../screen/login.check_password */ "./src/screen/login.check_password.tsx");

var _login2 = __webpack_require__(/*! ../screen/login.index */ "./src/screen/login.index.tsx");

var _logout = __webpack_require__(/*! ../screen/logout.end */ "./src/screen/logout.end.tsx");

var _logout2 = __webpack_require__(/*! ../screen/logout.index */ "./src/screen/logout.index.tsx");

var _register = __webpack_require__(/*! ../screen/register.detail */ "./src/screen/register.detail.tsx");

var _register2 = __webpack_require__(/*! ../screen/register.end */ "./src/screen/register.end.tsx");

var _register3 = __webpack_require__(/*! ../screen/register.index */ "./src/screen/register.index.tsx");

var _reset_password = __webpack_require__(/*! ../screen/reset_password.end */ "./src/screen/reset_password.end.tsx");

var _reset_password2 = __webpack_require__(/*! ../screen/reset_password.index */ "./src/screen/reset_password.index.tsx");

var _reset_password3 = __webpack_require__(/*! ../screen/reset_password.set */ "./src/screen/reset_password.set.tsx");

var _verify_email = __webpack_require__(/*! ../screen/verify_email.end */ "./src/screen/verify_email.end.tsx");

var _verify_email2 = __webpack_require__(/*! ../screen/verify_email.index */ "./src/screen/verify_email.index.tsx");

var _verify_email3 = __webpack_require__(/*! ../screen/verify_email.verify */ "./src/screen/verify_email.verify.tsx");

var _verify_phone = __webpack_require__(/*! ../screen/verify_phone.end */ "./src/screen/verify_phone.end.tsx");

var _verify_phone2 = __webpack_require__(/*! ../screen/verify_phone.index */ "./src/screen/verify_phone.index.tsx");

var _verify_phone3 = __webpack_require__(/*! ../screen/verify_phone.verify */ "./src/screen/verify_phone.verify.tsx");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/src/app/app.tsx";

var App = function App() {
  return _react.default.createElement(_options.AppOptionsProvider, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 34
    },
    __self: this
  }, _react.default.createElement(_theme.ApplicationThemeProvider, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 35
    },
    __self: this
  }, _react.default.createElement(_state.AppStateProvider, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 36
    },
    __self: this
  }, _react.default.createElement(_navigation.AppNavigationProvider, {
    routeConfig: _routes.routeConfig,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 37
    },
    __self: this
  }, _react.default.createElement(AppTabs, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 38
    },
    __self: this
  })))));
};

exports.App = App;
var NavOptionsProvider = (0, _react.createContext)(undefined);

var useNavOptions = function useNavOptions() {
  return (0, _react.useContext)(NavOptionsProvider);
};

var RootStack = (0, _stack.createStackNavigator)();

var AppTabs = function AppTabs() {
  var backgroundColor = (0, _component.useThemePalette)()["background-basic-color-1"];
  var navOptions = {
    headerShown: false,
    cardStyle: {
      backgroundColor: backgroundColor
    },
    gestureEnabled: false
  };
  return _react.default.createElement(NavOptionsProvider.Provider, {
    value: navOptions,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 68
    },
    __self: this
  }, _react.default.createElement(RootStack.Navigator, {
    screenOptions: navOptions,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 69
    },
    __self: this
  }, _react.default.createElement(RootStack.Screen, {
    name: "error.stack",
    component: ErrorStackScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 72
    },
    __self: this
  }), _react.default.createElement(RootStack.Screen, {
    name: "consent.stack",
    component: ConsentStackScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 76
    },
    __self: this
  }), _react.default.createElement(RootStack.Screen, {
    name: "login.stack",
    component: LoginStackScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 80
    },
    __self: this
  }), _react.default.createElement(RootStack.Screen, {
    name: "find_email.stack",
    component: FindEmailStackScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 84
    },
    __self: this
  }), _react.default.createElement(RootStack.Screen, {
    name: "reset_password.stack",
    component: ResetPasswordStackScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 88
    },
    __self: this
  }), _react.default.createElement(RootStack.Screen, {
    name: "register.stack",
    component: RegisterStackScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 92
    },
    __self: this
  }), _react.default.createElement(RootStack.Screen, {
    name: "logout.stack",
    component: LogoutStackScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 96
    },
    __self: this
  }), _react.default.createElement(RootStack.Screen, {
    name: "verify_phone.stack",
    component: VerifyPhoneStackScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 100
    },
    __self: this
  }), _react.default.createElement(RootStack.Screen, {
    name: "verify_email.stack",
    component: VerifyEmailStackScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 104
    },
    __self: this
  })));
};

var ErrorStack = (0, _stack.createStackNavigator)();

var ErrorStackScreen = function ErrorStackScreen() {
  return _react.default.createElement(ErrorStack.Navigator, {
    screenOptions: useNavOptions(),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 115
    },
    __self: this
  }, _react.default.createElement(ErrorStack.Screen, {
    name: "error.index",
    component: _error.ErrorScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 118
    },
    __self: this
  }));
};

var ConsentStack = (0, _stack.createStackNavigator)();

var ConsentStackScreen = function ConsentStackScreen() {
  return _react.default.createElement(ConsentStack.Navigator, {
    screenOptions: useNavOptions(),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 127
    },
    __self: this
  }, _react.default.createElement(ConsentStack.Screen, {
    name: "consent.index",
    component: _consent.ConsentScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 130
    },
    __self: this
  }));
};

var LoginStack = (0, _stack.createStackNavigator)();

var LoginStackScreen = function LoginStackScreen() {
  return _react.default.createElement(LoginStack.Navigator, {
    screenOptions: useNavOptions(),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 139
    },
    __self: this
  }, _react.default.createElement(LoginStack.Screen, {
    name: "login.check_password",
    component: _login.LoginCheckPasswordScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 142
    },
    __self: this
  }), _react.default.createElement(LoginStack.Screen, {
    name: "login.index",
    component: _login2.LoginIndexScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 146
    },
    __self: this
  }));
};

var LogoutStack = (0, _stack.createStackNavigator)();

var LogoutStackScreen = function LogoutStackScreen() {
  return _react.default.createElement(LogoutStack.Navigator, {
    screenOptions: useNavOptions(),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 155
    },
    __self: this
  }, _react.default.createElement(LogoutStack.Screen, {
    name: "logout.end",
    component: _logout.LogoutEndScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 158
    },
    __self: this
  }), _react.default.createElement(LogoutStack.Screen, {
    name: "logout.index",
    component: _logout2.LogoutIndexScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 162
    },
    __self: this
  }));
};

var FindEmailStack = (0, _stack.createStackNavigator)();

var FindEmailStackScreen = function FindEmailStackScreen() {
  return _react.default.createElement(FindEmailStack.Navigator, {
    screenOptions: useNavOptions(),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 171
    },
    __self: this
  }, _react.default.createElement(FindEmailStack.Screen, {
    name: "find_email.index",
    component: _find_email.FindEmailIndexScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 174
    },
    __self: this
  }), _react.default.createElement(FindEmailStack.Screen, {
    name: "find_email.end",
    component: _find_email2.FindEmailEndScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 178
    },
    __self: this
  }));
};

var ResetPasswordStack = (0, _stack.createStackNavigator)();

var ResetPasswordStackScreen = function ResetPasswordStackScreen() {
  return _react.default.createElement(ResetPasswordStack.Navigator, {
    screenOptions: useNavOptions(),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 187
    },
    __self: this
  }, _react.default.createElement(ResetPasswordStack.Screen, {
    name: "reset_password.set",
    component: _reset_password3.ResetPasswordSetScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 190
    },
    __self: this
  }), _react.default.createElement(ResetPasswordStack.Screen, {
    name: "reset_password.end",
    component: _reset_password.ResetPasswordEndScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 194
    },
    __self: this
  }), _react.default.createElement(ResetPasswordStack.Screen, {
    name: "reset_password.index",
    component: _reset_password2.ResetPasswordIndexScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 198
    },
    __self: this
  }));
};

var RegisterStack = (0, _stack.createStackNavigator)();

var RegisterStackScreen = function RegisterStackScreen() {
  return _react.default.createElement(RegisterStack.Navigator, {
    screenOptions: useNavOptions(),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 207
    },
    __self: this
  }, _react.default.createElement(RegisterStack.Screen, {
    name: "register.detail",
    component: _register.RegisterDetailScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 210
    },
    __self: this
  }), _react.default.createElement(RegisterStack.Screen, {
    name: "register.end",
    component: _register2.RegisterEndScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 214
    },
    __self: this
  }), _react.default.createElement(RegisterStack.Screen, {
    name: "register.index",
    component: _register3.RegisterIndexScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 218
    },
    __self: this
  }));
};

var VerifyPhoneStack = (0, _stack.createStackNavigator)();

var VerifyPhoneStackScreen = function VerifyPhoneStackScreen() {
  return _react.default.createElement(VerifyPhoneStack.Navigator, {
    screenOptions: useNavOptions(),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 227
    },
    __self: this
  }, _react.default.createElement(VerifyPhoneStack.Screen, {
    name: "verify_phone.verify",
    component: _verify_phone3.VerifyPhoneVerifyScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 230
    },
    __self: this
  }), _react.default.createElement(VerifyPhoneStack.Screen, {
    name: "verify_phone.end",
    component: _verify_phone.VerifyPhoneEndScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 234
    },
    __self: this
  }), _react.default.createElement(VerifyPhoneStack.Screen, {
    name: "verify_phone.index",
    component: _verify_phone2.VerifyPhoneIndexScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 238
    },
    __self: this
  }));
};

var VerifyEmailStack = (0, _stack.createStackNavigator)();

var VerifyEmailStackScreen = function VerifyEmailStackScreen() {
  return _react.default.createElement(VerifyEmailStack.Navigator, {
    screenOptions: useNavOptions(),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 247
    },
    __self: this
  }, _react.default.createElement(VerifyEmailStack.Screen, {
    name: "verify_email.verify",
    component: _verify_email3.VerifyEmailVerifyScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 250
    },
    __self: this
  }), _react.default.createElement(VerifyEmailStack.Screen, {
    name: "verify_email.end",
    component: _verify_email.VerifyEmailEndScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 254
    },
    __self: this
  }), _react.default.createElement(VerifyEmailStack.Screen, {
    name: "verify_email.index",
    component: _verify_email2.VerifyEmailIndexScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 258
    },
    __self: this
  }));
};

/***/ }),

/***/ "./src/app/index.ts":
/*!**************************!*\
  !*** ./src/app/index.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "useAppOptions", {
  enumerable: true,
  get: function get() {
    return _options.useAppOptions;
  }
});
Object.defineProperty(exports, "useAppState", {
  enumerable: true,
  get: function get() {
    return _state.useAppState;
  }
});
Object.defineProperty(exports, "useNavigation", {
  enumerable: true,
  get: function get() {
    return _navigation.useNavigation;
  }
});
Object.defineProperty(exports, "App", {
  enumerable: true,
  get: function get() {
    return _app.App;
  }
});

var _options = __webpack_require__(/*! ./options */ "./src/app/options.tsx");

var _state = __webpack_require__(/*! ./state */ "./src/app/state.tsx");

var _navigation = __webpack_require__(/*! ./navigation */ "./src/app/navigation.tsx");

var _app = __webpack_require__(/*! ./app */ "./src/app/app.tsx");

/***/ }),

/***/ "./src/app/navigation.tsx":
/*!********************************!*\
  !*** ./src/app/navigation.tsx ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _interopRequireDefault = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../node_modules/@babel/runtime/helpers/interopRequireDefault.js");

var _interopRequireWildcard = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireWildcard */ "../../node_modules/@babel/runtime/helpers/interopRequireWildcard.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useNavigation = useNavigation;
exports.AppNavigationProvider = void 0;

var _toConsumableArray2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/toConsumableArray */ "../../node_modules/@babel/runtime/helpers/esm/toConsumableArray.js"));

var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/slicedToArray */ "../../node_modules/@babel/runtime/helpers/esm/slicedToArray.js"));

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _core = __webpack_require__(/*! @react-navigation/core */ "../../node_modules/@react-navigation/core/lib/module/index.js");

var _native = __webpack_require__(/*! @react-navigation/native */ "../../node_modules/@react-navigation/native/lib/module/index.js");

var _reactNative = __webpack_require__(/*! react-native */ "./build.shim.rnw.tsx");

var _hook = __webpack_require__(/*! ../hook */ "./src/hook.ts");

var _state = __webpack_require__(/*! ./state */ "./src/app/state.tsx");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/src/app/navigation.tsx";

var AppNavigationProvider = function AppNavigationProvider(_ref) {
  var routeConfig = _ref.routeConfig,
      children = _ref.children;

  var _useAppState = (0, _state.useAppState)(),
      _useAppState2 = (0, _slicedToArray2.default)(_useAppState, 1),
      appState = _useAppState2[0];

  var ref = (0, _react.useRef)();
  var deepLinking = (0, _native.useLinking)(ref, {
    prefixes: [window.location.origin],
    config: routeConfig,
    getStateFromPath: (0, _react.useCallback)(function (path, options) {
      var navState = (0, _core.getStateFromPath)(path, options);

      if (navState) {
        if (appState.error) {
          navState.routes[0].name = "error";
          console.error("appState.error", appState);
        }

        console.debug("nav state update:", navState);
      }

      return navState;
    }, [appState])
  });

  var _useState = (0, _react.useState)(null),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      initialState = _useState2[0],
      setInitialState = _useState2[1];

  var _useState3 = (0, _react.useState)(true),
      _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
      loading = _useState4[0],
      setLoading = _useState4[1];

  (0, _react.useEffect)(function () {
    deepLinking.getInitialState().then(function (nav) {
      return setInitialState(nav);
    }, function (err) {
      return console.error(err);
    }).finally(function () {
      return setLoading(false);
    });
  }, []);

  if (loading) {
    return null;
  }

  return _react.default.createElement(_native.NavigationContainer, {
    initialState: initialState,
    ref: ref,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 50
    },
    __self: this
  }, _react.default.createElement(_reactNative.View, {
    nativeID: "nav-container",
    style: {
      alignSelf: "center"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 54
    },
    __self: this
  }, children));
};

exports.AppNavigationProvider = AppNavigationProvider;

function useNavigation() {
  var route = (0, _native.useRoute)();
  var nav = (0, _core.useNavigation)();
  var navigate = nav.navigate;

  if (!navigate.__enhanced) {
    nav.navigate = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      includeLocaleQuery(args, route);
      navigate.apply(void 0, (0, _toConsumableArray2.default)(args));

      if (args[1] && args[1].screen && nav.dangerouslyGetState().routes.every(function (r) {
        return r.name !== args[1].screen;
      })) {
        navigate.apply(void 0, (0, _toConsumableArray2.default)(args));
      }
    };

    nav.navigate.__enhanced = true;
  }

  var _useAppOptions = (0, _hook.useAppOptions)(),
      _useAppOptions2 = (0, _slicedToArray2.default)(_useAppOptions, 1),
      appOptions = _useAppOptions2[0];

  if (appOptions.dev) {
    window.__APP_DEV__.nav = nav;
  }

  if (!route.params) route.params = {};
  return {
    nav: nav,
    route: route
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
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _interopRequireDefault = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../node_modules/@babel/runtime/helpers/interopRequireDefault.js");

var _interopRequireWildcard = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireWildcard */ "../../node_modules/@babel/runtime/helpers/interopRequireWildcard.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useAppOptions = useAppOptions;
exports.AppOptionsProvider = exports.AppOptionsContext = void 0;

var _objectSpread2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/objectSpread2 */ "../../node_modules/@babel/runtime/helpers/esm/objectSpread2.js"));

var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/classCallCheck */ "../../node_modules/@babel/runtime/helpers/esm/classCallCheck.js"));

var _createClass2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/createClass */ "../../node_modules/@babel/runtime/helpers/esm/createClass.js"));

var _possibleConstructorReturn2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn */ "../../node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js"));

var _getPrototypeOf3 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/getPrototypeOf */ "../../node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js"));

var _inherits2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/inherits */ "../../node_modules/@babel/runtime/helpers/esm/inherits.js"));

var _ = _interopRequireWildcard(__webpack_require__(/*! lodash */ "../../node_modules/lodash/lodash.js"));

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _inject = __webpack_require__(/*! ../../inject */ "./inject.js");

var _theme = __webpack_require__(/*! ../../theme */ "./theme.js");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/src/app/options.tsx";
var AppOptionsContext = (0, _react.createContext)([]);
exports.AppOptionsContext = AppOptionsContext;

function useAppOptions() {
  return (0, _react.useContext)(AppOptionsContext);
}

var AppOptionsProvider = function (_React$Component) {
  (0, _inherits2.default)(AppOptionsProvider, _React$Component);

  function AppOptionsProvider() {
    var _getPrototypeOf2;

    var _this;

    (0, _classCallCheck2.default)(this, AppOptionsProvider);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = (0, _possibleConstructorReturn2.default)(this, (_getPrototypeOf2 = (0, _getPrototypeOf3.default)(AppOptionsProvider)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.state = _.defaultsDeep((0, _objectSpread2.default)({}, (0, _inject.getAppOptions)(), {
      dev: (0, _inject.getAppDev)()
    }), {
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
        light: _theme.lightTheme,
        dark: _theme.darkTheme
      }
    });
    return _this;
  }

  (0, _createClass2.default)(AppOptionsProvider, [{
    key: "render",
    value: function render() {
      console.debug("app options update:", this.state);
      return _react.default.createElement(AppOptionsContext.Provider, {
        value: [this.state, this.setState.bind(this)],
        __source: {
          fileName: _jsxFileName,
          lineNumber: 42
        },
        __self: this
      }, this.props.children);
    }
  }]);
  return AppOptionsProvider;
}(_react.default.Component);

exports.AppOptionsProvider = AppOptionsProvider;

/***/ }),

/***/ "./src/app/routes.ts":
/*!***************************!*\
  !*** ./src/app/routes.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.routeConfig = void 0;

var _inject = __webpack_require__(/*! ../../inject */ "./inject.js");

var prefix = (0, _inject.getAppPrefix)();
prefix = prefix.startsWith("/") ? prefix.substr(1) : prefix;
var routeConfig = {
  "login.stack": {
    screens: {
      "login.check_password": prefix + "/login/check_password",
      "login.index": prefix + "/login"
    }
  },
  "consent.stack": {
    screens: {
      "consent.index": prefix + "/consent"
    }
  },
  "logout.stack": {
    screens: {
      "logout.end": prefix + "/session/end/success",
      "logout.index": prefix + "/session/end"
    }
  },
  "find_email.stack": {
    screens: {
      "find_email.end": prefix + "/find_email/end",
      "find_email.index": prefix + "/find_email"
    }
  },
  "reset_password.stack": {
    screens: {
      "reset_password.end": prefix + "/reset_password/end",
      "reset_password.set": prefix + "/reset_password/set",
      "reset_password.index": prefix + "/reset_password"
    }
  },
  "register.stack": {
    screens: {
      "register.end": prefix + "/register/end",
      "register.detail": prefix + "/register/detail",
      "register.index": prefix + "/register"
    }
  },
  "verify_phone.stack": {
    screens: {
      "verify_phone.end": prefix + "/verify_phone/end",
      "verify_phone.verify": prefix + "/verify_phone/verify",
      "verify_phone.index": prefix + "/verify_phone"
    }
  },
  "verify_email.stack": {
    screens: {
      "verify_email.end": prefix + "/verify_email/end",
      "verify_email.verify": prefix + "/verify_email/verify",
      "verify_email.index": prefix + "/verify_email"
    }
  },
  "error.stack": {
    screens: {
      "error.index": ""
    }
  }
};
exports.routeConfig = routeConfig;

/***/ }),

/***/ "./src/app/state.tsx":
/*!***************************!*\
  !*** ./src/app/state.tsx ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _interopRequireDefault = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../node_modules/@babel/runtime/helpers/interopRequireDefault.js");

var _interopRequireWildcard = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireWildcard */ "../../node_modules/@babel/runtime/helpers/interopRequireWildcard.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useAppState = useAppState;
exports.AppStateProvider = exports.AppStateContext = void 0;

var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/slicedToArray */ "../../node_modules/@babel/runtime/helpers/esm/slicedToArray.js"));

var _regenerator = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/regenerator */ "../../node_modules/@babel/runtime/regenerator/index.js"));

var _objectSpread2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/objectSpread2 */ "../../node_modules/@babel/runtime/helpers/esm/objectSpread2.js"));

var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/classCallCheck */ "../../node_modules/@babel/runtime/helpers/esm/classCallCheck.js"));

var _createClass2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/createClass */ "../../node_modules/@babel/runtime/helpers/esm/createClass.js"));

var _possibleConstructorReturn2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn */ "../../node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js"));

var _getPrototypeOf3 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/getPrototypeOf */ "../../node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js"));

var _inherits2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/inherits */ "../../node_modules/@babel/runtime/helpers/esm/inherits.js"));

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _error = __webpack_require__(/*! ../screen/error */ "./src/screen/error.tsx");

var _inject = __webpack_require__(/*! ../../inject */ "./inject.js");

var _options = __webpack_require__(/*! ./options */ "./src/app/options.tsx");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/src/app/state.tsx";
var AppStateContext = (0, _react.createContext)([]);
exports.AppStateContext = AppStateContext;

function useAppState() {
  return (0, _react.useContext)(AppStateContext);
}

var AppStateProvider = function (_React$Component) {
  (0, _inherits2.default)(AppStateProvider, _React$Component);

  function AppStateProvider() {
    var _getPrototypeOf2;

    var _this;

    (0, _classCallCheck2.default)(this, AppStateProvider);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = (0, _possibleConstructorReturn2.default)(this, (_getPrototypeOf2 = (0, _getPrototypeOf3.default)(AppStateProvider)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.state = {
      error: null,
      appState: (0, _inject.getInitialAppState)()
    };

    _this.dispatch = function _callee(name) {
      var userPayload,
          routes,
          route,
          err,
          url,
          _route$synchronous,
          synchronous,
          method,
          payload,
          mergedPayload,
          form,
          k,
          input,
          _args = arguments;

      return _regenerator.default.async(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              userPayload = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
              routes = _this.state.appState.routes;
              route = routes && routes[name];

              if (route) {
                _context.next = 7;
                break;
              }

              err = {
                global: "Cannot make a request to unsupported route."
              };
              console.error(err, name, userPayload);
              throw err;

            case 7:
              url = route.url, _route$synchronous = route.synchronous, synchronous = _route$synchronous === void 0 ? false : _route$synchronous, method = route.method, payload = route.payload;
              mergedPayload = (0, _objectSpread2.default)({}, payload, {}, userPayload);

              if (!synchronous) {
                _context.next = 18;
                break;
              }

              form = document.createElement("form");
              form.action = url;
              form.method = method;
              form.style.display = "none";

              for (k in mergedPayload) {
                input = document.createElement("input");
                input.type = "hidden";
                input.name = k;
                input.value = mergedPayload[k];
                form.appendChild(input);
              }

              document.body.appendChild(form);
              form.submit();
              return _context.abrupt("return", new Promise(function () {}));

            case 18:
              return _context.abrupt("return", fetch(url, {
                headers: {
                  "Accept": "application/json",
                  "Content-Type": "application/json;charset=UTF-8"
                },
                credentials: "same-origin",
                method: method,
                body: method !== "GET" ? JSON.stringify(mergedPayload) : undefined
              }).then(function (res) {
                return res.json().then(function (data) {
                  if (data.error) {
                    if (res.status === 422 && data.error.fields) {
                      console.error("validation error", data.error);
                      throw data.error.fields;
                    } else {
                      var _err = {
                        global: typeof data.error === "object" ? data.error.error_description || data.error.error || JSON.stringify(data.error) : data.error.toString()
                      };
                      console.error("global error", _err, data);
                      throw _err;
                    }
                  } else if (data.session) {
                    var appState = (0, _objectSpread2.default)({}, _this.state.appState, {
                      session: data.session
                    });

                    _this.setState(function (prev) {
                      return (0, _objectSpread2.default)({}, prev, {
                        appState: appState
                      });
                    });

                    return appState;
                  } else if (data.state) {
                    var _appState = data.state;

                    _this.setState(function (prev) {
                      return (0, _objectSpread2.default)({}, prev, {
                        appState: _appState
                      });
                    });

                    console.error("whole application state response received from XHR, this is unexpected behavior but commit update", data);
                    return _appState;
                  } else if (data.redirect) {
                    window.location.assign(data.redirect);
                    return new Promise(function () {});
                  } else {
                    console.error("unrecognized response structure", data);
                  }

                  return _this.state.appState;
                }, function (err) {
                  console.error("failed to parse xhr response", err);
                  throw {
                    global: err.message || err.name
                  };
                });
              }, function (err) {
                console.error("failed to get response", err);
                throw {
                  global: err.message || err.name
                };
              }));

            case 19:
            case "end":
              return _context.stop();
          }
        }
      });
    };

    return _this;
  }

  (0, _createClass2.default)(AppStateProvider, [{
    key: "render",
    value: function render() {
      var _this$state = this.state,
          error = _this$state.error,
          appState = _this$state.appState;
      console.debug("app state update:", appState);

      var _this$context = (0, _slicedToArray2.default)(this.context, 2),
          appOptions = _this$context[0],
          setAppOptions = _this$context[1];

      if (appOptions.dev) {
        window.__APP_DEV__ = {
          options: appOptions,
          setOptions: setAppOptions,
          state: appState,
          dispatch: this.dispatch
        };
      }

      if (error) {
        return _react.default.createElement(_error.ClientErrorScreen, {
          error: error,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 39
          },
          __self: this
        });
      }

      return _react.default.createElement(AppStateContext.Provider, {
        value: [appState, this.dispatch],
        __source: {
          fileName: _jsxFileName,
          lineNumber: 43
        },
        __self: this
      }, this.props.children);
    }
  }, {
    key: "componentDidCatch",
    value: function componentDidCatch(error, info) {
      this.setState(function (prev) {
        return (0, _objectSpread2.default)({}, prev, {
          error: error
        });
      });
      console.error(error, info);
    }
  }]);
  return AppStateProvider;
}(_react.default.Component);

exports.AppStateProvider = AppStateProvider;
AppStateProvider.contextType = _options.AppOptionsContext;

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
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _interopRequireDefault = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ApplicationThemeProvider = void 0;

var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/slicedToArray */ "../../node_modules/@babel/runtime/helpers/esm/slicedToArray.js"));

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _components = __webpack_require__(/*! @ui-kitten/components */ "../../node_modules/@ui-kitten/components/index.js");

var _evaIcons = __webpack_require__(/*! @ui-kitten/eva-icons */ "../../node_modules/@ui-kitten/eva-icons/index.js");

var _eva = __webpack_require__(/*! @eva-design/eva */ "../../node_modules/@eva-design/eva/index.js");

var _options = __webpack_require__(/*! ./options */ "./src/app/options.tsx");

__webpack_require__(/*! ./theme.css */ "./src/app/theme.css");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/src/app/theme.tsx";
var customMapping = {
  "strict": {
    "text-font-family": "'Noto Sans KR', sans-serif"
  },
  components: {},
  version: 1
};

var ApplicationThemeProvider = function ApplicationThemeProvider(_ref) {
  var children = _ref.children;

  var _useAppOptions = (0, _options.useAppOptions)(),
      _useAppOptions2 = (0, _slicedToArray2.default)(_useAppOptions, 1),
      appOptions = _useAppOptions2[0];

  var theme = appOptions.theme,
      palette = appOptions.palette;
  var currentTheme = palette && theme && palette[theme] || _eva.light || _eva.dark;
  return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement(_components.IconRegistry, {
    icons: _evaIcons.EvaIconsPack,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 27
    },
    __self: this
  }), _react.default.createElement(_components.ApplicationProvider, {
    mapping: _eva.mapping,
    customMapping: customMapping,
    theme: currentTheme,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 28
    },
    __self: this
  }, _react.default.createElement(_components.Layout, {
    nativeID: "theme-container",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 33
    },
    __self: this
  }, children)));
};

exports.ApplicationThemeProvider = ApplicationThemeProvider;

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
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _interopRequireDefault = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useWithLoading = useWithLoading;
exports.useClose = useClose;
Object.defineProperty(exports, "useNavigation", {
  enumerable: true,
  get: function get() {
    return _app.useNavigation;
  }
});
Object.defineProperty(exports, "useAppState", {
  enumerable: true,
  get: function get() {
    return _app.useAppState;
  }
});
Object.defineProperty(exports, "useAppOptions", {
  enumerable: true,
  get: function get() {
    return _app.useAppOptions;
  }
});

var _toConsumableArray2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/toConsumableArray */ "../../node_modules/@babel/runtime/helpers/esm/toConsumableArray.js"));

var _regenerator = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/regenerator */ "../../node_modules/@babel/runtime/regenerator/index.js"));

var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/slicedToArray */ "../../node_modules/@babel/runtime/helpers/esm/slicedToArray.js"));

var _react = __webpack_require__(/*! react */ "../../node_modules/react/index.js");

var _app = __webpack_require__(/*! ./app */ "./src/app/index.ts");

function useWithLoading() {
  var _useState = (0, _react.useState)(false),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      loading = _useState2[0],
      setLoading = _useState2[1];

  var _useState3 = (0, _react.useState)({}),
      _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
      errors = _useState4[0],
      setErrors = _useState4[1];

  var unmounted = (0, _react.useRef)(false);
  (0, _react.useEffect)(function () {
    return function () {
      unmounted.current = true;
    };
  }, []);

  var withLoading = function withLoading(callback) {
    var deps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    var _useState5 = (0, _react.useState)(false),
        _useState6 = (0, _slicedToArray2.default)(_useState5, 2),
        callbackLoading = _useState6[0],
        setCallbackLoading = _useState6[1];

    var callWithLoading = (0, _react.useCallback)(function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (loading) return;
      setLoading(true);
      setCallbackLoading(true);
      setTimeout(function _callee() {
        return _regenerator.default.async(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return _regenerator.default.awrap(callback.apply(void 0, args));

              case 3:
                _context.next = 9;
                break;

              case 5:
                _context.prev = 5;
                _context.t0 = _context["catch"](0);
                console.error("global error from withLoading callback", _context.t0);
                setErrors({
                  global: _context.t0.message || _context.t0.toString()
                });

              case 9:
                _context.prev = 9;
                setTimeout(function () {
                  if (!unmounted.current) {
                    setLoading(false);
                    setCallbackLoading(false);
                  }
                }, 100);
                return _context.finish(9);

              case 12:
              case "end":
                return _context.stop();
            }
          }
        }, null, null, [[0, 5, 9, 12]]);
      }, 100);
    }, [callback].concat((0, _toConsumableArray2.default)(deps)));
    return [callWithLoading, callbackLoading];
  };

  return {
    withLoading: withLoading,
    loading: loading,
    errors: errors,
    setErrors: setErrors
  };
}

function useClose() {
  var tryGoBack = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

  var _useState7 = (0, _react.useState)(false),
      _useState8 = (0, _slicedToArray2.default)(_useState7, 2),
      closed = _useState8[0],
      setClosed = _useState8[1];

  var _useNavigation = (0, _app.useNavigation)(),
      nav = _useNavigation.nav;

  var close = (0, _react.useCallback)(function () {
    if (tryGoBack && nav.canGoBack()) {
      nav.goBack();
    } else {
      window.close();
      setTimeout(function () {
        return setClosed(true);
      }, 500);
    }
  }, [nav, tryGoBack]);
  return {
    closed: closed,
    setClosed: setClosed,
    close: close
  };
}

/***/ }),

/***/ "./src/index.tsx":
/*!***********************!*\
  !*** ./src/index.tsx ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _interopRequireDefault = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../node_modules/@babel/runtime/helpers/interopRequireDefault.js");

var _interopRequireWildcard = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireWildcard */ "../../node_modules/@babel/runtime/helpers/interopRequireWildcard.js");

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _reactDom = _interopRequireDefault(__webpack_require__(/*! react-dom */ "../../node_modules/react-dom/index.js"));

var serviceWorker = _interopRequireWildcard(__webpack_require__(/*! ./service-worker */ "./src/service-worker.ts"));

var _app = __webpack_require__(/*! ./app */ "./src/app/index.ts");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/src/index.tsx";

_reactDom.default.render(_react.default.createElement(_app.App, {
  __source: {
    fileName: _jsxFileName,
    lineNumber: 6
  },
  __self: this
}), document.getElementById("root"));

serviceWorker.unregister();

/***/ }),

/***/ "./src/screen/component/form.tsx":
/*!***************************************!*\
  !*** ./src/screen/component/form.tsx ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _interopRequireDefault = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../node_modules/@babel/runtime/helpers/interopRequireDefault.js");

var _interopRequireWildcard = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireWildcard */ "../../node_modules/@babel/runtime/helpers/interopRequireWildcard.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormInput = exports.Form = void 0;

var _extends2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/extends */ "../../node_modules/@babel/runtime/helpers/esm/extends.js"));

var _objectSpread2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/objectSpread2 */ "../../node_modules/@babel/runtime/helpers/esm/objectSpread2.js"));

var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/slicedToArray */ "../../node_modules/@babel/runtime/helpers/esm/slicedToArray.js"));

var _objectWithoutProperties2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/objectWithoutProperties */ "../../node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js"));

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _index = __webpack_require__(/*! ./index */ "./src/screen/component/index.ts");

var _util = __webpack_require__(/*! ./util */ "./src/screen/component/util.ts");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/src/screen/component/form.tsx";

var Form = function Form(_ref) {
  var _onSubmit = _ref.onSubmit,
      children = _ref.children;
  return _react.default.createElement("form", {
    noValidate: true,
    onSubmit: function onSubmit(e) {
      e.preventDefault();
      if (_onSubmit) _onSubmit();
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 17
    },
    __self: this
  }, children);
};

exports.Form = Form;

var FormInput = function FormInput(props) {
  var value = props.value,
      error = props.error,
      setValue = props.setValue,
      tabIndex = props.tabIndex,
      autoCompleteType = props.autoCompleteType,
      onEnter = props.onEnter,
      autoFocus = props.autoFocus,
      secureTextEntry = props.secureTextEntry,
      restProps = (0, _objectWithoutProperties2.default)(props, ["value", "error", "setValue", "tabIndex", "autoCompleteType", "onEnter", "autoFocus", "secureTextEntry"]);

  var _useState = (0, _react.useState)(false),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      passwordVisible = _useState2[0],
      setPasswordVisible = _useState2[1];

  return _react.default.createElement(_index.Input, (0, _extends2.default)({
    ref: (0, _util.withAttrs)({
      tabindex: tabIndex || null,
      autofocus: autoFocus ? "autofocus" : null
    }, "input"),
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
    onChangeText: setValue ? function (v) {
      return setValue(v || "");
    } : undefined,
    onKeyPress: typeof onEnter === "function" ? function (e) {
      return e.nativeEvent.key === "Enter" && onEnter();
    } : restProps.onKeyPress,
    icon: secureTextEntry ? function (style) {
      return _react.default.createElement(_index.Icon, {
        style: (0, _objectSpread2.default)({}, style, {}, {
          cursor: "pointer"
        }),
        name: passwordVisible ? 'eye' : 'eye-off',
        __source: {
          fileName: _jsxFileName,
          lineNumber: 55
        },
        __self: this
      });
    } : undefined,
    onIconPress: secureTextEntry ? function () {
      return setPasswordVisible(!passwordVisible);
    } : undefined
  }, restProps, {
    caption: error || restProps.caption,
    status: error ? "danger" : restProps.status || "basic",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 36
    },
    __self: this
  }));
};

exports.FormInput = FormInput;

/***/ }),

/***/ "./src/screen/component/index.ts":
/*!***************************************!*\
  !*** ./src/screen/component/index.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _components = __webpack_require__(/*! @ui-kitten/components */ "../../node_modules/@ui-kitten/components/index.js");

Object.keys(_components).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _components[key];
    }
  });
});

var _util = __webpack_require__(/*! ./util */ "./src/screen/component/util.ts");

Object.keys(_util).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _util[key];
    }
  });
});

var _separator = __webpack_require__(/*! ./separator */ "./src/screen/component/separator.tsx");

Object.keys(_separator).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _separator[key];
    }
  });
});

var _form = __webpack_require__(/*! ./form */ "./src/screen/component/form.tsx");

Object.keys(_form).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _form[key];
    }
  });
});

var _persona = __webpack_require__(/*! ./persona */ "./src/screen/component/persona.tsx");

Object.keys(_persona).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _persona[key];
    }
  });
});

var _layout = __webpack_require__(/*! ./layout */ "./src/screen/component/layout.tsx");

Object.keys(_layout).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _layout[key];
    }
  });
});

/***/ }),

/***/ "./src/screen/component/layout.tsx":
/*!*****************************************!*\
  !*** ./src/screen/component/layout.tsx ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _interopRequireDefault = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../node_modules/@babel/runtime/helpers/interopRequireDefault.js");

var _interopRequireWildcard = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireWildcard */ "../../node_modules/@babel/runtime/helpers/interopRequireWildcard.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScreenLayout = void 0;

var _extends2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/extends */ "../../node_modules/@babel/runtime/helpers/esm/extends.js"));

var _objectWithoutProperties2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/objectWithoutProperties */ "../../node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js"));

var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/slicedToArray */ "../../node_modules/@babel/runtime/helpers/esm/slicedToArray.js"));

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _reactNative = __webpack_require__(/*! react-native */ "./build.shim.rnw.tsx");

var _hook = __webpack_require__(/*! ../../hook */ "./src/hook.ts");

var _index = __webpack_require__(/*! ./index */ "./src/screen/component/index.ts");

var _logo = _interopRequireDefault(__webpack_require__(/*! ../../assets/logo.svg */ "./src/assets/logo.svg"));

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/src/screen/component/layout.tsx";

var ScreenLayout = function ScreenLayout(_ref) {
  var _ref$title = _ref.title,
      title = _ref$title === void 0 ? "undefined" : _ref$title,
      _ref$subtitle = _ref.subtitle,
      subtitle = _ref$subtitle === void 0 ? null : _ref$subtitle,
      _ref$loading = _ref.loading,
      loading = _ref$loading === void 0 ? false : _ref$loading,
      _ref$children = _ref.children,
      children = _ref$children === void 0 ? null : _ref$children,
      _ref$buttons = _ref.buttons,
      buttons = _ref$buttons === void 0 ? [] : _ref$buttons,
      _ref$error = _ref.error,
      error = _ref$error === void 0 ? null : _ref$error,
      _ref$footer = _ref.footer,
      footer = _ref$footer === void 0 ? null : _ref$footer;

  var _useNavigation = (0, _hook.useNavigation)(),
      nav = _useNavigation.nav;

  var scrollableRef = (0, _react.useRef)(null);
  (0, _react.useEffect)(function () {
    if (_index.isTouchDevice) return;
    return nav.addListener("focus", function () {
      if (scrollableRef.current) {
        var node = scrollableRef.current.getInnerViewNode();
        setTimeout(function () {
          (0, _index.activateAutoFocus)(node);
        }, 300);
      }
    });
  }, [nav]);

  var _useAppOptions = (0, _hook.useAppOptions)(),
      _useAppOptions2 = (0, _slicedToArray2.default)(_useAppOptions, 1),
      options = _useAppOptions2[0];

  return _react.default.createElement(_reactNative.ScrollView, {
    ref: function ref(_ref3) {
      scrollableRef.current = _ref3;
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
    __self: this
  }, _react.default.createElement(_reactNative.View, {
    style: {
      alignItems: options.logo.align,
      marginBottom: 20
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 70
    },
    __self: this
  }, _react.default.createElement(_reactNative.Image, {
    source: {
      uri: options.logo.uri || _logo.default
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
    __self: this
  })), _react.default.createElement(_reactNative.View, {
    style: {
      marginBottom: 30
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 74
    },
    __self: this
  }, _react.default.createElement(_index.Text, {
    category: "h5",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 75
    },
    __self: this
  }, title), subtitle && _react.default.createElement(_index.Text, {
    category: "s2",
    style: {
      marginTop: 5
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 76
    },
    __self: this
  }, subtitle)), children ? _react.default.createElement(_reactNative.View, {
    style: {
      marginBottom: 30
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 79
    },
    __self: this
  }, children) : null, error ? _react.default.createElement(_index.Text, {
    status: "danger",
    category: "c2",
    style: {
      marginBottom: 15
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 81
    },
    __self: this
  }, error) : null, buttons.length > 0 ? buttons.map(function (args, index) {
    if (args.hidden === true) {
      return null;
    }

    var s = args;

    if (s.separator) {
      return _react.default.createElement(_index.Separator, {
        key: index,
        text: typeof s.separator === "string" ? s.separator : undefined,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 93
        },
        __self: this
      });
    }

    var g = args;

    if (g.group) {
      var group = g.group,
          _loading = g.loading,
          groupProps = (0, _objectWithoutProperties2.default)(g, ["group", "loading"]);
      return _react.default.createElement(_reactNative.View, {
        key: index,
        style: {
          marginBottom: 15
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 106
        },
        __self: this
      }, _react.default.createElement(_index.ButtonGroup, (0, _extends2.default)({
        status: "basic",
        size: "large",
        appearance: "filled"
      }, groupProps, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 110
        },
        __self: this
      }), g.group.map(function (btn, key) {
        var hidden = btn.hidden,
            tabIndex = btn.tabIndex,
            loading = btn.loading,
            props = (0, _objectWithoutProperties2.default)(btn, ["hidden", "tabIndex", "loading"]);
        return _react.default.createElement(_index.Button, (0, _extends2.default)({
          ref: (0, _index.withAttrs)({
            tabindex: tabIndex || null
          }),
          key: key,
          status: "basic",
          size: "large",
          style: {
            flexGrow: 1,
            flexShrink: 1
          },
          textStyle: {
            textAlign: "center"
          }
        }, props, {
          appearance: g.loading || btn.loading ? "outline" : props.appearance || "filled",
          onPress: loading ? undefined : props.onPress,
          onPressOut: loading ? undefined : props.onPressOut,
          onPressIn: loading ? undefined : props.onPressIn,
          onLongPress: loading ? undefined : props.onLongPress,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 123
          },
          __self: this
        }));
      })));
    }

    var _ref2 = args,
        hidden = _ref2.hidden,
        tabIndex = _ref2.tabIndex,
        loading = _ref2.loading,
        props = (0, _objectWithoutProperties2.default)(_ref2, ["hidden", "tabIndex", "loading"]);
    return _react.default.createElement(_reactNative.View, {
      key: index,
      style: {
        marginBottom: 15
      },
      __source: {
        fileName: _jsxFileName,
        lineNumber: 154
      },
      __self: this
    }, _react.default.createElement(_index.Button, (0, _extends2.default)({
      ref: (0, _index.withAttrs)({
        tabindex: tabIndex || null
      }),
      status: "basic",
      size: "large"
    }, props, {
      appearance: loading ? "outline" : props.appearance || "filled",
      onPress: loading ? undefined : props.onPress,
      onPressOut: loading ? undefined : props.onPressOut,
      onPressIn: loading ? undefined : props.onPressIn,
      onLongPress: loading ? undefined : props.onLongPress,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 158
      },
      __self: this
    })));
  }) : null, footer);
};

exports.ScreenLayout = ScreenLayout;

/***/ }),

/***/ "./src/screen/component/persona.tsx":
/*!******************************************!*\
  !*** ./src/screen/component/persona.tsx ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _interopRequireDefault = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../node_modules/@babel/runtime/helpers/interopRequireDefault.js");

var _interopRequireWildcard = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireWildcard */ "../../node_modules/@babel/runtime/helpers/interopRequireWildcard.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Persona = void 0;

var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/slicedToArray */ "../../node_modules/@babel/runtime/helpers/esm/slicedToArray.js"));

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _reactNative = __webpack_require__(/*! react-native */ "./build.shim.rnw.tsx");

var _index = __webpack_require__(/*! ./index */ "./src/screen/component/index.ts");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/src/screen/component/persona.tsx";

var Persona = function Persona(_ref) {
  var _ref$name = _ref.name,
      name = _ref$name === void 0 ? "?" : _ref$name,
      _ref$email = _ref.email,
      email = _ref$email === void 0 ? "?" : _ref$email,
      picture = _ref.picture,
      style = _ref.style;
  var size = 50;
  var palette = (0, _index.useThemePalette)();

  var _useState = (0, _react.useState)(!!picture),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      pictureVisible = _useState2[0],
      setPictureVisible = _useState2[1];

  return _react.default.createElement(_reactNative.View, {
    style: style,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 17
    },
    __self: this
  }, _react.default.createElement(_reactNative.View, {
    style: {
      flexDirection: "row"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 18
    },
    __self: this
  }, _react.default.createElement(_reactNative.View, {
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
    __self: this
  }, pictureVisible ? _react.default.createElement(_index.Avatar, {
    source: {
      uri: picture
    },
    onError: function onError(err) {
      return setPictureVisible(false);
    },
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
    __self: this
  }) : _react.default.createElement(_reactNative.View, {
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
    __self: this
  }, _react.default.createElement(_index.Text, {
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
    __self: this
  }))), _react.default.createElement(_reactNative.View, {
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
    __self: this
  }, _react.default.createElement(_index.Text, {
    category: "h6",
    style: {
      marginBottom: 2
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 68
    },
    __self: this
  }, name), _react.default.createElement(_index.Text, {
    category: "p2",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 69
    },
    __self: this
  }, email))));
};

exports.Persona = Persona;

/***/ }),

/***/ "./src/screen/component/separator.tsx":
/*!********************************************!*\
  !*** ./src/screen/component/separator.tsx ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _interopRequireDefault = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Separator = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _reactNative = __webpack_require__(/*! react-native */ "./build.shim.rnw.tsx");

var _index = __webpack_require__(/*! ./index */ "./src/screen/component/index.ts");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/src/screen/component/separator.tsx";

var Separator = function Separator(_ref) {
  var text = _ref.text,
      _ref$marginTop = _ref.marginTop,
      marginTop = _ref$marginTop === void 0 ? 10 : _ref$marginTop,
      _ref$marginBottom = _ref.marginBottom,
      marginBottom = _ref$marginBottom === void 0 ? 20 : _ref$marginBottom;
  var palette = (0, _index.useThemePalette)();
  return _react.default.createElement(_reactNative.View, {
    style: {
      position: "relative",
      marginTop: marginTop,
      marginBottom: marginBottom
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 9
    },
    __self: this
  }, _react.default.createElement(_reactNative.View, {
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
    __self: this
  }), text ? _react.default.createElement(_reactNative.View, {
    style: {
      flexDirection: "row"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 12
    },
    __self: this
  }, _react.default.createElement(_reactNative.View, {
    style: {
      flexGrow: 1
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 13
    },
    __self: this
  }), _react.default.createElement(_index.Text, {
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
    __self: this
  }, text), _react.default.createElement(_reactNative.View, {
    style: {
      flexGrow: 1
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 17
    },
    __self: this
  })) : _react.default.createElement(_index.Text, {
    category: "c1",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 20
    },
    __self: this
  }, " "));
};

exports.Separator = Separator;

/***/ }),

/***/ "./src/screen/component/util.ts":
/*!**************************************!*\
  !*** ./src/screen/component/util.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _interopRequireDefault = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withElements = withElements;
exports.withElement = withElement;
exports.withAttrs = withAttrs;
exports.activateAutoFocus = activateAutoFocus;
exports.useThemePalette = useThemePalette;
exports.isTouchDevice = void 0;

var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/slicedToArray */ "../../node_modules/@babel/runtime/helpers/esm/slicedToArray.js"));

var _reactDom = _interopRequireDefault(__webpack_require__(/*! react-dom */ "../../node_modules/react-dom/index.js"));

var _components = __webpack_require__(/*! @ui-kitten/components */ "../../node_modules/@ui-kitten/components/index.js");

function withElements(callback, selector) {
  return function (ref) {
    var node = _reactDom.default.findDOMNode(ref);

    if (!node) return;

    if (typeof node === "object") {
      callback(Array.prototype.slice.call(node.querySelectorAll(selector)));
      return;
    }
  };
}

function withElement(callback, selector) {
  var ignoreNotFound = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  return function (ref) {
    var node = _reactDom.default.findDOMNode(ref);

    if (!node) return;
    var found = null;

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

function withAttrs() {
  var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var selector = arguments.length > 1 ? arguments[1] : undefined;
  var ignoreNotFound = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  return withElement(function (elem) {
    for (var _i = 0, _Object$entries = Object.entries(attrs); _i < _Object$entries.length; _i++) {
      var _ref = _Object$entries[_i];

      var _ref2 = (0, _slicedToArray2.default)(_ref, 2);

      var k = _ref2[0];
      var v = _ref2[1];

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
}

function activateAutoFocus(ref) {
  withElements(function (elems) {
    elems.find(function (elem) {
      if (!elem.focus) {
        return false;
      }

      if (elem.offsetParent === null) {
        console.debug("autofocus DOM element focus failed", elem);
        return false;
      }

      elem.focus();
      return true;
    });
  }, "[autofocus]")(ref);
}

var isTouchDevice = function () {
  if ("ontouchstart" in window || window.DocumentTouch && document instanceof window.DocumentTouch) {
    return true;
  }

  var prefixes = " -webkit- -moz- -o- -ms- ".split(" ");
  var query = ["(", prefixes.join("touch-enabled),("), "heartz", ")"].join("");
  return window.matchMedia && window.matchMedia(query).matches;
}();

exports.isTouchDevice = isTouchDevice;

function useThemePalette() {
  return (0, _components.useTheme)();
}

/***/ }),

/***/ "./src/screen/consent.tsx":
/*!********************************!*\
  !*** ./src/screen/consent.tsx ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _interopRequireDefault = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConsentScreen = void 0;

var _extends2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/extends */ "../../node_modules/@babel/runtime/helpers/esm/extends.js"));

var _toConsumableArray2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/toConsumableArray */ "../../node_modules/@babel/runtime/helpers/esm/toConsumableArray.js"));

var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/slicedToArray */ "../../node_modules/@babel/runtime/helpers/esm/slicedToArray.js"));

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _hook = __webpack_require__(/*! ../hook */ "./src/hook.ts");

var _component = __webpack_require__(/*! ./component */ "./src/screen/component/index.ts");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/src/screen/consent.tsx";

var ConsentScreen = function ConsentScreen() {
  var _useWithLoading = (0, _hook.useWithLoading)(),
      loading = _useWithLoading.loading,
      withLoading = _useWithLoading.withLoading,
      errors = _useWithLoading.errors,
      setErrors = _useWithLoading.setErrors;

  var _useNavigation = (0, _hook.useNavigation)(),
      nav = _useNavigation.nav;

  var _useAppState = (0, _hook.useAppState)(),
      _useAppState2 = (0, _slicedToArray2.default)(_useAppState, 2),
      state = _useAppState2[0],
      dispatch = _useAppState2[1];

  var _withLoading = withLoading(function () {
    return dispatch("consent.accept").then(function () {
      return setErrors({});
    }).catch(function (err) {
      return setErrors(err);
    });
  }),
      _withLoading2 = (0, _slicedToArray2.default)(_withLoading, 2),
      handleAccept = _withLoading2[0],
      handleAcceptLoading = _withLoading2[1];

  var _withLoading3 = withLoading(function () {
    nav.navigate("login.stack", {
      screen: "login.index"
    });
    setErrors({});
  }),
      _withLoading4 = (0, _slicedToArray2.default)(_withLoading3, 2),
      handleChangeAccount = _withLoading4[0],
      handleChangeAccountLoading = _withLoading4[1];

  var user = state.user;
  var client = state.client;
  var scopes = state.interaction.prompt.details.scopes;
  return _react.default.createElement(_component.ScreenLayout, {
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
    }, {
      size: "medium",
      group: [{
        children: "Privacy policy",
        onPress: function onPress() {
          return window.open(client.policy_uri, "_blank");
        },
        disabled: !client.policy_uri,
        tabIndex: 4
      }, {
        children: "Terms of service",
        onPress: function onPress() {
          return window.open(client.tos_uri, "_blank");
        },
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
    }].concat((0, _toConsumableArray2.default)(client.client_uri ? [{
      appearance: "ghost",
      size: "small",
      children: "Visit service homepage",
      onPress: function onPress() {
        return window.open(client.client_uri, "_blank");
      },
      disabled: !client.client_uri,
      tabIndex: 6
    }] : [])),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 39
    },
    __self: this
  }, _react.default.createElement(_component.Persona, (0, _extends2.default)({}, user, {
    style: {
      marginBottom: 30
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 99
    },
    __self: this
  })), _react.default.createElement(_component.Text, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 100
    },
    __self: this
  }, scopes.new.concat(scopes.accepted).join(", "), " permissions are required."));
};

exports.ConsentScreen = ConsentScreen;

/***/ }),

/***/ "./src/screen/error.tsx":
/*!******************************!*\
  !*** ./src/screen/error.tsx ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _interopRequireDefault = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ClientErrorScreen = exports.ErrorScreen = void 0;

var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/slicedToArray */ "../../node_modules/@babel/runtime/helpers/esm/slicedToArray.js"));

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _layout = __webpack_require__(/*! ./component/layout */ "./src/screen/component/layout.tsx");

var _hook = __webpack_require__(/*! ../hook */ "./src/hook.ts");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/src/screen/error.tsx";

var ErrorScreen = function ErrorScreen() {
  var _useAppState = (0, _hook.useAppState)(),
      _useAppState2 = (0, _slicedToArray2.default)(_useAppState, 1),
      state = _useAppState2[0];

  var error = state.error || {
    error: "unexpected_server_error",
    error_description: "unrecognized state received from server."
  };

  var _useClose = (0, _hook.useClose)(),
      closed = _useClose.closed,
      close = _useClose.close;

  return _react.default.createElement(_layout.ScreenLayout, {
    title: error.error.split("_").map(function (w) {
      return w[0].toUpperCase() + w.substr(1);
    }).join(" "),
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
    __self: this
  });
};

exports.ErrorScreen = ErrorScreen;

var ClientErrorScreen = function ClientErrorScreen(props) {
  return _react.default.createElement(_layout.ScreenLayout, {
    title: props.error.name,
    subtitle: props.error.message,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 28
    },
    __self: this
  }, _react.default.createElement("pre", {
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
    __self: this
  }, props.error.stack));
};

exports.ClientErrorScreen = ClientErrorScreen;

/***/ }),

/***/ "./src/screen/find_email.end.tsx":
/*!***************************************!*\
  !*** ./src/screen/find_email.end.tsx ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _interopRequireDefault = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FindEmailEndScreen = void 0;

var _extends2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/extends */ "../../node_modules/@babel/runtime/helpers/esm/extends.js"));

var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/slicedToArray */ "../../node_modules/@babel/runtime/helpers/esm/slicedToArray.js"));

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _hook = __webpack_require__(/*! ../hook */ "./src/hook.ts");

var _component = __webpack_require__(/*! ./component */ "./src/screen/component/index.ts");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/src/screen/find_email.end.tsx";

var FindEmailEndScreen = function FindEmailEndScreen() {
  var _useAppState = (0, _hook.useAppState)(),
      _useAppState2 = (0, _slicedToArray2.default)(_useAppState, 1),
      state = _useAppState2[0];

  var _useNavigation = (0, _hook.useNavigation)(),
      nav = _useNavigation.nav;

  var _useWithLoading = (0, _hook.useWithLoading)(),
      loading = _useWithLoading.loading,
      withLoading = _useWithLoading.withLoading;

  var _withLoading = withLoading(function () {
    nav.navigate("login.stack", {
      screen: "login.index",
      params: {
        email: state.session.findEmail.user.email
      }
    });
  }, [state]),
      _withLoading2 = (0, _slicedToArray2.default)(_withLoading, 2),
      handleLogin = _withLoading2[0],
      handleLoginLoading = _withLoading2[1];

  var _useClose = (0, _hook.useClose)(false),
      closed = _useClose.closed,
      close = _useClose.close;

  return _react.default.createElement(_component.ScreenLayout, {
    title: "Find your account",
    subtitle: "With mobile phone",
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
    __self: this
  }, _react.default.createElement(_component.Persona, (0, _extends2.default)({}, state.session.findEmail.user, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 48
    },
    __self: this
  })), _react.default.createElement(_component.Text, {
    style: {
      marginTop: 30
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 49
    },
    __self: this
  }, "Found your account."));
};

exports.FindEmailEndScreen = FindEmailEndScreen;

/***/ }),

/***/ "./src/screen/find_email.index.tsx":
/*!*****************************************!*\
  !*** ./src/screen/find_email.index.tsx ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _interopRequireDefault = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../node_modules/@babel/runtime/helpers/interopRequireDefault.js");

var _interopRequireWildcard = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireWildcard */ "../../node_modules/@babel/runtime/helpers/interopRequireWildcard.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FindEmailIndexScreen = void 0;

var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/slicedToArray */ "../../node_modules/@babel/runtime/helpers/esm/slicedToArray.js"));

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _hook = __webpack_require__(/*! ../hook */ "./src/hook.ts");

var _component = __webpack_require__(/*! ./component */ "./src/screen/component/index.ts");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/src/screen/find_email.index.tsx";

var FindEmailIndexScreen = function FindEmailIndexScreen() {
  var _useNavigation = (0, _hook.useNavigation)(),
      nav = _useNavigation.nav;

  var _useAppState = (0, _hook.useAppState)(),
      _useAppState2 = (0, _slicedToArray2.default)(_useAppState, 2),
      state = _useAppState2[0],
      dispatch = _useAppState2[1];

  var _useState = (0, _react.useState)(""),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      phoneNumber = _useState2[0],
      setPhoneNumber = _useState2[1];

  var _useWithLoading = (0, _hook.useWithLoading)(),
      loading = _useWithLoading.loading,
      errors = _useWithLoading.errors,
      setErrors = _useWithLoading.setErrors,
      withLoading = _useWithLoading.withLoading;

  var _withLoading = withLoading(function () {
    dispatch("verify_phone.check_phone", {
      phone_number: state.locale.country + "|" + phoneNumber,
      registered: true
    }).then(function () {
      setErrors({});
      nav.navigate("verify_phone.stack", {
        screen: "verify_phone.verify",
        params: {
          callback: "find_email"
        }
      });
    }).catch(function (err) {
      return setErrors(err);
    });
  }, [phoneNumber]),
      _withLoading2 = (0, _slicedToArray2.default)(_withLoading, 2),
      handleCheckPhoneNumber = _withLoading2[0],
      handleCheckPhoneNumberLoading = _withLoading2[1];

  var _withLoading3 = withLoading(function () {
    nav.navigate("login.stack", {
      screen: "login.index",
      params: {}
    });
    setErrors({});
  }),
      _withLoading4 = (0, _slicedToArray2.default)(_withLoading3, 2),
      handleCancel = _withLoading4[0],
      handleCancelLoading = _withLoading4[1];

  return _react.default.createElement(_component.ScreenLayout, {
    title: "Find your account",
    subtitle: "With phone verification",
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
    __self: this
  }, _react.default.createElement(_component.Text, {
    style: {
      marginBottom: 30
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 61
    },
    __self: this
  }, "Have you registered a phone number?"), _react.default.createElement(_component.FormInput, {
    autoFocus: true,
    tabIndex: 21,
    label: "Phone number",
    placeholder: "Enter your mobile phone number (" + state.locale.country + ")",
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
    __self: this
  }));
};

exports.FindEmailIndexScreen = FindEmailIndexScreen;

/***/ }),

/***/ "./src/screen/login.check_password.tsx":
/*!*********************************************!*\
  !*** ./src/screen/login.check_password.tsx ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _interopRequireDefault = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../node_modules/@babel/runtime/helpers/interopRequireDefault.js");

var _interopRequireWildcard = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireWildcard */ "../../node_modules/@babel/runtime/helpers/interopRequireWildcard.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LoginCheckPasswordScreen = void 0;

var _regenerator = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/regenerator */ "../../node_modules/@babel/runtime/regenerator/index.js"));

var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/slicedToArray */ "../../node_modules/@babel/runtime/helpers/esm/slicedToArray.js"));

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _hook = __webpack_require__(/*! ../hook */ "./src/hook.ts");

var _component = __webpack_require__(/*! ./component */ "./src/screen/component/index.ts");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/src/screen/login.check_password.tsx";

var LoginCheckPasswordScreen = function LoginCheckPasswordScreen() {
  var _useState = (0, _react.useState)(""),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      password = _useState2[0],
      setPassword = _useState2[1];

  var _useAppState = (0, _hook.useAppState)(),
      _useAppState2 = (0, _slicedToArray2.default)(_useAppState, 2),
      state = _useAppState2[0],
      dispatch = _useAppState2[1];

  var _state$session$login$ = state.session.login.user,
      email = _state$session$login$.email,
      name = _state$session$login$.name,
      picture = _state$session$login$.picture;

  var _useNavigation = (0, _hook.useNavigation)(),
      nav = _useNavigation.nav;

  var _useWithLoading = (0, _hook.useWithLoading)(),
      loading = _useWithLoading.loading,
      errors = _useWithLoading.errors,
      setErrors = _useWithLoading.setErrors,
      withLoading = _useWithLoading.withLoading;

  var _withLoading = withLoading(function _callee() {
    return _regenerator.default.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", dispatch("login.check_password", {
              email: email,
              password: password
            }).catch(function (err) {
              return setErrors(err);
            }));

          case 1:
          case "end":
            return _context.stop();
        }
      }
    });
  }, [password]),
      _withLoading2 = (0, _slicedToArray2.default)(_withLoading, 2),
      handleCheckLoginPassword = _withLoading2[0],
      handleCheckLoginPasswordLoading = _withLoading2[1];

  var _withLoading3 = withLoading(function () {
    dispatch("verify_email.check_email", {
      email: email,
      registered: true
    }).then(function () {
      setErrors({});
      nav.navigate("verify_email.stack", {
        screen: "verify_email.verify",
        params: {
          callback: "reset_password"
        }
      });
    }).catch(function (err) {
      return setErrors(err);
    });
  }, []),
      _withLoading4 = (0, _slicedToArray2.default)(_withLoading3, 2),
      handleResetPassword = _withLoading4[0],
      handleResetPasswordLoading = _withLoading4[1];

  var _withLoading5 = withLoading(function () {
    nav.navigate("login.stack", {
      screen: "login.index",
      params: {
        email: email,
        change_account: "true"
      }
    });
    setErrors({});
  }, [email]),
      _withLoading6 = (0, _slicedToArray2.default)(_withLoading5, 2),
      handleCancel = _withLoading6[0],
      handleCancelLoading = _withLoading6[1];

  return _react.default.createElement(_component.ScreenLayout, {
    title: "Hi, " + name,
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
    __self: this
  }, _react.default.createElement(_component.Form, {
    onSubmit: handleCheckLoginPassword,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 83
    },
    __self: this
  }, _react.default.createElement(_component.FormInput, {
    autoCompleteType: "username",
    value: email,
    style: {
      display: "none"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 85
    },
    __self: this
  }), _react.default.createElement(_component.FormInput, {
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
    __self: this
  })));
};

exports.LoginCheckPasswordScreen = LoginCheckPasswordScreen;

/***/ }),

/***/ "./src/screen/login.index.tsx":
/*!************************************!*\
  !*** ./src/screen/login.index.tsx ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _interopRequireDefault = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../node_modules/@babel/runtime/helpers/interopRequireDefault.js");

var _interopRequireWildcard = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireWildcard */ "../../node_modules/@babel/runtime/helpers/interopRequireWildcard.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LoginIndexScreen = void 0;

var _toConsumableArray2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/toConsumableArray */ "../../node_modules/@babel/runtime/helpers/esm/toConsumableArray.js"));

var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/slicedToArray */ "../../node_modules/@babel/runtime/helpers/esm/slicedToArray.js"));

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _hook = __webpack_require__(/*! ../hook */ "./src/hook.ts");

var _component = __webpack_require__(/*! ./component */ "./src/screen/component/index.ts");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/src/screen/login.index.tsx";

var LoginIndexScreen = function LoginIndexScreen() {
  var _useNavigation = (0, _hook.useNavigation)(),
      nav = _useNavigation.nav,
      route = _useNavigation.route;

  var _useState = (0, _react.useState)(""),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      email = _useState2[0],
      setEmail = _useState2[1];

  var _useAppState = (0, _hook.useAppState)(),
      _useAppState2 = (0, _slicedToArray2.default)(_useAppState, 2),
      state = _useAppState2[0],
      dispatch = _useAppState2[1];

  var _useAppOptions = (0, _hook.useAppOptions)(),
      _useAppOptions2 = (0, _slicedToArray2.default)(_useAppOptions, 1),
      options = _useAppOptions2[0];

  var _useState3 = (0, _react.useState)(options.login.federationOptionsVisible === true),
      _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
      federationOptionsVisible = _useState4[0],
      setFederationOptionsVisible = _useState4[1];

  var federationProviders = state.metadata.federationProviders;

  var _useWithLoading = (0, _hook.useWithLoading)(),
      loading = _useWithLoading.loading,
      errors = _useWithLoading.errors,
      setErrors = _useWithLoading.setErrors,
      withLoading = _useWithLoading.withLoading;

  var _withLoading = withLoading(function () {
    return dispatch("login.check_email", {
      email: email
    }).then(function () {
      setErrors({});
      nav.navigate("login.stack", {
        screen: "login.check_password",
        params: {
          email: email
        }
      });
    }).catch(function (err) {
      return setErrors(err);
    });
  }, [email]),
      _withLoading2 = (0, _slicedToArray2.default)(_withLoading, 2),
      handleCheckLoginEmail = _withLoading2[0],
      handleCheckLoginEmailLoading = _withLoading2[1];

  var _withLoading3 = withLoading(function () {
    return nav.navigate("find_email.stack", {
      screen: "find_email.index"
    });
  }),
      _withLoading4 = (0, _slicedToArray2.default)(_withLoading3, 2),
      handleFindEmail = _withLoading4[0],
      handleFindEmailLoading = _withLoading4[1];

  var _withLoading5 = withLoading(function () {
    return nav.navigate("register.stack", {
      screen: "register.index"
    });
  }),
      _withLoading6 = (0, _slicedToArray2.default)(_withLoading5, 2),
      handleSignUp = _withLoading6[0],
      handleSignUpLoading = _withLoading6[1];

  var _withLoading7 = withLoading(function (provider) {
    return dispatch("login.federate", {
      provider: provider
    }).catch(function (err) {
      return setErrors(err);
    });
  }),
      _withLoading8 = (0, _slicedToArray2.default)(_withLoading7, 2),
      handleFederation = _withLoading8[0],
      handleFederationLoading = _withLoading8[1];

  (0, _react.useEffect)(function () {
    if (route.params.email && route.params.email !== email) {
      setEmail(route.params.email);
      setErrors({});
    }

    return nav.addListener("blur", function () {
      setTimeout(function () {
        return setFederationOptionsVisible(false);
      }, 500);
    });
  }, [nav, route]);
  return _react.default.createElement(_component.ScreenLayout, {
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
    }].concat((0, _toConsumableArray2.default)(federationProviders.length > 0 ? [{
      separator: "OR"
    }].concat((0, _toConsumableArray2.default)(federationOptionsVisible ? federationProviders.map(function (provider, i) {
      var _getFederationStyle = getFederationStyle(provider),
          style = _getFederationStyle.style,
          textStyle = _getFederationStyle.textStyle;

      return {
        onPress: function onPress() {
          handleFederation(provider);
        },
        loading: handleFederationLoading,
        children: getFederationText(provider),
        tabIndex: 14 + i,
        style: style,
        textStyle: textStyle,
        size: "medium"
      };
    }) : [{
      onPress: function onPress() {
        return setFederationOptionsVisible(true);
      },
      children: "Find more login options?",
      tabIndex: 14,
      appearance: "ghost",
      size: "small"
    }])) : []), [{
      onPress: handleFindEmail,
      loading: handleFindEmailLoading,
      children: "Forgot your email address?",
      appearance: "ghost",
      size: "small"
    }]),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 77
    },
    __self: this
  }, _react.default.createElement(_component.Form, {
    onSubmit: handleCheckLoginEmail,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 130
    },
    __self: this
  }, _react.default.createElement(_component.FormInput, {
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
    __self: this
  })));
};

exports.LoginIndexScreen = LoginIndexScreen;
var federationText = {
  google: "Login with Google",
  facebook: "Login with Facebook",
  kakao: "Login with Kakaotalk",
  default: "Login with {provider}"
};
var federationStyle = {
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
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _interopRequireDefault = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ActiveSessionList = exports.LogoutEndScreen = void 0;

var _objectSpread2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/objectSpread2 */ "../../node_modules/@babel/runtime/helpers/esm/objectSpread2.js"));

var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/slicedToArray */ "../../node_modules/@babel/runtime/helpers/esm/slicedToArray.js"));

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _hook = __webpack_require__(/*! ../hook */ "./src/hook.ts");

var _component = __webpack_require__(/*! ./component */ "./src/screen/component/index.ts");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/src/screen/logout.end.tsx";

var LogoutEndScreen = function LogoutEndScreen() {
  var _useClose = (0, _hook.useClose)(false),
      closed = _useClose.closed,
      close = _useClose.close;

  var _useAppState = (0, _hook.useAppState)(),
      _useAppState2 = (0, _slicedToArray2.default)(_useAppState, 1),
      state = _useAppState2[0];

  var user = state.user;
  var authorizedClients = state.authorizedClients;
  return _react.default.createElement(_component.ScreenLayout, {
    title: "Sign out",
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
    __self: this
  }, user ? _react.default.createElement(ActiveSessionList, {
    authorizedClients: authorizedClients,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 29
    },
    __self: this
  }) : _react.default.createElement(_component.Text, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 31
    },
    __self: this
  }, "Account session not exists."));
};

exports.LogoutEndScreen = LogoutEndScreen;

var ActiveSessionList = function ActiveSessionList(_ref) {
  var authorizedClients = _ref.authorizedClients;
  var palette = (0, _component.useThemePalette)();
  return _react.default.createElement(_react.default.Fragment, null, authorizedClients ? _react.default.createElement(_react.default.Fragment, null, _react.default.createElement(_component.Text, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 43
    },
    __self: this
  }, "Below sessions are active."), _react.default.createElement(_component.List, {
    style: {
      marginTop: 15,
      borderColor: palette["border-basic-color-3"],
      borderWidth: 1
    },
    data: authorizedClients,
    renderItem: function renderItem(_ref2) {
      var item = _ref2.item,
          index = _ref2.index;
      var uri = item.client_uri || item.policy_uri || item.tos_uri;
      return _react.default.createElement(_component.ListItem, {
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
        onPress: uri ? function () {
          return window.open(uri);
        } : undefined,
        accessory: uri ? function (style) {
          return _react.default.createElement(_component.Icon, {
            style: (0, _objectSpread2.default)({}, style, {
              width: 20
            }),
            fill: palette["text-hint-color"],
            name: "external-link-outline",
            __source: {
              fileName: _jsxFileName,
              lineNumber: 57
            },
            __self: this
          });
        } : undefined,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 50
        },
        __self: this
      });
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 44
    },
    __self: this
  })) : _react.default.createElement(_component.Text, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 64
    },
    __self: this
  }, "There are no active sessions."));
};

exports.ActiveSessionList = ActiveSessionList;

/***/ }),

/***/ "./src/screen/logout.index.tsx":
/*!*************************************!*\
  !*** ./src/screen/logout.index.tsx ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _interopRequireDefault = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LogoutIndexScreen = void 0;

var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/slicedToArray */ "../../node_modules/@babel/runtime/helpers/esm/slicedToArray.js"));

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _hook = __webpack_require__(/*! ../hook */ "./src/hook.ts");

var _component = __webpack_require__(/*! ./component */ "./src/screen/component/index.ts");

var _logout = __webpack_require__(/*! ./logout.end */ "./src/screen/logout.end.tsx");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/src/screen/logout.index.tsx";

var LogoutIndexScreen = function LogoutIndexScreen() {
  var _useWithLoading = (0, _hook.useWithLoading)(),
      loading = _useWithLoading.loading,
      withLoading = _useWithLoading.withLoading,
      errors = _useWithLoading.errors,
      setErrors = _useWithLoading.setErrors;

  var _useAppState = (0, _hook.useAppState)(),
      _useAppState2 = (0, _slicedToArray2.default)(_useAppState, 2),
      state = _useAppState2[0],
      dispatch = _useAppState2[1];

  var _withLoading = withLoading(function () {
    return dispatch("logout.confirm").then(function () {
      return setErrors({});
    }).catch(function (err) {
      return setErrors(err);
    });
  }),
      _withLoading2 = (0, _slicedToArray2.default)(_withLoading, 2),
      handleSignOutAll = _withLoading2[0],
      handleSignOutAllLoading = _withLoading2[1];

  var _withLoading3 = withLoading(function () {
    return dispatch("logout.redirect").then(function () {
      return setErrors({});
    }).catch(function (err) {
      return setErrors(err);
    });
  }),
      _withLoading4 = (0, _slicedToArray2.default)(_withLoading3, 2),
      handleRedirect = _withLoading4[0],
      handleRedirectLoading = _withLoading4[1];

  return _react.default.createElement(_component.ScreenLayout, {
    title: "Sign out",
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
    __self: this
  }, _react.default.createElement(_logout.ActiveSessionList, {
    authorizedClients: state.authorizedClients,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 45
    },
    __self: this
  }));
};

exports.LogoutIndexScreen = LogoutIndexScreen;

/***/ }),

/***/ "./src/screen/register.detail.tsx":
/*!****************************************!*\
  !*** ./src/screen/register.detail.tsx ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _interopRequireDefault = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../node_modules/@babel/runtime/helpers/interopRequireDefault.js");

var _interopRequireWildcard = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireWildcard */ "../../node_modules/@babel/runtime/helpers/interopRequireWildcard.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RegisterDetailScreen = void 0;

var _regenerator = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/regenerator */ "../../node_modules/@babel/runtime/regenerator/index.js"));

var _objectSpread2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/objectSpread2 */ "../../node_modules/@babel/runtime/helpers/esm/objectSpread2.js"));

var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/slicedToArray */ "../../node_modules/@babel/runtime/helpers/esm/slicedToArray.js"));

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _component = __webpack_require__(/*! ./component */ "./src/screen/component/index.ts");

var _hook = __webpack_require__(/*! ../hook */ "./src/hook.ts");

var _moment = _interopRequireDefault(__webpack_require__(/*! moment */ "../../node_modules/moment/moment.js"));

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/src/screen/register.detail.tsx";

var RegisterDetailScreen = function RegisterDetailScreen() {
  var _useAppState = (0, _hook.useAppState)(),
      _useAppState2 = (0, _slicedToArray2.default)(_useAppState, 2),
      state = _useAppState2[0],
      dispatch = _useAppState2[1];

  var _useAppOptions = (0, _hook.useAppOptions)(),
      _useAppOptions2 = (0, _slicedToArray2.default)(_useAppOptions, 1),
      options = _useAppOptions2[0];

  var tmpState = state.session.register || {};
  var tmpClaims = tmpState.claims || {};
  var tmpCreds = tmpState.credentials || {};

  var _useState = (0, _react.useState)({
    phone_number: tmpClaims.phone_number || "",
    birthdate: tmpClaims.birthdate || "",
    gender: tmpClaims.gender || ""
  }),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      payload = _useState2[0],
      setPayload = _useState2[1];

  var phoneNumberVerified = state.session.verifyPhone && state.session.verifyPhone.phoneNumber === payload.phone_number && state.session.verifyPhone.verified;
  var phoneNumberRequired = state.metadata.mandatoryScopes.includes("phone");

  var _useNavigation = (0, _hook.useNavigation)(),
      nav = _useNavigation.nav;

  var _useWithLoading = (0, _hook.useWithLoading)(),
      loading = _useWithLoading.loading,
      errors = _useWithLoading.errors,
      setErrors = _useWithLoading.setErrors,
      withLoading = _useWithLoading.withLoading;

  var _withLoading = withLoading(function _callee() {
    var phone_number, birthdate, gender, data;
    return _regenerator.default.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            phone_number = payload.phone_number, birthdate = payload.birthdate, gender = payload.gender;
            data = {
              submit: false,
              claims: (0, _objectSpread2.default)({
                phone_number: phone_number ? state.locale.country + "|" + phone_number : undefined,
                birthdate: birthdate,
                gender: gender
              }, tmpClaims),
              credentials: tmpCreds,
              scope: ["email", "profile", "birthdate", "gender"].concat(phoneNumberRequired || phone_number ? "phone" : [])
            };
            return _context.abrupt("return", dispatch("register.submit", data).then(function () {
              setErrors({});

              if (data.claims.phone_number && !options.register.skipPhoneVerification && !phoneNumberVerified) {
                return dispatch("verify_phone.check_phone", {
                  phone_number: data.claims.phone_number,
                  registered: false
                }).then(function () {
                  nav.navigate("verify_phone.stack", {
                    screen: "verify_phone.verify",
                    params: {
                      callback: "register"
                    }
                  });
                });
              } else {
                return dispatch("register.submit", (0, _objectSpread2.default)({}, data, {
                  register: true
                })).then(function () {
                  nav.navigate("register.stack", {
                    screen: "register.end",
                    params: {}
                  });
                });
              }
            }).catch(function (errs) {
              return setErrors(errs);
            }));

          case 3:
          case "end":
            return _context.stop();
        }
      }
    });
  }, [payload]),
      _withLoading2 = (0, _slicedToArray2.default)(_withLoading, 2),
      handlePayloadSubmit = _withLoading2[0],
      handlePayloadSubmitLoading = _withLoading2[1];

  var _withLoading3 = withLoading(function () {
    nav.navigate("register.stack", {
      screen: "register.index",
      params: {}
    });
    setErrors({});
  }, []),
      _withLoading4 = (0, _slicedToArray2.default)(_withLoading3, 2),
      handleCancel = _withLoading4[0],
      handleCancelLoading = _withLoading4[1];

  return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement(_component.Popover, {
    content: _react.default.createElement(_component.Text, {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 87
      },
      __self: this
    }, "hello?"),
    visible: true,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 86
    },
    __self: this
  }, _react.default.createElement(_component.Text, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 90
    },
    __self: this
  }, "btn?")), _react.default.createElement(_component.Datepicker, {
    label: "Birthdate",
    size: "large",
    placement: "top",
    placeholder: "Select your birthdate",
    date: (payload.birthdate ? (0, _moment.default)(payload.birthdate) : (0, _moment.default)().subtract(20, "y")).toDate(),
    onSelect: function onSelect(v) {
      return setPayload(function (p) {
        return (0, _objectSpread2.default)({}, p, {
          birthdate: (0, _moment.default)(v).format("YYYY-MM-DD")
        });
      });
    },
    icon: function icon(s) {
      return _react.default.createElement(_component.Icon, {
        style: s,
        name: "calendar",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 99
        },
        __self: this
      });
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 92
    },
    __self: this
  }), _react.default.createElement(_component.ScreenLayout, {
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
      lineNumber: 101
    },
    __self: this
  }, _react.default.createElement(_component.Text, {
    style: {
      marginBottom: 30
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 122
    },
    __self: this
  }, "Please enter the phone number to find the your account for the case of lost."), _react.default.createElement(_component.Form, {
    onSubmit: handlePayloadSubmit,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 126
    },
    __self: this
  }, _react.default.createElement(_component.FormInput, {
    autoFocus: !payload.phone_number,
    tabIndex: 61,
    label: "Phone number" + (phoneNumberRequired ? "" : " (optional)"),
    placeholder: "Enter your mobile phone number (" + state.locale.country + ")",
    blurOnSubmit: false,
    keyboardType: "phone-pad",
    autoCompleteType: "tel",
    value: payload.phone_number,
    setValue: function setValue(v) {
      return setPayload(function (p) {
        return (0, _objectSpread2.default)({}, p, {
          phone_number: v
        });
      });
    },
    error: errors.phone_number,
    onEnter: handlePayloadSubmit,
    icon: phoneNumberVerified ? function (s) {
      return _react.default.createElement(_component.Icon, {
        name: "checkmark-circle-2-outline",
        style: s,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 139
        },
        __self: this
      });
    } : undefined,
    style: {
      marginBottom: 15
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 127
    },
    __self: this
  }))));
};

exports.RegisterDetailScreen = RegisterDetailScreen;

/***/ }),

/***/ "./src/screen/register.end.tsx":
/*!*************************************!*\
  !*** ./src/screen/register.end.tsx ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _interopRequireDefault = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RegisterEndScreen = void 0;

var _extends2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/extends */ "../../node_modules/@babel/runtime/helpers/esm/extends.js"));

var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/slicedToArray */ "../../node_modules/@babel/runtime/helpers/esm/slicedToArray.js"));

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _hook = __webpack_require__(/*! ../hook */ "./src/hook.ts");

var _component = __webpack_require__(/*! ./component */ "./src/screen/component/index.ts");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/src/screen/register.end.tsx";

var RegisterEndScreen = function RegisterEndScreen() {
  var _useAppState = (0, _hook.useAppState)(),
      _useAppState2 = (0, _slicedToArray2.default)(_useAppState, 2),
      state = _useAppState2[0],
      dispatch = _useAppState2[1];

  var user = state.session.registered || {};

  var _useClose = (0, _hook.useClose)(false),
      close = _useClose.close,
      closed = _useClose.closed;

  var _useWithLoading = (0, _hook.useWithLoading)(),
      loading = _useWithLoading.loading,
      errors = _useWithLoading.errors,
      setErrors = _useWithLoading.setErrors,
      withLoading = _useWithLoading.withLoading;

  var _withLoading = withLoading(function () {
    return dispatch("register.login").catch(function (errs) {
      return setErrors(errs);
    });
  }),
      _withLoading2 = (0, _slicedToArray2.default)(_withLoading, 2),
      handleSignIn = _withLoading2[0],
      handleSignInLoading = _withLoading2[1];

  return _react.default.createElement(_component.ScreenLayout, {
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
    __self: this
  }, _react.default.createElement(_component.Persona, (0, _extends2.default)({}, user, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 41
    },
    __self: this
  })), _react.default.createElement(_component.Text, {
    style: {
      marginTop: 30
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 42
    },
    __self: this
  }, "Congratulations! The account has been registered successfully."));
};

exports.RegisterEndScreen = RegisterEndScreen;

/***/ }),

/***/ "./src/screen/register.index.tsx":
/*!***************************************!*\
  !*** ./src/screen/register.index.tsx ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _interopRequireDefault = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../node_modules/@babel/runtime/helpers/interopRequireDefault.js");

var _interopRequireWildcard = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireWildcard */ "../../node_modules/@babel/runtime/helpers/interopRequireWildcard.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RegisterIndexScreen = void 0;

var _regenerator = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/regenerator */ "../../node_modules/@babel/runtime/regenerator/index.js"));

var _objectSpread2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/objectSpread2 */ "../../node_modules/@babel/runtime/helpers/esm/objectSpread2.js"));

var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/slicedToArray */ "../../node_modules/@babel/runtime/helpers/esm/slicedToArray.js"));

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _component = __webpack_require__(/*! ./component */ "./src/screen/component/index.ts");

var _hook = __webpack_require__(/*! ../hook */ "./src/hook.ts");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/src/screen/register.index.tsx";

var RegisterIndexScreen = function RegisterIndexScreen() {
  var _useAppState = (0, _hook.useAppState)(),
      _useAppState2 = (0, _slicedToArray2.default)(_useAppState, 2),
      state = _useAppState2[0],
      dispatch = _useAppState2[1];

  var _useAppOptions = (0, _hook.useAppOptions)(),
      _useAppOptions2 = (0, _slicedToArray2.default)(_useAppOptions, 1),
      options = _useAppOptions2[0];

  var tmpState = state.session.register || {};
  var tmpClaims = tmpState.claims || {};
  var tmpCreds = tmpState.credentials || {};

  var _useState = (0, _react.useState)({
    name: tmpClaims.name || "",
    email: tmpClaims.email || "",
    password: tmpCreds.password || "",
    password_confirmation: tmpCreds.password_confirmation || ""
  }),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      payload = _useState2[0],
      setPayload = _useState2[1];

  var emailVerified = state.session.verifyEmail && state.session.verifyEmail.email === payload.email && state.session.verifyEmail.verified;

  var _useNavigation = (0, _hook.useNavigation)(),
      nav = _useNavigation.nav;

  var _useWithLoading = (0, _hook.useWithLoading)(),
      loading = _useWithLoading.loading,
      errors = _useWithLoading.errors,
      setErrors = _useWithLoading.setErrors,
      withLoading = _useWithLoading.withLoading;

  var _withLoading = withLoading(function _callee() {
    var name, email, password, password_confirmation, data;
    return _regenerator.default.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            name = payload.name, email = payload.email, password = payload.password, password_confirmation = payload.password_confirmation;
            data = {
              submit: false,
              claims: {
                name: name,
                email: email
              },
              credentials: {
                password: password,
                password_confirmation: password_confirmation
              },
              scope: ["email", "profile"]
            };
            return _context.abrupt("return", dispatch("register.submit", data).then(function () {
              setErrors({});

              if (!options.register.skipEmailVerification && !emailVerified) {
                return dispatch("verify_email.check_email", {
                  email: data.claims.email,
                  registered: false
                }).then(function () {
                  nav.navigate("verify_email.stack", {
                    screen: "verify_email.verify",
                    params: {
                      callback: "register"
                    }
                  });
                });
              } else if (!options.register.skipDetailClaims) {
                nav.navigate("register.stack", {
                  screen: "register.detail",
                  params: {}
                });
              } else {
                return dispatch("register.submit", (0, _objectSpread2.default)({}, data, {
                  register: true
                })).then(function () {
                  nav.navigate("register.stack", {
                    screen: "register.end",
                    params: {}
                  });
                });
              }
            }).catch(function (errs) {
              return setErrors(errs);
            }));

          case 3:
          case "end":
            return _context.stop();
        }
      }
    });
  }, [payload]),
      _withLoading2 = (0, _slicedToArray2.default)(_withLoading, 2),
      handlePayloadSubmit = _withLoading2[0],
      handlePayloadSubmitLoading = _withLoading2[1];

  var _withLoading3 = withLoading(function () {
    nav.navigate("login.stack", {
      screen: "login.index",
      params: {}
    });
    setErrors({});
  }, []),
      _withLoading4 = (0, _slicedToArray2.default)(_withLoading3, 2),
      handleCancel = _withLoading4[0],
      handleCancelLoading = _withLoading4[1];

  var discovery = state.metadata.discovery;
  return _react.default.createElement(_component.ScreenLayout, {
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
        onPress: function onPress() {
          return window.open(discovery.op_policy_uri, "_blank");
        },
        disabled: !discovery.op_policy_uri,
        tabIndex: 4
      }, {
        children: "Terms of service",
        onPress: function onPress() {
          return window.open(discovery.op_tos_uri, "_blank");
        },
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
    __self: this
  }, _react.default.createElement(_component.Form, {
    onSubmit: handlePayloadSubmit,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 132
    },
    __self: this
  }, _react.default.createElement(_component.FormInput, {
    label: "Name",
    tabIndex: 51,
    keyboardType: "default",
    placeholder: "Enter your name",
    autoCompleteType: "name",
    autoFocus: !payload.name,
    value: payload.name,
    setValue: function setValue(v) {
      return setPayload(function (p) {
        return (0, _objectSpread2.default)({}, p, {
          name: v
        });
      });
    },
    error: errors.name,
    onEnter: handlePayloadSubmit,
    style: {
      marginBottom: 15
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 133
    },
    __self: this
  }), _react.default.createElement(_component.FormInput, {
    label: "Email",
    tabIndex: 52,
    keyboardType: "email-address",
    placeholder: "Enter your email address",
    autoCompleteType: "username",
    value: payload.email,
    setValue: function setValue(v) {
      return setPayload(function (p) {
        return (0, _objectSpread2.default)({}, p, {
          email: v
        });
      });
    },
    icon: emailVerified ? function (s) {
      return _react.default.createElement(_component.Icon, {
        name: "checkmark-circle-2-outline",
        style: s,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 154
        },
        __self: this
      });
    } : undefined,
    error: errors.email,
    onEnter: handlePayloadSubmit,
    style: {
      marginBottom: 15
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 146
    },
    __self: this
  }), _react.default.createElement(_component.FormInput, {
    label: "Password",
    tabIndex: 53,
    secureTextEntry: true,
    autoCompleteType: "password",
    placeholder: "Enter password",
    value: payload.password,
    setValue: function setValue(v) {
      return setPayload(function (p) {
        return (0, _objectSpread2.default)({}, p, {
          password: v
        });
      });
    },
    error: errors.password,
    onEnter: handlePayloadSubmit,
    style: {
      marginBottom: 15
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 159
    },
    __self: this
  }), _react.default.createElement(_component.FormInput, {
    label: "Confirm",
    tabIndex: 54,
    secureTextEntry: true,
    autoCompleteType: "password",
    placeholder: "Confirm password",
    value: payload.password_confirmation,
    setValue: function setValue(v) {
      return setPayload(function (p) {
        return (0, _objectSpread2.default)({}, p, {
          password_confirmation: v
        });
      });
    },
    error: errors.password_confirmation,
    onEnter: handlePayloadSubmit,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 171
    },
    __self: this
  })), _react.default.createElement(_component.Text, {
    style: {
      marginTop: 30
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 183
    },
    __self: this
  }, "When continue, you are agreeing to the terms of service and the privacy policy."));
};

exports.RegisterIndexScreen = RegisterIndexScreen;

/***/ }),

/***/ "./src/screen/reset_password.end.tsx":
/*!*******************************************!*\
  !*** ./src/screen/reset_password.end.tsx ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _interopRequireDefault = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ResetPasswordEndScreen = void 0;

var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/slicedToArray */ "../../node_modules/@babel/runtime/helpers/esm/slicedToArray.js"));

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _hook = __webpack_require__(/*! ../hook */ "./src/hook.ts");

var _component = __webpack_require__(/*! ./component */ "./src/screen/component/index.ts");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/src/screen/reset_password.end.tsx";

var ResetPasswordEndScreen = function ResetPasswordEndScreen() {
  var _useAppState = (0, _hook.useAppState)(),
      _useAppState2 = (0, _slicedToArray2.default)(_useAppState, 1),
      state = _useAppState2[0];

  var email = state.session.resetPassword.user.email;

  var _useNavigation = (0, _hook.useNavigation)(),
      nav = _useNavigation.nav;

  var _useWithLoading = (0, _hook.useWithLoading)(),
      loading = _useWithLoading.loading,
      withLoading = _useWithLoading.withLoading;

  var _withLoading = withLoading(function () {
    nav.navigate("login.stack", {
      screen: "login.index",
      params: {
        email: email
      }
    });
  }, [state]),
      _withLoading2 = (0, _slicedToArray2.default)(_withLoading, 2),
      handleLogin = _withLoading2[0],
      handleLoginLoading = _withLoading2[1];

  var _useClose = (0, _hook.useClose)(false),
      closed = _useClose.closed,
      close = _useClose.close;

  return _react.default.createElement(_component.ScreenLayout, {
    title: "Password reset",
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
    __self: this
  }, _react.default.createElement(_component.Text, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 49
    },
    __self: this
  }, "The account credential has been updated successfully."));
};

exports.ResetPasswordEndScreen = ResetPasswordEndScreen;

/***/ }),

/***/ "./src/screen/reset_password.index.tsx":
/*!*********************************************!*\
  !*** ./src/screen/reset_password.index.tsx ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _interopRequireDefault = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../node_modules/@babel/runtime/helpers/interopRequireDefault.js");

var _interopRequireWildcard = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireWildcard */ "../../node_modules/@babel/runtime/helpers/interopRequireWildcard.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ResetPasswordIndexScreen = void 0;

var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/slicedToArray */ "../../node_modules/@babel/runtime/helpers/esm/slicedToArray.js"));

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _hook = __webpack_require__(/*! ../hook */ "./src/hook.ts");

var _component = __webpack_require__(/*! ./component */ "./src/screen/component/index.ts");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/src/screen/reset_password.index.tsx";

var ResetPasswordIndexScreen = function ResetPasswordIndexScreen() {
  var _useAppState = (0, _hook.useAppState)(),
      _useAppState2 = (0, _slicedToArray2.default)(_useAppState, 2),
      state = _useAppState2[0],
      dispatch = _useAppState2[1];

  var _useState = (0, _react.useState)(state.user && state.user.email || ""),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      email = _useState2[0],
      setEmail = _useState2[1];

  var _useNavigation = (0, _hook.useNavigation)(),
      nav = _useNavigation.nav,
      route = _useNavigation.route;

  var _useWithLoading = (0, _hook.useWithLoading)(),
      loading = _useWithLoading.loading,
      errors = _useWithLoading.errors,
      setErrors = _useWithLoading.setErrors,
      withLoading = _useWithLoading.withLoading;

  var _withLoading = withLoading(function () {
    dispatch("verify_email.check_email", {
      email: email,
      registered: true
    }).then(function () {
      setErrors({});
      nav.navigate("verify_email.stack", {
        screen: "verify_email.verify",
        params: {
          callback: "reset_password"
        }
      });
    }).catch(function (errs) {
      return setErrors(errs);
    });
  }, [email]),
      _withLoading2 = (0, _slicedToArray2.default)(_withLoading, 2),
      handleCheckEmail = _withLoading2[0],
      handleCheckEmailLoading = _withLoading2[1];

  var _withLoading3 = withLoading(function () {
    nav.navigate("login.stack", {
      screen: "login.check_password",
      params: {
        email: email
      }
    });
    setErrors({});
  }, [email]),
      _withLoading4 = (0, _slicedToArray2.default)(_withLoading3, 2),
      handleCancel = _withLoading4[0],
      handleCancelLoading = _withLoading4[1];

  (0, _react.useEffect)(function () {
    if (route.params.email && route.params.email !== email) {
      setEmail(route.params.email || "");
      setErrors({});
    }
  }, [nav, route]);
  return _react.default.createElement(_component.ScreenLayout, {
    title: "Reset password",
    subtitle: "with email verification",
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
    __self: this
  }, _react.default.createElement(_component.Text, {
    style: {
      marginBottom: 30
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 74
    },
    __self: this
  }, "Verify your registered email address."), _react.default.createElement(_component.FormInput, {
    autoFocus: true,
    tabIndex: 21,
    label: "Email",
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
    __self: this
  }));
};

exports.ResetPasswordIndexScreen = ResetPasswordIndexScreen;

/***/ }),

/***/ "./src/screen/reset_password.set.tsx":
/*!*******************************************!*\
  !*** ./src/screen/reset_password.set.tsx ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _interopRequireDefault = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../node_modules/@babel/runtime/helpers/interopRequireDefault.js");

var _interopRequireWildcard = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireWildcard */ "../../node_modules/@babel/runtime/helpers/interopRequireWildcard.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ResetPasswordSetScreen = void 0;

var _objectSpread2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/objectSpread2 */ "../../node_modules/@babel/runtime/helpers/esm/objectSpread2.js"));

var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/slicedToArray */ "../../node_modules/@babel/runtime/helpers/esm/slicedToArray.js"));

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _hook = __webpack_require__(/*! ../hook */ "./src/hook.ts");

var _component = __webpack_require__(/*! ./component */ "./src/screen/component/index.ts");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/src/screen/reset_password.set.tsx";

var ResetPasswordSetScreen = function ResetPasswordSetScreen() {
  var _useAppState = (0, _hook.useAppState)(),
      _useAppState2 = (0, _slicedToArray2.default)(_useAppState, 2),
      state = _useAppState2[0],
      dispatch = _useAppState2[1];

  var email = state.session.resetPassword.user.email;

  var _useState = (0, _react.useState)({
    password: "",
    password_confirmation: ""
  }),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      payload = _useState2[0],
      setPayload = _useState2[1];

  var _useNavigation = (0, _hook.useNavigation)(),
      nav = _useNavigation.nav;

  var _useWithLoading = (0, _hook.useWithLoading)(),
      loading = _useWithLoading.loading,
      errors = _useWithLoading.errors,
      setErrors = _useWithLoading.setErrors,
      withLoading = _useWithLoading.withLoading;

  var _withLoading = withLoading(function () {
    return dispatch("reset_password.set", (0, _objectSpread2.default)({
      email: email
    }, payload)).then(function () {
      setErrors({});
      nav.navigate("reset_password.stack", {
        screen: "reset_password.end",
        params: {}
      });
    }).catch(function (errs) {
      return setErrors(errs);
    });
  }, [payload]),
      _withLoading2 = (0, _slicedToArray2.default)(_withLoading, 2),
      handleResetPassword = _withLoading2[0],
      handleResetPasswordLoading = _withLoading2[1];

  var _withLoading3 = withLoading(function () {
    nav.navigate("login.stack", {
      screen: "login.check_password",
      params: {
        email: email
      }
    });
    setErrors({});
  }, []),
      _withLoading4 = (0, _slicedToArray2.default)(_withLoading3, 2),
      handleCancel = _withLoading4[0],
      handleCancelLoading = _withLoading4[1];

  return _react.default.createElement(_component.ScreenLayout, {
    title: "Reset password",
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
    __self: this
  }, _react.default.createElement(_component.Text, {
    style: {
      marginBottom: 30
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 66
    },
    __self: this
  }, "Set a new password for your account."), _react.default.createElement(_component.Form, {
    onSubmit: handleResetPassword,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 69
    },
    __self: this
  }, _react.default.createElement(_component.FormInput, {
    autoCompleteType: "username",
    value: email,
    style: {
      display: "none"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 71
    },
    __self: this
  }), _react.default.createElement(_component.FormInput, {
    label: "Password",
    tabIndex: 41,
    autoFocus: true,
    secureTextEntry: true,
    autoCompleteType: "password",
    placeholder: "Enter new password",
    value: payload.password,
    setValue: function setValue(v) {
      return setPayload(function (p) {
        return (0, _objectSpread2.default)({}, p, {
          password: v
        });
      });
    },
    error: errors.password,
    onEnter: handleResetPassword,
    style: {
      marginBottom: 15
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 76
    },
    __self: this
  }), _react.default.createElement(_component.FormInput, {
    label: "Confirm",
    tabIndex: 42,
    secureTextEntry: true,
    autoCompleteType: "password",
    placeholder: "Confirm new password",
    value: payload.password_confirmation,
    setValue: function setValue(v) {
      return setPayload(function (p) {
        return (0, _objectSpread2.default)({}, p, {
          password_confirmation: v
        });
      });
    },
    error: errors.password_confirmation,
    onEnter: handleResetPassword,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 89
    },
    __self: this
  })));
};

exports.ResetPasswordSetScreen = ResetPasswordSetScreen;

/***/ }),

/***/ "./src/screen/verify_email.end.tsx":
/*!*****************************************!*\
  !*** ./src/screen/verify_email.end.tsx ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _interopRequireDefault = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VerifyEmailEndScreen = void 0;

var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/slicedToArray */ "../../node_modules/@babel/runtime/helpers/esm/slicedToArray.js"));

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _hook = __webpack_require__(/*! ../hook */ "./src/hook.ts");

var _component = __webpack_require__(/*! ./component */ "./src/screen/component/index.ts");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/src/screen/verify_email.end.tsx";

var VerifyEmailEndScreen = function VerifyEmailEndScreen() {
  var _useAppState = (0, _hook.useAppState)(),
      _useAppState2 = (0, _slicedToArray2.default)(_useAppState, 1),
      state = _useAppState2[0];

  var _useClose = (0, _hook.useClose)(false),
      close = _useClose.close,
      closed = _useClose.closed;

  return _react.default.createElement(_component.ScreenLayout, {
    title: "Email address verified",
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
    __self: this
  }, _react.default.createElement(_component.Text, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 25
    },
    __self: this
  }, "The account email address has been verified successfully."));
};

exports.VerifyEmailEndScreen = VerifyEmailEndScreen;

/***/ }),

/***/ "./src/screen/verify_email.index.tsx":
/*!*******************************************!*\
  !*** ./src/screen/verify_email.index.tsx ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _interopRequireDefault = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../node_modules/@babel/runtime/helpers/interopRequireDefault.js");

var _interopRequireWildcard = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireWildcard */ "../../node_modules/@babel/runtime/helpers/interopRequireWildcard.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VerifyEmailIndexScreen = void 0;

var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/slicedToArray */ "../../node_modules/@babel/runtime/helpers/esm/slicedToArray.js"));

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _hook = __webpack_require__(/*! ../hook */ "./src/hook.ts");

var _component = __webpack_require__(/*! ./component */ "./src/screen/component/index.ts");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/src/screen/verify_email.index.tsx";

var VerifyEmailIndexScreen = function VerifyEmailIndexScreen() {
  var _useAppState = (0, _hook.useAppState)(),
      _useAppState2 = (0, _slicedToArray2.default)(_useAppState, 2),
      state = _useAppState2[0],
      dispatch = _useAppState2[1];

  var _useState = (0, _react.useState)(""),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      email = _useState2[0],
      setEmail = _useState2[1];

  var _useNavigation = (0, _hook.useNavigation)(),
      nav = _useNavigation.nav,
      route = _useNavigation.route;

  var _useWithLoading = (0, _hook.useWithLoading)(),
      loading = _useWithLoading.loading,
      errors = _useWithLoading.errors,
      setErrors = _useWithLoading.setErrors,
      withLoading = _useWithLoading.withLoading;

  var _withLoading = withLoading(function () {
    dispatch("verify_email.check_email", {
      email: email,
      registered: true
    }).then(function () {
      setErrors({});
      nav.navigate("verify_email.stack", {
        screen: "verify_email.verify",
        params: {}
      });
    }).catch(function (err) {
      return setErrors(err);
    });
  }, [email]),
      _withLoading2 = (0, _slicedToArray2.default)(_withLoading, 2),
      handleCheckEmail = _withLoading2[0],
      handleCheckEmailLoading = _withLoading2[1];

  (0, _react.useEffect)(function () {
    if (route.params.email !== email) {
      setEmail(route.params.email || "");
      setErrors({});
    }
  }, [nav, route]);
  return _react.default.createElement(_component.ScreenLayout, {
    title: "Verify your email",
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
    __self: this
  }, _react.default.createElement(_component.Text, {
    style: {
      marginBottom: 30
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 55
    },
    __self: this
  }, "Verify your registered email address."), _react.default.createElement(_component.FormInput, {
    autoFocus: true,
    tabIndex: 31,
    label: "Email",
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
    __self: this
  }));
};

exports.VerifyEmailIndexScreen = VerifyEmailIndexScreen;

/***/ }),

/***/ "./src/screen/verify_email.verify.tsx":
/*!********************************************!*\
  !*** ./src/screen/verify_email.verify.tsx ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _interopRequireDefault = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../node_modules/@babel/runtime/helpers/interopRequireDefault.js");

var _interopRequireWildcard = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireWildcard */ "../../node_modules/@babel/runtime/helpers/interopRequireWildcard.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VerifyEmailVerifyScreen = void 0;

var _toConsumableArray2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/toConsumableArray */ "../../node_modules/@babel/runtime/helpers/esm/toConsumableArray.js"));

var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/slicedToArray */ "../../node_modules/@babel/runtime/helpers/esm/slicedToArray.js"));

var _moment = _interopRequireDefault(__webpack_require__(/*! moment */ "../../node_modules/moment/moment.js"));

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _reactNative = __webpack_require__(/*! react-native */ "./build.shim.rnw.tsx");

var _hook = __webpack_require__(/*! ../hook */ "./src/hook.ts");

var _component = __webpack_require__(/*! ./component */ "./src/screen/component/index.ts");

var _screen_sent = _interopRequireDefault(__webpack_require__(/*! ../assets/screen_sent.svg */ "./src/assets/screen_sent.svg"));

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/src/screen/verify_email.verify.tsx";

var VerifyEmailVerifyScreen = function VerifyEmailVerifyScreen() {
  var _useAppState = (0, _hook.useAppState)(),
      _useAppState2 = (0, _slicedToArray2.default)(_useAppState, 2),
      state = _useAppState2[0],
      dispatch = _useAppState2[1];

  var email = state.session.verifyEmail.email;
  var expiresAt = state.session.verifyEmail.expiresAt;

  var _useState = (0, _react.useState)(state.session.dev && state.session.dev.verifyEmailSecret || ""),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      secret = _useState2[0],
      setSecret = _useState2[1];

  var _useState3 = (0, _react.useState)("00:00"),
      _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
      remainingSeconds = _useState4[0],
      setRemainingSeconds = _useState4[1];

  var updateRemainingSeconds = (0, _react.useCallback)(function () {
    var updated = "";

    if (expiresAt) {
      var seconds = Math.max((0, _moment.default)(expiresAt).diff(_moment.default.now(), "s"), 0);
      updated = Math.floor(seconds / 60).toString().padStart(2, "0") + ":" + (seconds % 60).toString().padStart(2, "0");
    }

    if (updated !== remainingSeconds) {
      setRemainingSeconds(updated);
    }
  }, [expiresAt, remainingSeconds]);
  (0, _react.useEffect)(function () {
    updateRemainingSeconds();
    var timer = setInterval(updateRemainingSeconds, 500);
    return function () {
      return clearInterval(timer);
    };
  }, [updateRemainingSeconds]);

  var _useWithLoading = (0, _hook.useWithLoading)(),
      loading = _useWithLoading.loading,
      errors = _useWithLoading.errors,
      setErrors = _useWithLoading.setErrors,
      withLoading = _useWithLoading.withLoading;

  var _useNavigation = (0, _hook.useNavigation)(),
      nav = _useNavigation.nav,
      route = _useNavigation.route;

  var _route$params$callbac = route.params.callback,
      callback = _route$params$callbac === void 0 ? "" : _route$params$callbac;

  var _withLoading = withLoading(function () {
    return dispatch("verify_email.send", {
      email: email
    }).then(function (s) {
      setErrors({});

      if (s.session.dev && s.session.dev.verifyEmailSecret) {
        console.debug("set secret automatically by dev mode");
        setSecret(s.session.dev.verifyEmailSecret);
      }

      updateRemainingSeconds();
    }).catch(function (errs) {
      return setErrors(errs);
    });
  }, [state]),
      _withLoading2 = (0, _slicedToArray2.default)(_withLoading, 2),
      handleSend = _withLoading2[0],
      handleSendLoading = _withLoading2[1];

  var _withLoading3 = withLoading(function () {
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
  }, [callback]),
      _withLoading4 = (0, _slicedToArray2.default)(_withLoading3, 2),
      handleCancel = _withLoading4[0],
      handleCancelLoading = _withLoading4[1];

  var _withLoading5 = withLoading(function () {
    return dispatch("verify_email.verify", {
      email: email,
      secret: secret,
      callback: callback
    }).then(function () {
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
    }).catch(function (errs) {
      return setErrors(errs);
    });
  }, [callback, state, secret]),
      _withLoading6 = (0, _slicedToArray2.default)(_withLoading5, 2),
      handleVerify = _withLoading6[0],
      handleVerifyLoading = _withLoading6[1];

  return _react.default.createElement(_component.ScreenLayout, {
    title: "Verify email address",
    subtitle: email,
    buttons: [].concat((0, _toConsumableArray2.default)(expiresAt ? [{
      status: "primary",
      children: "Verify",
      onPress: handleVerify,
      loading: handleVerifyLoading,
      tabIndex: 111
    }] : []), [{
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
    }]),
    loading: loading,
    error: errors.global,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 118
    },
    __self: this
  }, expiresAt ? _react.default.createElement(_react.default.Fragment, null, _react.default.createElement(_component.Text, {
    style: {
      marginBottom: 30
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 148
    },
    __self: this
  }, "Enter the received 6-digit verification code."), _react.default.createElement(_component.FormInput, {
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
    __self: this
  })) : _react.default.createElement(_react.default.Fragment, null, _react.default.createElement(_component.Text, {
    style: {
      marginBottom: 30
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 167
    },
    __self: this
  }, "An email with a verification code will be sent to verify the email address."), _react.default.createElement(_reactNative.Image, {
    source: {
      uri: _screen_sent.default
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
    __self: this
  })));
};

exports.VerifyEmailVerifyScreen = VerifyEmailVerifyScreen;

/***/ }),

/***/ "./src/screen/verify_phone.end.tsx":
/*!*****************************************!*\
  !*** ./src/screen/verify_phone.end.tsx ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _interopRequireDefault = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VerifyPhoneEndScreen = void 0;

var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/slicedToArray */ "../../node_modules/@babel/runtime/helpers/esm/slicedToArray.js"));

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _hook = __webpack_require__(/*! ../hook */ "./src/hook.ts");

var _component = __webpack_require__(/*! ./component */ "./src/screen/component/index.ts");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/src/screen/verify_phone.end.tsx";

var VerifyPhoneEndScreen = function VerifyPhoneEndScreen() {
  var _useAppState = (0, _hook.useAppState)(),
      _useAppState2 = (0, _slicedToArray2.default)(_useAppState, 1),
      state = _useAppState2[0];

  var _useClose = (0, _hook.useClose)(false),
      close = _useClose.close,
      closed = _useClose.closed;

  return _react.default.createElement(_component.ScreenLayout, {
    title: "Phone number verified",
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
    __self: this
  }, _react.default.createElement(_component.Text, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 25
    },
    __self: this
  }, "The account phone number has been verified successfully."));
};

exports.VerifyPhoneEndScreen = VerifyPhoneEndScreen;

/***/ }),

/***/ "./src/screen/verify_phone.index.tsx":
/*!*******************************************!*\
  !*** ./src/screen/verify_phone.index.tsx ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _interopRequireDefault = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../node_modules/@babel/runtime/helpers/interopRequireDefault.js");

var _interopRequireWildcard = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireWildcard */ "../../node_modules/@babel/runtime/helpers/interopRequireWildcard.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VerifyPhoneIndexScreen = void 0;

var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/slicedToArray */ "../../node_modules/@babel/runtime/helpers/esm/slicedToArray.js"));

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _hook = __webpack_require__(/*! ../hook */ "./src/hook.ts");

var _component = __webpack_require__(/*! ./component */ "./src/screen/component/index.ts");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/src/screen/verify_phone.index.tsx";

var VerifyPhoneIndexScreen = function VerifyPhoneIndexScreen() {
  var _useAppState = (0, _hook.useAppState)(),
      _useAppState2 = (0, _slicedToArray2.default)(_useAppState, 2),
      state = _useAppState2[0],
      dispatch = _useAppState2[1];

  var _useState = (0, _react.useState)(""),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      phoneNumber = _useState2[0],
      setPhoneNumber = _useState2[1];

  var _useNavigation = (0, _hook.useNavigation)(),
      nav = _useNavigation.nav,
      route = _useNavigation.route;

  var _useWithLoading = (0, _hook.useWithLoading)(),
      loading = _useWithLoading.loading,
      errors = _useWithLoading.errors,
      setErrors = _useWithLoading.setErrors,
      withLoading = _useWithLoading.withLoading;

  var _withLoading = withLoading(function () {
    dispatch("verify_phone.check_phone", {
      phone_number: state.locale.country + "|" + phoneNumber,
      registered: true
    }).then(function () {
      setErrors({});
      nav.navigate("verify_phone.stack", {
        screen: "verify_phone.verify",
        params: {}
      });
    }).catch(function (err) {
      return setErrors(err);
    });
  }, [phoneNumber]),
      _withLoading2 = (0, _slicedToArray2.default)(_withLoading, 2),
      handleCheckPhoneNumber = _withLoading2[0],
      handleCheckPhoneNumberLoading = _withLoading2[1];

  (0, _react.useEffect)(function () {
    if (route.params.phone_number && route.params.phone_number !== phoneNumber) {
      setPhoneNumber(route.params.phone_number || "");
      setErrors({});
    }
  }, [nav, route]);
  return _react.default.createElement(_component.ScreenLayout, {
    title: "Verify your phone",
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
    __self: this
  }, _react.default.createElement(_component.Text, {
    style: {
      marginBottom: 30
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 53
    },
    __self: this
  }, "Verify your registered phone number."), _react.default.createElement(_component.FormInput, {
    autoFocus: true,
    tabIndex: 21,
    label: "Phone number",
    placeholder: "Enter your mobile phone number (" + state.locale.country + ")",
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
    __self: this
  }));
};

exports.VerifyPhoneIndexScreen = VerifyPhoneIndexScreen;

/***/ }),

/***/ "./src/screen/verify_phone.verify.tsx":
/*!********************************************!*\
  !*** ./src/screen/verify_phone.verify.tsx ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _interopRequireDefault = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../node_modules/@babel/runtime/helpers/interopRequireDefault.js");

var _interopRequireWildcard = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireWildcard */ "../../node_modules/@babel/runtime/helpers/interopRequireWildcard.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VerifyPhoneVerifyScreen = void 0;

var _toConsumableArray2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/toConsumableArray */ "../../node_modules/@babel/runtime/helpers/esm/toConsumableArray.js"));

var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/slicedToArray */ "../../node_modules/@babel/runtime/helpers/esm/slicedToArray.js"));

var _moment = _interopRequireDefault(__webpack_require__(/*! moment */ "../../node_modules/moment/moment.js"));

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _reactNative = __webpack_require__(/*! react-native */ "./build.shim.rnw.tsx");

var _component = __webpack_require__(/*! ./component */ "./src/screen/component/index.ts");

var _hook = __webpack_require__(/*! ../hook */ "./src/hook.ts");

var _screen_verify = _interopRequireDefault(__webpack_require__(/*! ../assets/screen_verify.svg */ "./src/assets/screen_verify.svg"));

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-app-renderer/src/screen/verify_phone.verify.tsx";

var VerifyPhoneVerifyScreen = function VerifyPhoneVerifyScreen() {
  var _useAppState = (0, _hook.useAppState)(),
      _useAppState2 = (0, _slicedToArray2.default)(_useAppState, 2),
      state = _useAppState2[0],
      dispatch = _useAppState2[1];

  var expiresAt = state.session.verifyPhone.expiresAt;

  var _useState = (0, _react.useState)(state.session.dev && state.session.dev.verifyPhoneSecret || ""),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      secret = _useState2[0],
      setSecret = _useState2[1];

  var _useState3 = (0, _react.useState)("00:00"),
      _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
      remainingSeconds = _useState4[0],
      setRemainingSeconds = _useState4[1];

  var updateRemainingSeconds = (0, _react.useCallback)(function () {
    var updated = "";

    if (expiresAt) {
      var seconds = Math.max((0, _moment.default)(expiresAt).diff(_moment.default.now(), "s"), 0);
      updated = Math.floor(seconds / 60).toString().padStart(2, "0") + ":" + (seconds % 60).toString().padStart(2, "0");
    }

    if (updated !== remainingSeconds) {
      setRemainingSeconds(updated);
    }
  }, [expiresAt, remainingSeconds]);
  (0, _react.useEffect)(function () {
    updateRemainingSeconds();
    var timer = setInterval(updateRemainingSeconds, 500);
    return function () {
      return clearInterval(timer);
    };
  }, [updateRemainingSeconds]);

  var _useWithLoading = (0, _hook.useWithLoading)(),
      loading = _useWithLoading.loading,
      errors = _useWithLoading.errors,
      setErrors = _useWithLoading.setErrors,
      withLoading = _useWithLoading.withLoading;

  var _useNavigation = (0, _hook.useNavigation)(),
      nav = _useNavigation.nav,
      route = _useNavigation.route;

  var _route$params$callbac = route.params.callback,
      callback = _route$params$callbac === void 0 ? "" : _route$params$callbac;

  var _withLoading = withLoading(function () {
    return dispatch("verify_phone.send", {
      phone_number: state.session.verifyPhone.phoneNumber
    }).then(function (s) {
      setErrors({});

      if (s.session.dev && s.session.dev.verifyPhoneSecret) {
        console.debug("set secret automatically by dev mode");
        setSecret(s.session.dev.verifyPhoneSecret);
      }

      updateRemainingSeconds();
    }).catch(function (errs) {
      return setErrors(errs);
    });
  }, [state]),
      _withLoading2 = (0, _slicedToArray2.default)(_withLoading, 2),
      handleSend = _withLoading2[0],
      handleSendLoading = _withLoading2[1];

  var _withLoading3 = withLoading(function () {
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
  }, [callback]),
      _withLoading4 = (0, _slicedToArray2.default)(_withLoading3, 2),
      handleCancel = _withLoading4[0],
      handleCancelLoading = _withLoading4[1];

  var _withLoading5 = withLoading(function () {
    return dispatch("verify_phone.verify", {
      phone_number: state.session.verifyPhone.phoneNumber,
      secret: secret,
      callback: callback
    }).then(function () {
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
    }).catch(function (errs) {
      return setErrors(errs);
    });
  }, [callback, state, secret, nav]),
      _withLoading6 = (0, _slicedToArray2.default)(_withLoading5, 2),
      handleVerify = _withLoading6[0],
      handleVerifyLoading = _withLoading6[1];

  return _react.default.createElement(_component.ScreenLayout, {
    title: "Verify phone number",
    subtitle: state.session.verifyPhone.phoneNumber,
    buttons: [].concat((0, _toConsumableArray2.default)(expiresAt ? [{
      status: "primary",
      children: "Verify",
      onPress: handleVerify,
      loading: handleVerifyLoading,
      tabIndex: 111
    }] : []), [{
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
    }]),
    loading: loading,
    error: errors.global,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 110
    },
    __self: this
  }, expiresAt ? _react.default.createElement(_react.default.Fragment, null, _react.default.createElement(_component.Text, {
    style: {
      marginBottom: 30
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 140
    },
    __self: this
  }, "Enter the received 6-digit verification code."), _react.default.createElement(_component.FormInput, {
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
    __self: this
  })) : _react.default.createElement(_react.default.Fragment, null, _react.default.createElement(_component.Text, {
    style: {
      marginBottom: 30
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 159
    },
    __self: this
  }, "A text message with a verification code will be sent to verify the phone number."), _react.default.createElement(_reactNative.Image, {
    source: {
      uri: _screen_verify.default
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
    __self: this
  })));
};

exports.VerifyPhoneVerifyScreen = VerifyPhoneVerifyScreen;

/***/ }),

/***/ "./src/service-worker.ts":
/*!*******************************!*\
  !*** ./src/service-worker.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = register;
exports.unregister = unregister;
var isLocalhost = Boolean(window.location.hostname === "localhost" || window.location.hostname === "[::1]" || window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));

function register(config) {
  if (false) { var publicUrl; }
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker.register(swUrl).then(function (registration) {
    registration.onupdatefound = function () {
      var installingWorker = registration.installing;

      if (installingWorker == null) {
        return;
      }

      installingWorker.onstatechange = function () {
        if (installingWorker.state === "installed") {
          if (navigator.serviceWorker.controller) {
            console.log("New content is available and will be used when all " + "tabs for this page are closed. See https://bit.ly/CRA-PWA.");

            if (config && config.onUpdate) {
              config.onUpdate(registration);
            }
          } else {
            console.log("Content is cached for offline use.");

            if (config && config.onSuccess) {
              config.onSuccess(registration);
            }
          }
        }
      };
    };
  }).catch(function (error) {
    console.error("Error during service worker registration:", error);
  });
}

function checkValidServiceWorker(swUrl, config) {
  fetch(swUrl).then(function (response) {
    var contentType = response.headers.get("content-type");

    if (response.status === 404 || contentType != null && contentType.indexOf("javascript") === -1) {
      navigator.serviceWorker.ready.then(function (registration) {
        registration.unregister().then(function () {
          window.location.reload();
        });
      });
    } else {
      registerValidSW(swUrl, config);
    }
  }).catch(function () {
    console.log("No internet connection found. App is running in offline mode.");
  });
}

function unregister() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready.then(function (registration) {
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

},[[1,"runtime-main",0]]]);
//# sourceMappingURL=main.chunk.js.map