(this["webpackJsonpmoleculer-iam-interaction-renderer"] = this["webpackJsonpmoleculer-iam-interaction-renderer"] || []).push([["main"],{

/***/ "../../node_modules/css-loader/dist/cjs.js?!../../node_modules/postcss-loader/src/index.js?!./src/styles.css":
/*!***************************************************************************************************************************************************************************************************************!*\
  !*** /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/css-loader/dist/cjs.js??ref--6-oneOf-3-1!/Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/postcss-loader/src??postcss!./src/styles.css ***!
  \***************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "../../node_modules/css-loader/dist/runtime/api.js");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, "body {\n  margin: 0;\n  padding: 0;\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", \"Roboto\", \"Oxygen\",\n    \"Ubuntu\", \"Cantarell\", \"Fira Sans\", \"Droid Sans\", \"Helvetica Neue\",\n    sans-serif;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\ncode {\n  font-family: source-code-pro, Menlo, Monaco, Consolas, \"Courier New\",\n    monospace;\n}\n\n@font-face {\n  font-family: SegoeUI;\n  src:\n    local(\"Segoe UI Light\"),\n    url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/light/latest.woff2) format(\"woff2\"),\n    url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/light/latest.woff) format(\"woff\"),\n    url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/light/latest.ttf) format(\"truetype\");\n  font-weight: 100;\n}\n\n@font-face {\n  font-family: SegoeUI;\n  src:\n    local(\"Segoe UI Semilight\"),\n    url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/semilight/latest.woff2) format(\"woff2\"),\n    url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/semilight/latest.woff) format(\"woff\"),\n    url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/semilight/latest.ttf) format(\"truetype\");\n  font-weight: 200;\n}\n\n@font-face {\n  font-family: SegoeUI;\n  src:\n    local(\"Segoe UI\"),\n    url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/normal/latest.woff2) format(\"woff2\"),\n    url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/normal/latest.woff) format(\"woff\"),\n    url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/normal/latest.ttf) format(\"truetype\");\n  font-weight: 400;\n}\n\n@font-face {\n  font-family: SegoeUI;\n  src:\n    local(\"Segoe UI Bold\"),\n    url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/bold/latest.woff2) format(\"woff2\"),\n    url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/bold/latest.woff) format(\"woff\"),\n    url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/bold/latest.ttf) format(\"truetype\");\n  font-weight: 600;\n}\n\n@font-face {\n  font-family: SegoeUI;\n  src:\n    local(\"Segoe UI Semibold\"),\n    url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/semibold/latest.woff2) format(\"woff2\"),\n    url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/semibold/latest.woff) format(\"woff\"),\n    url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/semibold/latest.ttf) format(\"truetype\");\n  font-weight: 700;\n}\n\n#root {\n  height: 100vh;\n}\n\n#root > div {\n  height: 100%;\n  max-width: 100vw;\n  margin: 0 auto;\n}\n\n/* set small width size for non-mobile devices */\n@media (min-width: 640px) {\n  #root > div {\n    width: 375px;\n  }\n}\n", ""]);
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
      error_description: "unrecognized state received from server"
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

var _interopRequireDefault = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.App = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _stack = __webpack_require__(/*! @react-navigation/stack */ "../../node_modules/@react-navigation/stack/lib/module/index.js");

var _consent = __webpack_require__(/*! ../screen/consent */ "./src/screen/consent.tsx");

var _error = __webpack_require__(/*! ../screen/error */ "./src/screen/error.tsx");

var _routes = __webpack_require__(/*! ./routes */ "./src/app/routes.ts");

var _options = __webpack_require__(/*! ./options */ "./src/app/options.tsx");

var _state = __webpack_require__(/*! ./state */ "./src/app/state.tsx");

var _navigation = __webpack_require__(/*! ./navigation */ "./src/app/navigation.tsx");

var _find_email = __webpack_require__(/*! ../screen/find_email.index */ "./src/screen/find_email.index.tsx");

var _find_email2 = __webpack_require__(/*! ../screen/find_email.verify */ "./src/screen/find_email.verify.tsx");

var _login = __webpack_require__(/*! ../screen/login.check_password */ "./src/screen/login.check_password.tsx");

var _login2 = __webpack_require__(/*! ../screen/login.index */ "./src/screen/login.index.tsx");

var _logout = __webpack_require__(/*! ../screen/logout.end */ "./src/screen/logout.end.tsx");

var _logout2 = __webpack_require__(/*! ../screen/logout.index */ "./src/screen/logout.index.tsx");

var _register = __webpack_require__(/*! ../screen/register.detail */ "./src/screen/register.detail.tsx");

var _register2 = __webpack_require__(/*! ../screen/register.end */ "./src/screen/register.end.tsx");

var _register3 = __webpack_require__(/*! ../screen/register.index */ "./src/screen/register.index.tsx");

var _reset_password = __webpack_require__(/*! ../screen/reset_password.end */ "./src/screen/reset_password.end.tsx");

var _reset_password2 = __webpack_require__(/*! ../screen/reset_password.index */ "./src/screen/reset_password.index.tsx");

var _reset_password3 = __webpack_require__(/*! ../screen/reset_password.sent */ "./src/screen/reset_password.sent.tsx");

var _reset_password4 = __webpack_require__(/*! ../screen/reset_password.set */ "./src/screen/reset_password.set.tsx");

var _verify_email = __webpack_require__(/*! ../screen/verify_email.end */ "./src/screen/verify_email.end.tsx");

var _verify_email2 = __webpack_require__(/*! ../screen/verify_email.index */ "./src/screen/verify_email.index.tsx");

var _verify_email3 = __webpack_require__(/*! ../screen/verify_email.verify */ "./src/screen/verify_email.verify.tsx");

var _verify_phone = __webpack_require__(/*! ../screen/verify_phone.end */ "./src/screen/verify_phone.end.tsx");

var _verify_phone2 = __webpack_require__(/*! ../screen/verify_phone.index */ "./src/screen/verify_phone.index.tsx");

var _verify_phone3 = __webpack_require__(/*! ../screen/verify_phone.verify */ "./src/screen/verify_phone.verify.tsx");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-interaction-renderer/src/app/app.tsx";

var App = function App() {
  return _react.default.createElement(_options.AppOptionsProvider, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 32
    },
    __self: this
  }, _react.default.createElement(_state.AppStateProvider, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 33
    },
    __self: this
  }, _react.default.createElement(_navigation.AppNavigationProvider, {
    routeConfig: _routes.routeConfig,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 34
    },
    __self: this
  }, _react.default.createElement(RootStack.Navigator, {
    screenOptions: screenOptions,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 35
    },
    __self: this
  }, _react.default.createElement(RootStack.Screen, {
    name: "error",
    component: _error.ErrorScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 38
    },
    __self: this
  }), _react.default.createElement(RootStack.Screen, {
    name: "consent",
    component: _consent.ConsentScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 42
    },
    __self: this
  }), _react.default.createElement(RootStack.Screen, {
    name: "login",
    component: LoginStackScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 46
    },
    __self: this
  }), _react.default.createElement(RootStack.Screen, {
    name: "find_email",
    component: FindEmailStackScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 50
    },
    __self: this
  }), _react.default.createElement(RootStack.Screen, {
    name: "reset_password",
    component: ResetPasswordStackScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 54
    },
    __self: this
  }), _react.default.createElement(RootStack.Screen, {
    name: "register",
    component: RegisterStackScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 58
    },
    __self: this
  }), _react.default.createElement(RootStack.Screen, {
    name: "logout",
    component: LogoutStackScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 62
    },
    __self: this
  }), _react.default.createElement(RootStack.Screen, {
    name: "verify_phone",
    component: VerifyPhoneStackScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 66
    },
    __self: this
  }), _react.default.createElement(RootStack.Screen, {
    name: "verify_email",
    component: VerifyEmailStackScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 70
    },
    __self: this
  })))));
};

exports.App = App;
var RootStack = (0, _stack.createStackNavigator)();
var screenOptions = {
  headerShown: false,
  cardStyle: {
    backgroundColor: "#ffffff"
  }
};
var LoginStack = (0, _stack.createStackNavigator)();

var LoginStackScreen = function LoginStackScreen() {
  return _react.default.createElement(LoginStack.Navigator, {
    screenOptions: screenOptions,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 91
    },
    __self: this
  }, _react.default.createElement(LoginStack.Screen, {
    name: "login.index",
    component: _login2.LoginIndexScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 94
    },
    __self: this
  }), _react.default.createElement(LoginStack.Screen, {
    name: "login.check_password",
    component: _login.LoginCheckPasswordScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 98
    },
    __self: this
  }));
};

var LogoutStack = (0, _stack.createStackNavigator)();

var LogoutStackScreen = function LogoutStackScreen() {
  return _react.default.createElement(LogoutStack.Navigator, {
    screenOptions: screenOptions,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 107
    },
    __self: this
  }, _react.default.createElement(LogoutStack.Screen, {
    name: "logout.index",
    component: _logout2.LogoutIndexScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 110
    },
    __self: this
  }), _react.default.createElement(LogoutStack.Screen, {
    name: "logout.end",
    component: _logout.LogoutEndScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 114
    },
    __self: this
  }));
};

var FindEmailStack = (0, _stack.createStackNavigator)();

var FindEmailStackScreen = function FindEmailStackScreen() {
  return _react.default.createElement(FindEmailStack.Navigator, {
    screenOptions: screenOptions,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 123
    },
    __self: this
  }, _react.default.createElement(FindEmailStack.Screen, {
    name: "find_email.index",
    component: _find_email.FindEmailIndexScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 126
    },
    __self: this
  }), _react.default.createElement(FindEmailStack.Screen, {
    name: "find_email.verify",
    component: _find_email2.FindEmailVerifyScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 130
    },
    __self: this
  }));
};

var ResetPasswordStack = (0, _stack.createStackNavigator)();

var ResetPasswordStackScreen = function ResetPasswordStackScreen() {
  return _react.default.createElement(ResetPasswordStack.Navigator, {
    screenOptions: screenOptions,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 139
    },
    __self: this
  }, _react.default.createElement(ResetPasswordStack.Screen, {
    name: "reset_password.index",
    component: _reset_password2.ResetPasswordIndexScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 142
    },
    __self: this
  }), _react.default.createElement(ResetPasswordStack.Screen, {
    name: "reset_password.sent",
    component: _reset_password3.ResetPasswordSentScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 146
    },
    __self: this
  }), _react.default.createElement(ResetPasswordStack.Screen, {
    name: "reset_password.set",
    component: _reset_password4.ResetPasswordSetScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 150
    },
    __self: this
  }), _react.default.createElement(ResetPasswordStack.Screen, {
    name: "reset_password.end",
    component: _reset_password.ResetPasswordEndScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 154
    },
    __self: this
  }));
};

var RegisterStack = (0, _stack.createStackNavigator)();

var RegisterStackScreen = function RegisterStackScreen() {
  return _react.default.createElement(RegisterStack.Navigator, {
    screenOptions: screenOptions,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 163
    },
    __self: this
  }, _react.default.createElement(RegisterStack.Screen, {
    name: "register.index",
    component: _register3.RegisterIndexScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 166
    },
    __self: this
  }), _react.default.createElement(RegisterStack.Screen, {
    name: "register.detail",
    component: _register.RegisterDetailScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 170
    },
    __self: this
  }), _react.default.createElement(RegisterStack.Screen, {
    name: "register.end",
    component: _register2.RegisterEndScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 174
    },
    __self: this
  }));
};

var VerifyPhoneStack = (0, _stack.createStackNavigator)();

var VerifyPhoneStackScreen = function VerifyPhoneStackScreen() {
  return _react.default.createElement(VerifyPhoneStack.Navigator, {
    screenOptions: screenOptions,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 183
    },
    __self: this
  }, _react.default.createElement(VerifyPhoneStack.Screen, {
    name: "verify_phone.index",
    component: _verify_phone2.VerifyPhoneIndexScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 186
    },
    __self: this
  }), _react.default.createElement(VerifyPhoneStack.Screen, {
    name: "verify_phone.verify",
    component: _verify_phone3.VerifyPhoneVerifyScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 190
    },
    __self: this
  }), _react.default.createElement(VerifyPhoneStack.Screen, {
    name: "verify_phone.end",
    component: _verify_phone.VerifyPhoneEndScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 194
    },
    __self: this
  }));
};

var VerifyEmailStack = (0, _stack.createStackNavigator)();

var VerifyEmailStackScreen = function VerifyEmailStackScreen() {
  return _react.default.createElement(VerifyEmailStack.Navigator, {
    screenOptions: screenOptions,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 203
    },
    __self: this
  }, _react.default.createElement(VerifyEmailStack.Screen, {
    name: "verify_email.index",
    component: _verify_email2.VerifyEmailIndexScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 206
    },
    __self: this
  }), _react.default.createElement(VerifyEmailStack.Screen, {
    name: "verify_email.verify",
    component: _verify_email3.VerifyEmailVerifyScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 210
    },
    __self: this
  }), _react.default.createElement(VerifyEmailStack.Screen, {
    name: "verify_email.end",
    component: _verify_email.VerifyEmailEndScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 214
    },
    __self: this
  }));
};

/***/ }),

/***/ "./src/app/index.tsx":
/*!***************************!*\
  !*** ./src/app/index.tsx ***!
  \***************************/
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

var _state = __webpack_require__(/*! ./state */ "./src/app/state.tsx");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-interaction-renderer/src/app/navigation.tsx";

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

        if (appState.name) {
          var route = getMatchedRoute(navState);

          if (route && route.name !== appState.name) {
            console.warn("appState.name differs from matched route", appState.name, route);
          }
        }
      }

      console.debug("nav state update:", navState);
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
      lineNumber: 54
    },
    __self: this
  }, children);
};

exports.AppNavigationProvider = AppNavigationProvider;

function getMatchedRoute(state) {
  var route = state.routes && state.routes[0];
  if (!route) return;

  if (route.state) {
    return getMatchedRoute(route.state);
  }

  return route;
}

function useNavigation() {
  var route = (0, _native.useRoute)();
  if (!route.params) route.params = {};
  var nav = (0, _core.useNavigation)();
  var navigate = nav.navigate;

  nav.navigate = function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    includeLocaleQuery(args, route);
    return navigate.apply(void 0, (0, _toConsumableArray2.default)(args));
  };

  return {
    nav: nav,
    route: route
  };
}

function includeLocaleQuery(args, route) {
  if (route.params.locale) {
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

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-interaction-renderer/src/app/options.tsx";
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
        align: "left"
      },
      login: {
        federationOptionsVisibleDefault: false
      },
      theme: {}
    });
    return _this;
  }

  (0, _createClass2.default)(AppOptionsProvider, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState, snapshot) {
      console.log(prevState);
    }
  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement(AppOptionsContext.Provider, {
        value: [this.state, this.setState.bind(this)],
        __source: {
          fileName: _jsxFileName,
          lineNumber: 34
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
  "login": {
    screens: {
      "login.check_password": prefix + "/login/check_password",
      "login.index": prefix + "/login"
    }
  },
  "consent": prefix + "/consent",
  "logout": {
    screens: {
      "logout.end": prefix + "/session/end/success",
      "logout.index": prefix + "/session/end"
    }
  },
  "find_email": {
    screens: {
      "find_email.verify": prefix + "/find_email/verify",
      "find_email.index": prefix + "/find_email"
    }
  },
  "reset_password": {
    screens: {
      "reset_password.end": prefix + "/reset_password/end",
      "reset_password.set": prefix + "/reset_password/set",
      "reset_password.sent": prefix + "/reset_password/sent",
      "reset_password.index": prefix + "/reset_password"
    }
  },
  "register": {
    screens: {
      "register.end": prefix + "/register/end",
      "register.detail": prefix + "/register/detail",
      "register.index": prefix + "/register"
    }
  },
  "verify_phone": {
    screens: {
      "verify_phone.end": prefix + "/verify_phone/end",
      "verify_phone.verify": prefix + "/verify_phone/verify",
      "verify_phone.index": prefix + "/verify_phone"
    }
  },
  "verify_email": {
    screens: {
      "verify_email.end": prefix + "/verify_email/end",
      "verify_email.verify": prefix + "/verify_email/verify",
      "verify_email.index": prefix + "/verify_email"
    }
  },
  "error": ""
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

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-interaction-renderer/src/app/state.tsx";
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
          actions,
          action,
          err,
          url,
          _action$urlencoded,
          urlencoded,
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
              actions = _this.state.appState.actions;
              action = actions && actions[name];

              if (action) {
                _context.next = 7;
                break;
              }

              err = {
                global: "Cannot call unsupported action."
              };
              console.error(err, _this.state);
              throw err;

            case 7:
              url = action.url, _action$urlencoded = action.urlencoded, urlencoded = _action$urlencoded === void 0 ? false : _action$urlencoded, method = action.method, payload = action.payload;
              mergedPayload = (0, _objectSpread2.default)({}, payload, {}, userPayload);

              if (!urlencoded) {
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
              return _context.abrupt("return", fetch(action.url, {
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
                      var _err = data.error.fields.reduce(function (e, item) {
                        e[item.field] = e[item.field] || item.message;
                        return e;
                      }, {});

                      console.error(_err, data);
                      throw _err;
                    } else {
                      var _err2 = {
                        global: typeof data.error === "object" ? data.error.error_description || data.error.error || JSON.stringify(data.error) : data.error.toString()
                      };
                      console.error(_err2, data);
                      throw _err2;
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
                    console.error("interaction state response received from XHR", data);
                  } else {
                    console.error("unrecognized response structure", data);
                  }

                  return _this.state.appState;
                });
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

      if (error) {
        return _react.default.createElement(_error.ClientErrorScreen, {
          error: error,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 24
          },
          __self: this
        });
      }

      return _react.default.createElement(AppStateContext.Provider, {
        value: [appState, this.dispatch],
        __source: {
          fileName: _jsxFileName,
          lineNumber: 28
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

var _app = __webpack_require__(/*! ./app */ "./src/app/index.tsx");

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
  var callWithLoading = (0, _react.useCallback)(function _callee(callback) {
    return _regenerator.default.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!loading) {
              _context.next = 2;
              break;
            }

            return _context.abrupt("return");

          case 2:
            setLoading(true);
            setErrors({});
            _context.prev = 4;
            _context.next = 7;
            return _regenerator.default.awrap(callback());

          case 7:
            _context.next = 13;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](4);
            console.error(_context.t0);
            setErrors({
              global: _context.t0.toString()
            });

          case 13:
            _context.prev = 13;
            setTimeout(function () {
              return !unmounted.current && setLoading(false);
            }, 500);
            return _context.finish(13);

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[4, 9, 13, 16]]);
  }, [loading]);

  var withLoading = function withLoading(callback) {
    var deps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    return (0, _react.useCallback)(function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return callWithLoading(function () {
        return callback.apply(void 0, args);
      });
    }, [callback].concat((0, _toConsumableArray2.default)(deps)));
  };

  return {
    withLoading: withLoading,
    loading: loading,
    setLoading: setLoading,
    errors: errors,
    setErrors: setErrors
  };
}

function useClose() {
  var tryGoBack = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

  var _useState5 = (0, _react.useState)(false),
      _useState6 = (0, _slicedToArray2.default)(_useState5, 2),
      closed = _useState6[0],
      setClosed = _useState6[1];

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

/***/ "./src/image/logo.svg":
/*!****************************!*\
  !*** ./src/image/logo.svg ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/media/logo.060b0e6c.svg";

/***/ }),

/***/ "./src/image/screen_password.svg":
/*!***************************************!*\
  !*** ./src/image/screen_password.svg ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/media/screen_password.8f6c6a92.svg";

/***/ }),

/***/ "./src/image/screen_sent.svg":
/*!***********************************!*\
  !*** ./src/image/screen_sent.svg ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/media/screen_sent.1ae0604c.svg";

/***/ }),

/***/ "./src/image/screen_verify.svg":
/*!*************************************!*\
  !*** ./src/image/screen_verify.svg ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/media/screen_verify.465fe378.svg";

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

var _app = __webpack_require__(/*! ./app */ "./src/app/index.tsx");

__webpack_require__(/*! ./styles */ "./src/styles.ts");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-interaction-renderer/src/index.tsx";

_reactDom.default.render(_react.default.createElement(_app.App, {
  __source: {
    fileName: _jsxFileName,
    lineNumber: 7
  },
  __self: this
}), document.getElementById("root"));

serviceWorker.unregister();

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

var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/slicedToArray */ "../../node_modules/@babel/runtime/helpers/esm/slicedToArray.js"));

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _styles = __webpack_require__(/*! ../styles */ "./src/styles.ts");

var _hook = __webpack_require__(/*! ../hook */ "./src/hook.ts");

var _layout = __webpack_require__(/*! ./layout */ "./src/screen/layout.tsx");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-interaction-renderer/src/screen/consent.tsx";

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

  var handleAccept = withLoading(function () {
    return dispatch("consent.accept").catch(function (err) {
      return setErrors(err);
    });
  });
  var handleChangeAccount = withLoading(function () {
    return nav.navigate("login", {
      screen: "login.index",
      params: {}
    });
  });
  var user = state.user;
  var client = state.client;
  var consent = state.session.consent;
  return _react.default.createElement(_layout.ScreenLayout, {
    title: _react.default.createElement("span", {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 39
      },
      __self: this
    }, "Sign in to ", _react.default.createElement(_styles.Link, {
      href: client.client_uri,
      target: "_blank",
      style: {
        color: _styles.ThemeStyles.palette.orange
      },
      variant: "xxLarge",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 39
      },
      __self: this
    }, client.name)),
    buttons: [{
      primary: true,
      text: "Continue",
      onClick: handleAccept,
      loading: loading,
      tabIndex: 1,
      autoFocus: true
    }, {
      text: "Change account",
      onClick: handleChangeAccount,
      loading: loading,
      tabIndex: 3
    }],
    footer: _react.default.createElement(_styles.Text, {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 63
      },
      __self: this
    }, "To continue, you need to offer ", consent.scopes.new.concat(consent.scopes.accepted).join(", "), " information. Before consent this application, you could review the ", _react.default.createElement(_styles.Link, {
      href: client.client_uri,
      target: "_blank",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 65
      },
      __self: this
    }, client.name), "'s ", _react.default.createElement(_styles.Link, {
      href: client.policy_uri,
      target: "_blank",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 65
      },
      __self: this
    }, "privacy policy"), " and ", _react.default.createElement(_styles.Link, {
      href: client.tos_uri,
      target: "_blank",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 65
      },
      __self: this
    }, "terms of service"), "."),
    error: errors.global,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 38
    },
    __self: this
  }, _react.default.createElement(_styles.Persona, {
    text: user.name,
    secondaryText: user.email,
    size: _styles.PersonaSize.size56,
    imageUrl: user.picture,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 71
    },
    __self: this
  }));
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

var _layout = __webpack_require__(/*! ./layout */ "./src/screen/layout.tsx");

var _hook = __webpack_require__(/*! ../hook */ "./src/hook.ts");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-interaction-renderer/src/screen/error.tsx";

var ErrorScreen = function ErrorScreen() {
  var _useAppState = (0, _hook.useAppState)(),
      _useAppState2 = (0, _slicedToArray2.default)(_useAppState, 2),
      state = _useAppState2[0],
      dispatch = _useAppState2[1];

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
    buttons: [{
      primary: false,
      text: "Close",
      loading: closed,
      tabIndex: 1,
      onClick: close
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
      lineNumber: 29
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
      lineNumber: 33
    },
    __self: this
  }, props.error.stack));
};

exports.ClientErrorScreen = ClientErrorScreen;

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

var _layout = __webpack_require__(/*! ./layout */ "./src/screen/layout.tsx");

var _styles = __webpack_require__(/*! ../styles */ "./src/styles.ts");

var _hook = __webpack_require__(/*! ../hook */ "./src/hook.ts");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-interaction-renderer/src/screen/find_email.index.tsx";

var FindEmailIndexScreen = function FindEmailIndexScreen() {
  var _useNavigation = (0, _hook.useNavigation)(),
      nav = _useNavigation.nav,
      route = _useNavigation.route;

  var _useState = (0, _react.useState)(route.params.phoneNumber || ""),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      phoneNumber = _useState2[0],
      setPhoneNumber = _useState2[1];

  var _useWithLoading = (0, _hook.useWithLoading)(),
      loading = _useWithLoading.loading,
      errors = _useWithLoading.errors,
      setErrors = _useWithLoading.setErrors,
      withLoading = _useWithLoading.withLoading;

  var _useAppState = (0, _hook.useAppState)(),
      _useAppState2 = (0, _slicedToArray2.default)(_useAppState, 2),
      state = _useAppState2[0],
      dispatch = _useAppState2[1];

  var handleCheckPhoneNumber = withLoading(function () {
    dispatch("find_email.check_phone").then(function (data) {
      console.log(data);
      nav.navigate("find_email", {
        screen: "find_email.verify",
        params: {
          phoneNumber: phoneNumber
        }
      });
    }).catch(function (err) {
      return setErrors(err);
    });
  }, [phoneNumber, state]);
  var handleCancel = withLoading(function () {
    return nav.navigate("login", {
      screen: "login.index",
      params: {}
    });
  });
  return _react.default.createElement(_layout.ScreenLayout, {
    title: "Find email",
    subtitle: "Enter your phone number",
    buttons: [{
      primary: true,
      text: "Continue",
      onClick: handleCheckPhoneNumber,
      loading: loading,
      tabIndex: 22
    }, {
      text: "Cancel",
      onClick: handleCancel,
      loading: loading,
      tabIndex: 23,
      hidden: state.name === "find_email"
    }],
    error: errors.global,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 33
    },
    __self: this
  }, _react.default.createElement(_styles.Text, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 54
    },
    __self: this
  }, "Have a registered phone number? Can find the ID only if have one."), _react.default.createElement(_styles.TextField, {
    label: "Phone number",
    type: "tel",
    inputMode: "tel",
    placeholder: "Enter your mobile phone number",
    autoFocus: true,
    tabIndex: 21,
    value: phoneNumber,
    errorMessage: errors.phone_number,
    onChange: function onChange(e, v) {
      return setPhoneNumber(v || "");
    },
    onKeyUp: function onKeyUp(e) {
      return e.key === "Enter" && handleCheckPhoneNumber();
    },
    styles: _styles.TextFieldStyles.bold,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 57
    },
    __self: this
  }));
};

exports.FindEmailIndexScreen = FindEmailIndexScreen;

/***/ }),

/***/ "./src/screen/find_email.verify.tsx":
/*!******************************************!*\
  !*** ./src/screen/find_email.verify.tsx ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _interopRequireDefault = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FindEmailVerifyScreen = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _layout = __webpack_require__(/*! ./layout */ "./src/screen/layout.tsx");

var _styles = __webpack_require__(/*! ../styles */ "./src/styles.ts");

var _hook = __webpack_require__(/*! ../hook */ "./src/hook.ts");

var _screen_sent = _interopRequireDefault(__webpack_require__(/*! ../image/screen_sent.svg */ "./src/image/screen_sent.svg"));

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-interaction-renderer/src/screen/find_email.verify.tsx";

var FindEmailVerifyScreen = function FindEmailVerifyScreen() {
  var _useWithLoading = (0, _hook.useWithLoading)(),
      loading = _useWithLoading.loading,
      errors = _useWithLoading.errors,
      setErrors = _useWithLoading.setErrors,
      withLoading = _useWithLoading.withLoading;

  var _useNavigation = (0, _hook.useNavigation)(),
      nav = _useNavigation.nav,
      route = _useNavigation.route;

  var handleDone = withLoading(function () {
    return nav.navigate("login", {
      screen: "login.index",
      params: {}
    });
  });
  var _route$params$phoneNu = route.params.phoneNumber,
      phoneNumber = _route$params$phoneNu === void 0 ? "" : _route$params$phoneNu;
  return _react.default.createElement(_layout.ScreenLayout, {
    title: "Find email",
    subtitle: phoneNumber,
    buttons: [{
      primary: true,
      text: "Done",
      onClick: handleDone,
      loading: loading,
      tabIndex: 31
    }],
    error: errors.global,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 21
    },
    __self: this
  }, _react.default.createElement(_styles.Text, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 35
    },
    __self: this
  }, "Account email address has been sent to your mobile device."), _react.default.createElement(_styles.Image, {
    src: _screen_sent.default,
    styles: {
      root: {
        minHeight: "270px"
      },
      image: {
        width: "100%"
      }
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 38
    },
    __self: this
  }));
};

exports.FindEmailVerifyScreen = FindEmailVerifyScreen;

/***/ }),

/***/ "./src/screen/layout.tsx":
/*!*******************************!*\
  !*** ./src/screen/layout.tsx ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _interopRequireDefault = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScreenLayout = void 0;

var _objectSpread2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/objectSpread2 */ "../../node_modules/@babel/runtime/helpers/esm/objectSpread2.js"));

var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/slicedToArray */ "../../node_modules/@babel/runtime/helpers/esm/slicedToArray.js"));

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _reactNative = __webpack_require__(/*! react-native */ "../../node_modules/react-native-web/dist/index.js");

var _hook = __webpack_require__(/*! ../hook */ "./src/hook.ts");

var _styles = __webpack_require__(/*! ../styles */ "./src/styles.ts");

var _logo = _interopRequireDefault(__webpack_require__(/*! ../image/logo.svg */ "./src/image/logo.svg"));

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-interaction-renderer/src/screen/layout.tsx";

var ScreenLayout = function ScreenLayout(props) {
  var _useAppOptions = (0, _hook.useAppOptions)(),
      _useAppOptions2 = (0, _slicedToArray2.default)(_useAppOptions, 1),
      options = _useAppOptions2[0];

  var _props$title = props.title,
      title = _props$title === void 0 ? "TODO" : _props$title,
      _props$subtitle = props.subtitle,
      subtitle = _props$subtitle === void 0 ? null : _props$subtitle,
      _props$children = props.children,
      children = _props$children === void 0 ? null : _props$children,
      _props$buttons = props.buttons,
      buttons = _props$buttons === void 0 ? [] : _props$buttons,
      _props$error = props.error,
      error = _props$error === void 0 ? null : _props$error,
      _props$footer = props.footer,
      footer = _props$footer === void 0 ? null : _props$footer;
  return _react.default.createElement(_reactNative.ScrollView, {
    contentContainerStyle: {
      marginTop: "auto",
      marginBottom: "auto"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 25
    },
    __self: this
  }, _react.default.createElement(_styles.Stack, {
    horizontalAlign: "stretch",
    verticalAlign: "center",
    verticalFill: true,
    styles: {
      root: {
        width: "100%",
        padding: "30px"
      }
    },
    tokens: {
      childrenGap: 30
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 26
    },
    __self: this
  }, _react.default.createElement(_styles.Image, {
    src: options.logo.uri || _logo.default,
    styles: {
      root: {
        height: "47px",
        textAlign: options.logo.align
      },
      image: {
        maxWidth: "100%",
        maxHeight: "100%",
        display: "inline-block"
      }
    },
    shouldFadeIn: false,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 38
    },
    __self: this
  }), _react.default.createElement(_styles.Stack, {
    tokens: {
      childrenGap: 5
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 40
    },
    __self: this
  }, _react.default.createElement(_styles.Text, {
    variant: "xLargePlus",
    styles: {
      root: {
        fontWeight: _styles.FontWeights.regular
      }
    },
    children: title,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 41
    },
    __self: this
  }), _react.default.createElement(_styles.Text, {
    variant: "large",
    children: subtitle,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 46
    },
    __self: this
  })), _react.default.createElement(_styles.Stack, {
    tokens: {
      childrenGap: 15
    },
    children: children,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 49
    },
    __self: this
  }), _react.default.createElement(_styles.Stack, {
    tokens: {
      childrenGap: 15
    },
    verticalAlign: "end",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 51
    },
    __self: this
  }, error ? _react.default.createElement(_styles.Text, {
    styles: {
      root: (0, _objectSpread2.default)({}, _styles.AnimationStyles.slideDownIn20, {}, _styles.LabelStyles.fieldErrorMessage.root)
    },
    children: typeof error === "string" ? error : JSON.stringify(error || "Unknown Error."),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 52
    },
    __self: this
  }) : null, buttons.map(function (_ref, index) {
    var hidden = _ref.hidden,
        primary = _ref.primary,
        text = _ref.text,
        onClick = _ref.onClick,
        autoFocus = _ref.autoFocus,
        loading = _ref.loading,
        tabIndex = _ref.tabIndex;
    if (hidden === true) return null;
    var Button = primary ? _styles.PrimaryButton : _styles.DefaultButton;
    return _react.default.createElement(Button, {
      key: index,
      tabIndex: tabIndex,
      autoFocus: autoFocus,
      checked: loading === true,
      allowDisabledFocus: true,
      text: text,
      styles: _styles.ButtonStyles.large,
      onClick: loading ? undefined : onClick,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 56
      },
      __self: this
    });
  }), footer)));
};

exports.ScreenLayout = ScreenLayout;

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

var _layout = __webpack_require__(/*! ./layout */ "./src/screen/layout.tsx");

var _styles = __webpack_require__(/*! ../styles */ "./src/styles.ts");

var _hook = __webpack_require__(/*! ../hook */ "./src/hook.ts");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-interaction-renderer/src/screen/login.check_password.tsx";

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

  var handleCheckLoginPassword = withLoading(function _callee() {
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
  }, [email, password]);
  var handleResetPassword = withLoading(function () {
    return nav.navigate("reset_password", {
      screen: "reset_password.index",
      params: {
        email: email
      }
    });
  }, [email]);
  var handleCancel = withLoading(function () {
    return nav.navigate("login", {
      screen: "login.index",
      params: {
        email: email
      }
    });
  }, [email]);
  return _react.default.createElement(_layout.ScreenLayout, {
    title: "Hi, " + name,
    subtitle: email,
    buttons: [{
      primary: true,
      text: "Sign in",
      onClick: handleCheckLoginPassword,
      loading: loading,
      tabIndex: 22
    }, {
      text: "Cancel",
      onClick: handleCancel,
      tabIndex: 23
    }],
    error: errors.global,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 37
    },
    __self: this
  }, _react.default.createElement("form", {
    onSubmit: function onSubmit(e) {
      e.preventDefault();
      handleCheckLoginPassword();
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 56
    },
    __self: this
  }, _react.default.createElement("input", {
    type: "text",
    name: "username",
    value: email,
    style: {
      display: "none"
    },
    readOnly: true,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 57
    },
    __self: this
  }), _react.default.createElement(_styles.TextField, {
    label: "Password",
    autoComplete: "password",
    name: "password",
    type: "password",
    inputMode: "text",
    placeholder: "Enter your password",
    autoFocus: true,
    tabIndex: 21,
    value: password,
    errorMessage: errors.password,
    onChange: function onChange(e, v) {
      return setPassword(v || "");
    },
    onKeyUp: function onKeyUp(e) {
      return e.key === "Enter" && handleCheckLoginPassword();
    },
    styles: _styles.TextFieldStyles.bold,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 58
    },
    __self: this
  })), _react.default.createElement(_styles.Link, {
    tabIndex: 24,
    onClick: handleResetPassword,
    variant: "small",
    style: {
      marginTop: "10px"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 74
    },
    __self: this
  }, "Forgot password?"));
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

var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/slicedToArray */ "../../node_modules/@babel/runtime/helpers/esm/slicedToArray.js"));

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _layout = __webpack_require__(/*! ./layout */ "./src/screen/layout.tsx");

var _styles = __webpack_require__(/*! ../styles */ "./src/styles.ts");

var _hook = __webpack_require__(/*! ../hook */ "./src/hook.ts");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-interaction-renderer/src/screen/login.index.tsx";

var LoginIndexScreen = function LoginIndexScreen() {
  var _useNavigation = (0, _hook.useNavigation)(),
      nav = _useNavigation.nav,
      route = _useNavigation.route;

  var _useWithLoading = (0, _hook.useWithLoading)(),
      loading = _useWithLoading.loading,
      errors = _useWithLoading.errors,
      setErrors = _useWithLoading.setErrors,
      withLoading = _useWithLoading.withLoading;

  var _useState = (0, _react.useState)(route.params.email || ""),
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

  var _useState3 = (0, _react.useState)(options.login.federationOptionsVisibleDefault === true),
      _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
      federationOptionsVisible = _useState4[0],
      setFederationOptionsVisible = _useState4[1];

  var federationProviders = state.metadata.federationProviders;
  var handleCheckLoginEmail = withLoading(function () {
    return dispatch("login.check_email", {
      email: email
    }).then(function () {
      nav.navigate("login", {
        screen: "login.check_password",
        params: {
          email: email
        }
      });
    }).catch(function (err) {
      return setErrors(err);
    });
  }, [email]);
  (0, _react.useEffect)(function () {
    if (email) {
      console.debug("automatically continue with", email);
      handleCheckLoginEmail();
    }
  }, []);
  var handleFindEmail = withLoading(function () {
    return nav.navigate("find_email", {
      screen: "find_email.index"
    });
  });
  var handleSignUp = withLoading(function () {
    return nav.navigate("register", {
      screen: "register.index"
    });
  });
  var handleFederation = withLoading(function (provider) {
    return dispatch("login.federate", {
      provider: provider
    }).catch(function (err) {
      return setErrors(err);
    });
  });
  (0, _react.useEffect)(function () {
    return nav.addListener("blur", function () {
      setTimeout(function () {
        return setFederationOptionsVisible(false);
      }, 500);
    });
  }, [nav]);
  return _react.default.createElement(_layout.ScreenLayout, {
    title: "Sign In",
    subtitle: "Enter your account",
    error: errors.global,
    buttons: [{
      primary: true,
      text: "Continue",
      onClick: handleCheckLoginEmail,
      loading: loading,
      tabIndex: 12
    }, {
      text: "Sign up",
      onClick: handleSignUp,
      loading: loading,
      tabIndex: 13
    }],
    footer: federationProviders.length > 0 ? _react.default.createElement(_react.default.Fragment, null, _react.default.createElement(_styles.Separator, {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 85
      },
      __self: this
    }, _react.default.createElement("span", {
      style: {
        color: _styles.ThemeStyles.palette.neutralTertiary
      },
      __source: {
        fileName: _jsxFileName,
        lineNumber: 85
      },
      __self: this
    }, "OR")), federationOptionsVisible ? _react.default.createElement(_styles.Stack, {
      tokens: {
        childrenGap: 15
      },
      __source: {
        fileName: _jsxFileName,
        lineNumber: 87
      },
      __self: this
    }, federationProviders.includes("kakao") ? _react.default.createElement(_styles.PrimaryButton, {
      onClick: function onClick() {
        return handleFederation("kakao");
      },
      styles: _styles.ButtonStyles.largeThin,
      text: "Login with Kakao",
      style: {
        flex: "1 1 auto",
        backgroundColor: "#ffdc00",
        borderColor: "#ffb700",
        color: "black"
      },
      __source: {
        fileName: _jsxFileName,
        lineNumber: 89
      },
      __self: this
    }) : null, federationProviders.includes("facebook") ? _react.default.createElement(_styles.PrimaryButton, {
      onClick: function onClick() {
        return handleFederation("facebook");
      },
      styles: _styles.ButtonStyles.largeThin,
      text: "Login with Facebook",
      style: {
        flex: "1 1 auto",
        backgroundColor: "#1876f2",
        color: "white"
      },
      __source: {
        fileName: _jsxFileName,
        lineNumber: 97
      },
      __self: this
    }) : null, federationProviders.includes("google") ? _react.default.createElement(_styles.DefaultButton, {
      onClick: function onClick() {
        return handleFederation("google");
      },
      styles: _styles.ButtonStyles.largeThin,
      text: "Login with Google",
      style: {
        flex: "1 1 auto",
        backgroundColor: "#ffffff",
        borderWidth: 1,
        color: "black"
      },
      __source: {
        fileName: _jsxFileName,
        lineNumber: 105
      },
      __self: this
    }) : null) : _react.default.createElement(_styles.Link, {
      style: {
        color: _styles.ThemeStyles.palette.neutralTertiary
      },
      onClick: function onClick() {
        return setFederationOptionsVisible(true);
      },
      __source: {
        fileName: _jsxFileName,
        lineNumber: 121
      },
      __self: this
    }, "Find more login options?")) : undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 63
    },
    __self: this
  }, _react.default.createElement("form", {
    onSubmit: function onSubmit(e) {
      e.preventDefault();
      handleCheckLoginEmail();
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 127
    },
    __self: this
  }, _react.default.createElement(_styles.TextField, {
    label: "Email",
    name: "username",
    type: "text",
    inputMode: "email",
    autoComplete: "username",
    autoCapitalize: "off",
    autoCorrect: "off",
    autoFocus: true,
    placeholder: "Enter your email",
    tabIndex: 11,
    value: email,
    errorMessage: errors.email,
    onChange: function onChange(e, v) {
      return setEmail(v || "");
    },
    onKeyUp: function onKeyUp(e) {
      return e.key === "Enter" && handleCheckLoginEmail();
    },
    styles: _styles.TextFieldStyles.bold,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 128
    },
    __self: this
  })), _react.default.createElement(_styles.Link, {
    onClick: handleFindEmail,
    tabIndex: 14,
    variant: "small",
    style: {
      marginTop: "10px"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 146
    },
    __self: this
  }, "Forgot email?"));
};

exports.LoginIndexScreen = LoginIndexScreen;

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
exports.LogoutEndScreen = void 0;

var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/slicedToArray */ "../../node_modules/@babel/runtime/helpers/esm/slicedToArray.js"));

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _styles = __webpack_require__(/*! ../styles */ "./src/styles.ts");

var _hook = __webpack_require__(/*! ../hook */ "./src/hook.ts");

var _layout = __webpack_require__(/*! ./layout */ "./src/screen/layout.tsx");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-interaction-renderer/src/screen/logout.end.tsx";

var LogoutEndScreen = function LogoutEndScreen() {
  var _useClose = (0, _hook.useClose)(false),
      closed = _useClose.closed,
      close = _useClose.close;

  var _useAppState = (0, _hook.useAppState)(),
      _useAppState2 = (0, _slicedToArray2.default)(_useAppState, 1),
      state = _useAppState2[0];

  var user = state.user;
  return _react.default.createElement(_layout.ScreenLayout, {
    title: "Signed out",
    subtitle: user ? user.email : undefined,
    buttons: [{
      primary: false,
      text: "Close",
      onClick: close,
      loading: closed,
      tabIndex: 21
    }],
    error: closed ? "Please close the window manually." : undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 14
    },
    __self: this
  }, _react.default.createElement(_styles.Text, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 28
    },
    __self: this
  }, user ? "All your sessions are still alive." : "All your sessions have been destroyed."));
};

exports.LogoutEndScreen = LogoutEndScreen;

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

var _styles = __webpack_require__(/*! ../styles */ "./src/styles.ts");

var _hook = __webpack_require__(/*! ../hook */ "./src/hook.ts");

var _layout = __webpack_require__(/*! ./layout */ "./src/screen/layout.tsx");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-interaction-renderer/src/screen/logout.index.tsx";

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

  var user = state.user;
  var client = state.client;
  var handleSignOutAll = withLoading(function () {
    return dispatch("logout.confirm").catch(function (err) {
      return setErrors(err);
    });
  });
  var handleJustRedirect = withLoading(function () {
    return dispatch("logout.redirect").catch(function (err) {
      return setErrors(err);
    });
  });
  return _react.default.createElement(_layout.ScreenLayout, {
    title: client ? "Signed out" : "Sign out",
    subtitle: user.email,
    buttons: [{
      primary: true,
      text: "Done",
      onClick: handleJustRedirect,
      loading: loading,
      tabIndex: 1
    }, {
      primary: false,
      text: "Sign out all",
      onClick: handleSignOutAll,
      loading: loading,
      tabIndex: 2
    }],
    error: errors.global,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 24
    },
    __self: this
  }, _react.default.createElement(_styles.Text, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 45
    },
    __self: this
  }, client ? _react.default.createElement("span", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 46
    },
    __self: this
  }, "Signed out from ", _react.default.createElement(_styles.Link, {
    href: client.client_uri,
    target: "_blank",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 46
    },
    __self: this
  }, client.name), " successfully.", _react.default.createElement("br", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 46
    },
    __self: this
  })) : null, "Do you want to destroy all the sessions?"));
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

var _layout = __webpack_require__(/*! ./layout */ "./src/screen/layout.tsx");

var _styles = __webpack_require__(/*! ../styles */ "./src/styles.ts");

var _hook = __webpack_require__(/*! ../hook */ "./src/hook.ts");

var _moment = _interopRequireDefault(__webpack_require__(/*! moment */ "../../node_modules/moment/moment.js"));

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-interaction-renderer/src/screen/register.detail.tsx";

var RegisterDetailScreen = function RegisterDetailScreen() {
  var _useState = (0, _react.useState)({
    phone_number: "",
    birthdate: "",
    gender: ""
  }),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      payload = _useState2[0],
      setPayload = _useState2[1];

  var _useAppState = (0, _hook.useAppState)(),
      _useAppState2 = (0, _slicedToArray2.default)(_useAppState, 2),
      state = _useAppState2[0],
      dispatch = _useAppState2[1];

  var phoneNumberIsRequired = state.metadata.mandatoryScopes.includes("phone");
  (0, _react.useEffect)(function () {
    var stored = state.session.register;

    if (stored.scope && stored.scope.includes("birthdate") && stored.scope.includes("gender")) {
      var _stored$claims = stored.claims,
          phone_number = _stored$claims.phone_number,
          birthdate = _stored$claims.birthdate,
          gender = _stored$claims.gender;
      setPayload({
        phone_number: phone_number,
        birthdate: birthdate,
        gender: gender
      });
    }
  }, []);

  var _useNavigation = (0, _hook.useNavigation)(),
      nav = _useNavigation.nav;

  var _useWithLoading = (0, _hook.useWithLoading)(),
      loading = _useWithLoading.loading,
      errors = _useWithLoading.errors,
      setErrors = _useWithLoading.setErrors,
      withLoading = _useWithLoading.withLoading;

  var handlePayloadSubmit = withLoading(function _callee() {
    var stored, phone_number, birthdate, gender;
    return _regenerator.default.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            stored = state.session.register;
            phone_number = payload.phone_number, birthdate = payload.birthdate, gender = payload.gender;
            return _context.abrupt("return", dispatch("register.validate", {
              claims: (0, _objectSpread2.default)({}, stored.claims, {
                phone_number: phone_number ? state.locale.country + "|" + phone_number : undefined,
                birthdate: birthdate,
                gender: gender
              }),
              credentials: stored.credentials,
              scope: ["email", "profile", "birthdate", "gender"].concat(phoneNumberIsRequired || phone_number ? "phone" : [])
            }).then(function (newState) {
              if (payload.phone_number) {
                return dispatch("verify_phone.send", {
                  phone_number: newState.session.register.claims.phone_number,
                  register: true
                }).then(function () {
                  nav.navigate("verify_phone", {
                    screen: "verify_phone.verify",
                    params: {}
                  });
                });
              } else {
                nav.navigate("register", {
                  screen: "register.end"
                });
              }
            }).catch(function (err) {
              return setErrors(err);
            }));

          case 3:
          case "end":
            return _context.stop();
        }
      }
    });
  }, [payload]);
  var handleCancel = withLoading(function () {
    return nav.navigate("register", {
      screen: "register.index",
      params: {}
    });
  }, [nav]);
  var storedClaims = state.session.register.claims;
  return _react.default.createElement(_layout.ScreenLayout, {
    title: "Sign up",
    subtitle: storedClaims.email,
    buttons: [{
      primary: true,
      text: "Continue",
      onClick: handlePayloadSubmit,
      loading: loading,
      tabIndex: 64
    }, {
      text: "Cancel",
      onClick: handleCancel,
      loading: loading,
      tabIndex: 65
    }],
    error: errors.global,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 80
    },
    __self: this
  }, _react.default.createElement("form", {
    onSubmit: function onSubmit(e) {
      e.preventDefault();
      handlePayloadSubmit();
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 100
    },
    __self: this
  }, _react.default.createElement(_styles.Stack, {
    tokens: {
      childrenGap: 15
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 104
    },
    __self: this
  }, _react.default.createElement(_styles.Text, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 105
    },
    __self: this
  }, "Please enter the mobile phone number to find the your account for the case of lost."), _react.default.createElement(_styles.TextField, {
    label: "Phone" + (phoneNumberIsRequired ? "" : " (optional)"),
    type: "text",
    inputMode: "tel",
    placeholder: "Enter your mobile phone number",
    autoFocus: true,
    tabIndex: 61,
    value: payload.phone_number,
    errorMessage: errors.phone_number,
    onChange: function onChange(e, v) {
      return setPayload(function (p) {
        return (0, _objectSpread2.default)({}, p, {
          phone_number: v
        });
      });
    },
    onKeyUp: function onKeyUp(e) {
      return e.key === "Enter" && handlePayloadSubmit();
    },
    styles: _styles.TextFieldStyles.bold,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 106
    },
    __self: this
  }), _react.default.createElement(_styles.DatePicker, {
    label: "Birthdate",
    placeholder: "Select your birthdate",
    tabIndex: 62,
    allowTextInput: true,
    value: payload.birthdate ? (0, _moment.default)(payload.birthdate, "YYYY-MM-DD").toDate() : undefined,
    onSelectDate: function onSelectDate(date) {
      return date && setPayload(function (p) {
        return (0, _objectSpread2.default)({}, p, {
          birthdate: (0, _moment.default)(date).format("YYYY-MM-DD")
        });
      });
    },
    onKeyUp: function onKeyUp(e) {
      return e.key === "Enter" && handlePayloadSubmit();
    },
    formatDate: function formatDate(date) {
      return date ? (0, _moment.default)(date).format("YYYY-MM-DD") : "";
    },
    initialPickerDate: (0, _moment.default)().subtract(20, "y").toDate(),
    highlightCurrentMonth: true,
    highlightSelectedMonth: true,
    showGoToToday: false,
    parseDateFromString: function parseDateFromString(str) {
      var d = (0, _moment.default)(str, "YYYY-MM-DD");
      return d.isValid() ? d.toDate() : null;
    },
    styles: _styles.DatePickerStyles.bold,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 120
    },
    __self: this
  }), errors.birthdate ? _react.default.createElement(_styles.Label, {
    styles: _styles.LabelStyles.fieldErrorMessage,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 139
    },
    __self: this
  }, errors.birthdate) : null, _react.default.createElement(_styles.Dropdown, {
    label: "Gender",
    selectedKey: payload.gender || undefined,
    onChange: function onChange(e, v) {
      return v && setPayload(function (p) {
        return (0, _objectSpread2.default)({}, p, {
          gender: v.key
        });
      });
    },
    placeholder: "Select your gender",
    tabIndex: 63,
    options: [{
      key: "male",
      text: "Male"
    }, {
      key: "female",
      text: "Female"
    }, {
      key: "other",
      text: "Other"
    }],
    errorMessage: errors.gender,
    styles: _styles.DropdownStyles.bold,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 141
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

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _styles = __webpack_require__(/*! ../styles */ "./src/styles.ts");

var _hook = __webpack_require__(/*! ../hook */ "./src/hook.ts");

var _layout = __webpack_require__(/*! ./layout */ "./src/screen/layout.tsx");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-interaction-renderer/src/screen/register.end.tsx";

var RegisterEndScreen = function RegisterEndScreen() {
  var _useWithLoading = (0, _hook.useWithLoading)(),
      loading = _useWithLoading.loading,
      errors = _useWithLoading.errors,
      setErrors = _useWithLoading.setErrors,
      withLoading = _useWithLoading.withLoading;

  var _useNavigation = (0, _hook.useNavigation)(),
      nav = _useNavigation.nav,
      route = _useNavigation.route;

  var _route$params$email = route.params.email,
      email = _route$params$email === void 0 ? "" : _route$params$email;
  var handleContinue = withLoading(function () {
    nav.navigate("login", {
      screen: "login.index",
      params: {
        email: email
      }
    });
  });
  return _react.default.createElement(_layout.ScreenLayout, {
    title: "Signed up",
    subtitle: email,
    buttons: [{
      primary: true,
      text: "Done",
      onClick: handleContinue,
      loading: loading,
      autoFocus: true,
      tabIndex: 1
    }],
    error: errors.global,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 25
    },
    __self: this
  }, _react.default.createElement(_styles.Text, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 40
    },
    __self: this
  }, "Congratulations! The account has been registered. This email account can be used to sign in to multiple services. So don't forget it please. ", _react.default.createElement("span", {
    role: "img",
    "aria-label": "smile",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 40
    },
    __self: this
  }, "\uD83D\uDE42")));
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

var _objectSpread2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/objectSpread2 */ "../../node_modules/@babel/runtime/helpers/esm/objectSpread2.js"));

var _regenerator = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/regenerator */ "../../node_modules/@babel/runtime/regenerator/index.js"));

var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/slicedToArray */ "../../node_modules/@babel/runtime/helpers/esm/slicedToArray.js"));

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _layout = __webpack_require__(/*! ./layout */ "./src/screen/layout.tsx");

var _styles = __webpack_require__(/*! ../styles */ "./src/styles.ts");

var _hook = __webpack_require__(/*! ../hook */ "./src/hook.ts");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-interaction-renderer/src/screen/register.index.tsx";

var RegisterIndexScreen = function RegisterIndexScreen() {
  var _useNavigation = (0, _hook.useNavigation)(),
      nav = _useNavigation.nav;

  var _useState = (0, _react.useState)({
    name: "",
    email: "",
    password: "",
    password_confirmation: ""
  }),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      payload = _useState2[0],
      setPayload = _useState2[1];

  var _useAppState = (0, _hook.useAppState)(),
      _useAppState2 = (0, _slicedToArray2.default)(_useAppState, 2),
      state = _useAppState2[0],
      dispatch = _useAppState2[1];

  (0, _react.useEffect)(function () {
    var stored = state.session.register;

    if (stored && stored.credentials && stored.scope && stored.scope.includes("email") && stored.scope.includes("profile")) {
      var _stored$claims = stored.claims,
          name = _stored$claims.name,
          email = _stored$claims.email;
      var _stored$credentials = stored.credentials,
          password = _stored$credentials.password,
          password_confirmation = _stored$credentials.password_confirmation;
      setPayload({
        name: name,
        email: email,
        password: password,
        password_confirmation: password_confirmation
      });
      nav.navigate("register", {
        screen: "register.detail",
        params: {}
      });
    }
  }, []);

  var _useState3 = (0, _react.useState)(false),
      _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
      passwordVisible = _useState4[0],
      setPasswordVisible = _useState4[1];

  var _useWithLoading = (0, _hook.useWithLoading)(),
      loading = _useWithLoading.loading,
      errors = _useWithLoading.errors,
      setErrors = _useWithLoading.setErrors,
      withLoading = _useWithLoading.withLoading;

  var handlePayloadSubmit = withLoading(function _callee() {
    var name, email, password, password_confirmation;
    return _regenerator.default.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            name = payload.name, email = payload.email, password = payload.password, password_confirmation = payload.password_confirmation;
            return _context.abrupt("return", dispatch("register.validate", {
              claims: {
                name: name,
                email: email
              },
              credentials: {
                password: password,
                password_confirmation: password_confirmation
              },
              scope: ["email", "profile"]
            }).then(function () {
              nav.navigate("register", {
                screen: "register.detail",
                params: {}
              });
            }).catch(function (err) {
              return setErrors(err);
            }));

          case 2:
          case "end":
            return _context.stop();
        }
      }
    });
  }, [nav, payload]);
  var handleCancel = withLoading(function () {
    return nav.navigate("login", {
      screen: "login.index",
      params: {}
    });
  }, [nav]);
  var discovery = state.metadata.discovery;
  return _react.default.createElement(_layout.ScreenLayout, {
    title: "Sign up",
    subtitle: "Create account",
    buttons: [{
      primary: true,
      text: "Continue",
      onClick: handlePayloadSubmit,
      loading: loading,
      tabIndex: 55
    }, {
      text: "Cancel",
      onClick: handleCancel,
      loading: loading,
      hidden: state.name === "register",
      tabIndex: 56
    }],
    error: errors.global,
    footer: _react.default.createElement(_react.default.Fragment, null, _react.default.createElement(_styles.Text, {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 92
      },
      __self: this
    }, "When you sign up as a member, you agree to the ", _react.default.createElement(_styles.Link, {
      href: discovery.op_tos_uri,
      target: "_blank",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 92
      },
      __self: this
    }, "terms of service"), " and the ", _react.default.createElement(_styles.Link, {
      href: discovery.op_policy_uri,
      target: "_blank",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 92
      },
      __self: this
    }, "privacy policy"), ".")),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 70
    },
    __self: this
  }, _react.default.createElement("form", {
    onSubmit: function onSubmit(e) {
      e.preventDefault();
      handlePayloadSubmit();
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 96
    },
    __self: this
  }, _react.default.createElement(_styles.Stack, {
    tokens: {
      childrenGap: 15
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 100
    },
    __self: this
  }, _react.default.createElement(_styles.TextField, {
    label: "Name",
    type: "text",
    inputMode: "text",
    placeholder: "Enter your name",
    autoFocus: true,
    tabIndex: 51,
    value: payload.name,
    errorMessage: errors.name,
    onChange: function onChange(e, v) {
      return setPayload(function (p) {
        return (0, _objectSpread2.default)({}, p, {
          name: v
        });
      });
    },
    onKeyUp: function onKeyUp(e) {
      return e.key === "Enter" && handlePayloadSubmit();
    },
    styles: _styles.TextFieldStyles.bold,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 101
    },
    __self: this
  }), _react.default.createElement(_styles.TextField, {
    label: "Email",
    type: "text",
    inputMode: "email",
    placeholder: "Enter your email",
    autoComplete: "username",
    tabIndex: 52,
    value: payload.email,
    errorMessage: errors.email,
    onChange: function onChange(e, v) {
      return setPayload(function (p) {
        return (0, _objectSpread2.default)({}, p, {
          email: v
        });
      });
    },
    onKeyUp: function onKeyUp(e) {
      return e.key === "Enter" && handlePayloadSubmit();
    },
    styles: _styles.TextFieldStyles.bold,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 114
    },
    __self: this
  }), _react.default.createElement(_styles.TextField, {
    label: "Password",
    type: passwordVisible ? "text" : "password",
    inputMode: "text",
    autoComplete: "password",
    placeholder: "Enter your password",
    iconProps: {
      iconName: passwordVisible ? "redEye" : "hide",
      style: {
        cursor: "pointer"
      },
      onClick: function onClick() {
        return setPasswordVisible(!passwordVisible);
      }
    },
    tabIndex: 53,
    value: payload.password,
    errorMessage: errors.password,
    onChange: function onChange(e, v) {
      return setPayload(function (p) {
        return (0, _objectSpread2.default)({}, p, {
          password: v
        });
      });
    },
    onKeyUp: function onKeyUp(e) {
      return e.key === "Enter" && handlePayloadSubmit();
    },
    styles: _styles.TextFieldStyles.bold,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 127
    },
    __self: this
  }), _react.default.createElement(_styles.TextField, {
    label: "Confirm",
    type: "password",
    inputMode: "text",
    autoComplete: "password",
    placeholder: "Confirm your password",
    tabIndex: 54,
    value: payload.password_confirmation,
    errorMessage: errors.password_confirmation,
    onChange: function onChange(e, v) {
      return setPayload(function (p) {
        return (0, _objectSpread2.default)({}, p, {
          password_confirmation: v
        });
      });
    },
    onKeyUp: function onKeyUp(e) {
      return e.key === "Enter" && handlePayloadSubmit();
    },
    styles: _styles.TextFieldStyles.bold,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 141
    },
    __self: this
  }))));
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

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _styles = __webpack_require__(/*! ../styles */ "./src/styles.ts");

var _hook = __webpack_require__(/*! ../hook */ "./src/hook.ts");

var _layout = __webpack_require__(/*! ./layout */ "./src/screen/layout.tsx");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-interaction-renderer/src/screen/reset_password.end.tsx";

var ResetPasswordEndScreen = function ResetPasswordEndScreen() {
  var _useWithLoading = (0, _hook.useWithLoading)(),
      loading = _useWithLoading.loading,
      errors = _useWithLoading.errors,
      setErrors = _useWithLoading.setErrors,
      withLoading = _useWithLoading.withLoading;

  var _useNavigation = (0, _hook.useNavigation)(),
      nav = _useNavigation.nav,
      route = _useNavigation.route;

  var _route$params$email = route.params.email,
      email = _route$params$email === void 0 ? "" : _route$params$email;
  var handleDone = withLoading(function () {
    return nav.navigate("login", {
      screen: "login.index",
      params: {}
    });
  });
  return _react.default.createElement(_layout.ScreenLayout, {
    title: "Password reset",
    subtitle: email,
    buttons: [{
      primary: true,
      text: "Done",
      onClick: handleDone,
      loading: loading,
      tabIndex: 21
    }],
    error: errors.global,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 22
    },
    __self: this
  }, _react.default.createElement(_styles.Text, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 36
    },
    __self: this
  }, "Account credential has been updated successfully."));
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

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ResetPasswordIndexScreen = void 0;

var _regenerator = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/regenerator */ "../../node_modules/@babel/runtime/regenerator/index.js"));

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _styles = __webpack_require__(/*! ../styles */ "./src/styles.ts");

var _hook = __webpack_require__(/*! ../hook */ "./src/hook.ts");

var _layout = __webpack_require__(/*! ./layout */ "./src/screen/layout.tsx");

var _screen_password = _interopRequireDefault(__webpack_require__(/*! ../image/screen_password.svg */ "./src/image/screen_password.svg"));

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-interaction-renderer/src/screen/reset_password.index.tsx";

var ResetPasswordIndexScreen = function ResetPasswordIndexScreen() {
  var _useWithLoading = (0, _hook.useWithLoading)(),
      loading = _useWithLoading.loading,
      errors = _useWithLoading.errors,
      setErrors = _useWithLoading.setErrors,
      withLoading = _useWithLoading.withLoading;

  var _useNavigation = (0, _hook.useNavigation)(),
      nav = _useNavigation.nav,
      route = _useNavigation.route;

  var _route$params$email = route.params.email,
      email = _route$params$email === void 0 ? "" : _route$params$email;
  var handleSend = withLoading(function _callee() {
    return _regenerator.default.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            nav.navigate("reset_password", {
              screen: "reset_password.sent",
              params: {
                email: email,
                ttl: 3600
              }
            });

          case 1:
          case "end":
            return _context.stop();
        }
      }
    });
  }, [nav, email]);
  var handleCancel = withLoading(function () {
    return nav.navigate("login", {
      screen: "login.index",
      params: {}
    });
  }, [email]);
  return _react.default.createElement(_layout.ScreenLayout, {
    title: "Reset password",
    subtitle: email,
    buttons: [{
      primary: true,
      text: "Send",
      onClick: handleSend,
      loading: loading,
      tabIndex: 31
    }, {
      text: "Cancel",
      onClick: handleCancel,
      loading: loading,
      tabIndex: 32
    }],
    error: errors.global,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 31
    },
    __self: this
  }, _react.default.createElement(_styles.Text, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 51
    },
    __self: this
  }, "An email with a link will be sent to help you to reset password."), _react.default.createElement(_styles.Image, {
    src: _screen_password.default,
    styles: {
      root: {
        minHeight: "270px"
      },
      image: {
        width: "100%"
      }
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 54
    },
    __self: this
  }));
};

exports.ResetPasswordIndexScreen = ResetPasswordIndexScreen;

/***/ }),

/***/ "./src/screen/reset_password.sent.tsx":
/*!********************************************!*\
  !*** ./src/screen/reset_password.sent.tsx ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _interopRequireDefault = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ResetPasswordSentScreen = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _styles = __webpack_require__(/*! ../styles */ "./src/styles.ts");

var _hook = __webpack_require__(/*! ../hook */ "./src/hook.ts");

var _layout = __webpack_require__(/*! ./layout */ "./src/screen/layout.tsx");

var _screen_sent = _interopRequireDefault(__webpack_require__(/*! ../image/screen_sent.svg */ "./src/image/screen_sent.svg"));

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-interaction-renderer/src/screen/reset_password.sent.tsx";

var ResetPasswordSentScreen = function ResetPasswordSentScreen() {
  var _useWithLoading = (0, _hook.useWithLoading)(),
      loading = _useWithLoading.loading,
      errors = _useWithLoading.errors,
      setErrors = _useWithLoading.setErrors,
      withLoading = _useWithLoading.withLoading;

  var _useNavigation = (0, _hook.useNavigation)(),
      nav = _useNavigation.nav,
      route = _useNavigation.route;

  var _route$params = route.params,
      _route$params$email = _route$params.email,
      email = _route$params$email === void 0 ? "" : _route$params$email,
      _route$params$ttl = _route$params.ttl,
      ttl = _route$params$ttl === void 0 ? 0 : _route$params$ttl;
  var handleDone = withLoading(function () {
    return nav.navigate("login", {
      screen: "login.index",
      params: {
        email: email
      }
    });
  }, [nav, email]);
  return _react.default.createElement(_layout.ScreenLayout, {
    title: "Reset password",
    subtitle: email,
    buttons: [{
      primary: true,
      text: "Done",
      onClick: handleDone,
      loading: loading,
      tabIndex: 41
    }],
    error: errors.global,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 21
    },
    __self: this
  }, _react.default.createElement(_styles.Text, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 35
    },
    __self: this
  }, "You could check the email to set a new password within ", Math.floor(ttl / 60), " minutes."), _react.default.createElement(_styles.Image, {
    src: _screen_sent.default,
    styles: {
      root: {
        minHeight: "270px"
      },
      image: {
        width: "100%"
      }
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 38
    },
    __self: this
  }));
};

exports.ResetPasswordSentScreen = ResetPasswordSentScreen;

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

var _styles = __webpack_require__(/*! ../styles */ "./src/styles.ts");

var _hook = __webpack_require__(/*! ../hook */ "./src/hook.ts");

var _layout = __webpack_require__(/*! ./layout */ "./src/screen/layout.tsx");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-interaction-renderer/src/screen/reset_password.set.tsx";

var ResetPasswordSetScreen = function ResetPasswordSetScreen() {
  var _useWithLoading = (0, _hook.useWithLoading)(),
      loading = _useWithLoading.loading,
      errors = _useWithLoading.errors,
      setErrors = _useWithLoading.setErrors,
      withLoading = _useWithLoading.withLoading;

  var _useNavigation = (0, _hook.useNavigation)(),
      nav = _useNavigation.nav,
      route = _useNavigation.route;

  var _route$params$email = route.params.email,
      email = _route$params$email === void 0 ? "" : _route$params$email;

  var _useState = (0, _react.useState)({
    password: "",
    password_confirmation: ""
  }),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      payload = _useState2[0],
      setPayload = _useState2[1];

  var handlePayloadSubmit = withLoading(function () {
    nav.navigate("reset_password", {
      screen: "reset_password.end",
      params: {
        email: email
      }
    });
  }, [nav, email]);
  return _react.default.createElement(_layout.ScreenLayout, {
    title: "Reset password",
    subtitle: email,
    buttons: [{
      primary: true,
      text: "Continue",
      onClick: handlePayloadSubmit,
      loading: loading,
      tabIndex: 43
    }],
    error: errors.global,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 26
    },
    __self: this
  }, _react.default.createElement(_styles.Text, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 40
    },
    __self: this
  }, "Set a new password for your account."), _react.default.createElement(_styles.TextField, {
    label: "Password",
    type: "password",
    inputMode: "text",
    placeholder: "Enter new password",
    autoFocus: true,
    tabIndex: 41,
    value: payload.password,
    errorMessage: errors.password,
    onChange: function onChange(e, v) {
      return setPayload(function (p) {
        return (0, _objectSpread2.default)({}, p, {
          password: v
        });
      });
    },
    onKeyUp: function onKeyUp(e) {
      return e.key === "Enter" && handlePayloadSubmit();
    },
    styles: _styles.TextFieldStyles.bold,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 43
    },
    __self: this
  }), _react.default.createElement(_styles.TextField, {
    label: "Confirm",
    type: "password",
    inputMode: "text",
    autoComplete: "password",
    placeholder: "Confirm your password",
    tabIndex: 42,
    value: payload.password_confirmation,
    errorMessage: errors.password_confirmation,
    onChange: function onChange(e, v) {
      return setPayload(function (p) {
        return (0, _objectSpread2.default)({}, p, {
          password_confirmation: v
        });
      });
    },
    onKeyUp: function onKeyUp(e) {
      return e.key === "Enter" && handlePayloadSubmit();
    },
    styles: _styles.TextFieldStyles.bold,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 56
    },
    __self: this
  }));
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

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _styles = __webpack_require__(/*! ../styles */ "./src/styles.ts");

var _hook = __webpack_require__(/*! ../hook */ "./src/hook.ts");

var _layout = __webpack_require__(/*! ./layout */ "./src/screen/layout.tsx");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-interaction-renderer/src/screen/verify_email.end.tsx";

var VerifyEmailEndScreen = function VerifyEmailEndScreen() {
  var _useWithLoading = (0, _hook.useWithLoading)(),
      loading = _useWithLoading.loading,
      errors = _useWithLoading.errors,
      setErrors = _useWithLoading.setErrors,
      withLoading = _useWithLoading.withLoading;

  var _useNavigation = (0, _hook.useNavigation)(),
      route = _useNavigation.route,
      nav = _useNavigation.nav;

  var _route$params$email = route.params.email,
      email = _route$params$email === void 0 ? "" : _route$params$email;
  var handleDone = withLoading(function () {
    return nav.navigate("login", {
      screen: "login.index",
      params: {
        email: email
      }
    });
  }, [email]);
  return _react.default.createElement(_layout.ScreenLayout, {
    title: "Email verified",
    subtitle: email,
    buttons: [{
      primary: true,
      text: "Done",
      onClick: handleDone,
      loading: loading,
      tabIndex: 31
    }],
    error: errors.global,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 26
    },
    __self: this
  }, _react.default.createElement(_styles.Text, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 40
    },
    __self: this
  }, "Account email address has been verified successfully."));
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

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VerifyEmailIndexScreen = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _styles = __webpack_require__(/*! ../styles */ "./src/styles.ts");

var _hook = __webpack_require__(/*! ../hook */ "./src/hook.ts");

var _layout = __webpack_require__(/*! ./layout */ "./src/screen/layout.tsx");

var _screen_verify = _interopRequireDefault(__webpack_require__(/*! ../image/screen_verify.svg */ "./src/image/screen_verify.svg"));

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-interaction-renderer/src/screen/verify_email.index.tsx";

var VerifyEmailIndexScreen = function VerifyEmailIndexScreen() {
  var _useWithLoading = (0, _hook.useWithLoading)(),
      loading = _useWithLoading.loading,
      errors = _useWithLoading.errors,
      setErrors = _useWithLoading.setErrors,
      withLoading = _useWithLoading.withLoading;

  var _useNavigation = (0, _hook.useNavigation)(),
      nav = _useNavigation.nav,
      route = _useNavigation.route;

  var _route$params = route.params,
      _route$params$email = _route$params.email,
      email = _route$params$email === void 0 ? "" : _route$params$email,
      _route$params$callbac = _route$params.callback,
      callback = _route$params$callbac === void 0 ? "" : _route$params$callbac;
  var handleSend = withLoading(function () {
    nav.navigate("verify_email", {
      screen: "verify_email.verify",
      params: {
        email: email,
        ttl: 1800,
        callback: callback
      }
    });
  }, [nav, email, callback]);
  var handleCancel = withLoading(function () {
    callback === "register" ? nav.navigate("register", {
      screen: "register.detail",
      params: {}
    }) : nav.navigate("login", {
      screen: "login.index",
      params: {
        email: email
      }
    });
  }, [nav, callback, email]);
  return _react.default.createElement(_layout.ScreenLayout, {
    title: "Verify email",
    subtitle: email,
    buttons: [{
      primary: true,
      text: "Send",
      onClick: handleSend,
      loading: loading,
      tabIndex: 1
    }, {
      text: "Cancel",
      onClick: handleCancel,
      loading: loading,
      tabIndex: 2
    }],
    error: errors.global,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 36
    },
    __self: this
  }, _react.default.createElement(_styles.Text, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 56
    },
    __self: this
  }, "An email with a verification link will be sent to verify the email address."), _react.default.createElement(_styles.Image, {
    src: _screen_verify.default,
    styles: {
      root: {
        minHeight: "270px"
      },
      image: {
        width: "100%"
      }
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 59
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

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VerifyEmailVerifyScreen = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _styles = __webpack_require__(/*! ../styles */ "./src/styles.ts");

var _hook = __webpack_require__(/*! ../hook */ "./src/hook.ts");

var _layout = __webpack_require__(/*! ./layout */ "./src/screen/layout.tsx");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-interaction-renderer/src/screen/verify_email.verify.tsx";

var VerifyEmailVerifyScreen = function VerifyEmailVerifyScreen() {
  var _useWithLoading = (0, _hook.useWithLoading)(),
      loading = _useWithLoading.loading,
      errors = _useWithLoading.errors,
      setErrors = _useWithLoading.setErrors,
      withLoading = _useWithLoading.withLoading;

  var _useNavigation = (0, _hook.useNavigation)(),
      nav = _useNavigation.nav,
      route = _useNavigation.route;

  var _route$params = route.params,
      _route$params$email = _route$params.email,
      email = _route$params$email === void 0 ? "" : _route$params$email,
      _route$params$ttl = _route$params.ttl,
      ttl = _route$params$ttl === void 0 ? 0 : _route$params$ttl,
      _route$params$callbac = _route$params.callback,
      callback = _route$params$callbac === void 0 ? "" : _route$params$callbac;
  var handleDone = withLoading(function () {
    if (callback === "register") {
      nav.navigate("register", {
        screen: "register.detail",
        params: {}
      });
    } else {
      nav.navigate("login", {
        screen: "login.index",
        params: {
          email: email
        }
      });
    }
  }, [nav, email, callback]);
  return _react.default.createElement(_layout.ScreenLayout, {
    title: "Verify email",
    subtitle: email,
    buttons: [{
      primary: true,
      text: "Done",
      onClick: handleDone,
      loading: loading,
      tabIndex: 21
    }],
    error: errors.global,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 31
    },
    __self: this
  }, _react.default.createElement(_styles.Text, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 45
    },
    __self: this
  }, "An email with the verification link has been sent."));
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

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _styles = __webpack_require__(/*! ../styles */ "./src/styles.ts");

var _hook = __webpack_require__(/*! ../hook */ "./src/hook.ts");

var _layout = __webpack_require__(/*! ./layout */ "./src/screen/layout.tsx");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-interaction-renderer/src/screen/verify_phone.end.tsx";

var VerifyPhoneEndScreen = function VerifyPhoneEndScreen() {
  var _useWithLoading = (0, _hook.useWithLoading)(),
      loading = _useWithLoading.loading,
      errors = _useWithLoading.errors,
      setErrors = _useWithLoading.setErrors,
      withLoading = _useWithLoading.withLoading;

  var _useNavigation = (0, _hook.useNavigation)(),
      nav = _useNavigation.nav,
      route = _useNavigation.route;

  var _route$params$phoneNu = route.params.phoneNumber,
      phoneNumber = _route$params$phoneNu === void 0 ? "" : _route$params$phoneNu;
  var handleDone = withLoading(function () {
    return nav.navigate("login", {
      screen: "login.index",
      params: {}
    });
  });
  return _react.default.createElement(_layout.ScreenLayout, {
    title: "Phone number verified",
    subtitle: phoneNumber,
    buttons: [{
      primary: true,
      text: "Done",
      onClick: handleDone,
      loading: loading,
      tabIndex: 31
    }],
    error: errors.global,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 22
    },
    __self: this
  }, _react.default.createElement(_styles.Text, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 36
    },
    __self: this
  }, "Account phone number has been verified successfully."));
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

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VerifyPhoneIndexScreen = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _styles = __webpack_require__(/*! ../styles */ "./src/styles.ts");

var _hook = __webpack_require__(/*! ../hook */ "./src/hook.ts");

var _layout = __webpack_require__(/*! ./layout */ "./src/screen/layout.tsx");

var _screen_verify = _interopRequireDefault(__webpack_require__(/*! ../image/screen_verify.svg */ "./src/image/screen_verify.svg"));

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-interaction-renderer/src/screen/verify_phone.index.tsx";

var VerifyPhoneIndexScreen = function VerifyPhoneIndexScreen() {
  var _useWithLoading = (0, _hook.useWithLoading)(),
      loading = _useWithLoading.loading,
      errors = _useWithLoading.errors,
      setErrors = _useWithLoading.setErrors,
      withLoading = _useWithLoading.withLoading;

  var _useNavigation = (0, _hook.useNavigation)(),
      nav = _useNavigation.nav,
      route = _useNavigation.route;

  var _route$params = route.params,
      _route$params$phoneNu = _route$params.phoneNumber,
      phoneNumber = _route$params$phoneNu === void 0 ? "" : _route$params$phoneNu,
      _route$params$callbac = _route$params.callback,
      callback = _route$params$callbac === void 0 ? "" : _route$params$callbac;
  var handleSend = withLoading(function () {
    nav.navigate("verify_phone", {
      screen: "verify_phone.verify",
      params: {
        phoneNumber: phoneNumber,
        ttl: 500,
        callback: callback
      }
    });
  }, [nav, phoneNumber, callback]);
  var handleCancel = withLoading(function () {
    callback === "register" ? nav.navigate("register", {
      screen: "register.detail",
      params: {}
    }) : nav.navigate("login", {
      screen: "login.index",
      params: {}
    });
  }, [nav, callback]);
  return _react.default.createElement(_layout.ScreenLayout, {
    title: "Verify phone number",
    subtitle: phoneNumber,
    buttons: [{
      primary: true,
      text: "Send",
      onClick: handleSend,
      loading: loading,
      tabIndex: 1
    }, {
      text: "Cancel",
      onClick: handleCancel,
      loading: loading,
      tabIndex: 2
    }],
    error: errors.global,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 34
    },
    __self: this
  }, _react.default.createElement(_styles.Text, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 54
    },
    __self: this
  }, "A text message with a verification code will be sent to verify the phone number."), _react.default.createElement(_styles.Image, {
    src: _screen_verify.default,
    styles: {
      root: {
        minHeight: "270px"
      },
      image: {
        width: "100%"
      }
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 57
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

var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/slicedToArray */ "../../node_modules/@babel/runtime/helpers/esm/slicedToArray.js"));

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _styles = __webpack_require__(/*! ../styles */ "./src/styles.ts");

var _hook = __webpack_require__(/*! ../hook */ "./src/hook.ts");

var _layout = __webpack_require__(/*! ./layout */ "./src/screen/layout.tsx");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-interaction-renderer/src/screen/verify_phone.verify.tsx";

var VerifyPhoneVerifyScreen = function VerifyPhoneVerifyScreen() {
  var _useState = (0, _react.useState)(""),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      code = _useState2[0],
      setCode = _useState2[1];

  var _useNavigation = (0, _hook.useNavigation)(),
      nav = _useNavigation.nav,
      route = _useNavigation.route;

  var _route$params = route.params,
      _route$params$phoneNu = _route$params.phoneNumber,
      phoneNumber = _route$params$phoneNu === void 0 ? "" : _route$params$phoneNu,
      _route$params$ttl = _route$params.ttl,
      ttl = _route$params$ttl === void 0 ? 0 : _route$params$ttl,
      _route$params$callbac = _route$params.callback,
      callback = _route$params$callbac === void 0 ? "" : _route$params$callbac;

  var _useState3 = (0, _react.useState)(ttl),
      _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
      remainingSeconds = _useState4[0],
      setRemainingSeconds = _useState4[1];

  var _useAppState = (0, _hook.useAppState)(),
      _useAppState2 = (0, _slicedToArray2.default)(_useAppState, 2),
      state = _useAppState2[0],
      dispatch = _useAppState2[1];

  (0, _react.useEffect)(function () {
    var timer = setInterval(function () {
      return setRemainingSeconds(function (s) {
        return Math.max(0, s - 1);
      });
    }, 1000);
    return function () {
      return clearInterval(timer);
    };
  }, []);

  var _useWithLoading = (0, _hook.useWithLoading)(),
      loading = _useWithLoading.loading,
      errors = _useWithLoading.errors,
      setErrors = _useWithLoading.setErrors,
      withLoading = _useWithLoading.withLoading;

  var handleVerify = withLoading(function () {
    if (callback === "register") {
      nav.navigate("register", {
        screen: "register.end",
        params: {
          email: "tod@do.com"
        }
      });
    } else {
      nav.navigate("verify_phone", {
        screen: "verify_phone.end",
        params: {
          phoneNumber: phoneNumber
        }
      });
    }
  }, [nav, phoneNumber, callback]);
  var handleResend = withLoading(function () {
    setRemainingSeconds(500);
    setCode("");
  });
  var handleCancel = withLoading(function () {
    if (state.name === "register") {
      nav.navigate("register", {
        screen: "register.detail",
        params: {}
      });
    } else if (state.name === "login" || state.name === "consent") {
      nav.navigate("login", {
        screen: "login.index",
        params: {}
      });
    }
  }, []);
  return _react.default.createElement(_layout.ScreenLayout, {
    title: "Verify phone number",
    subtitle: phoneNumber,
    buttons: [{
      primary: true,
      text: "Continue",
      onClick: handleVerify,
      loading: loading,
      tabIndex: 22
    }, {
      text: "Resend",
      onClick: handleResend,
      loading: loading,
      tabIndex: 23
    }, {
      text: "Cancel",
      onClick: handleCancel,
      hidden: state.name === "verify_phone",
      loading: loading,
      tabIndex: 24
    }],
    error: errors.global,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 58
    },
    __self: this
  }, _react.default.createElement(_styles.Text, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 85
    },
    __self: this
  }, "Enter the received 6-digit verification code."), _react.default.createElement(_styles.TextField, {
    label: "Verification code",
    type: "tel",
    inputMode: "tel",
    placeholder: "Enter the verification code",
    autoFocus: true,
    tabIndex: 21,
    value: code,
    errorMessage: errors.code,
    description: Math.floor(remainingSeconds / 60).toString().padStart(2, "0") + ":" + (remainingSeconds % 60).toString().padStart(2, "0"),
    onChange: function onChange(e, v) {
      return setCode(v || "");
    },
    onKeyUp: function onKeyUp(e) {
      return e.key === "Enter" && handleVerify();
    },
    styles: _styles.TextFieldStyles.bold,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 88
    },
    __self: this
  }));
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

/***/ "./src/styles.css":
/*!************************!*\
  !*** ./src/styles.css ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../node_modules/css-loader/dist/cjs.js??ref--6-oneOf-3-1!../../../node_modules/postcss-loader/src??postcss!./styles.css */ "../../node_modules/css-loader/dist/cjs.js?!../../node_modules/postcss-loader/src/index.js?!./src/styles.css");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../node_modules/style-loader/lib/addStyles.js */ "../../node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(true) {
	module.hot.accept(/*! !../../../node_modules/css-loader/dist/cjs.js??ref--6-oneOf-3-1!../../../node_modules/postcss-loader/src??postcss!./styles.css */ "../../node_modules/css-loader/dist/cjs.js?!../../node_modules/postcss-loader/src/index.js?!./src/styles.css", function() {
		var newContent = __webpack_require__(/*! !../../../node_modules/css-loader/dist/cjs.js??ref--6-oneOf-3-1!../../../node_modules/postcss-loader/src??postcss!./styles.css */ "../../node_modules/css-loader/dist/cjs.js?!../../node_modules/postcss-loader/src/index.js?!./src/styles.css");

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

/***/ "./src/styles.ts":
/*!***********************!*\
  !*** ./src/styles.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _interopRequireWildcard = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireWildcard */ "../../node_modules/@babel/runtime/helpers/interopRequireWildcard.js");

var _interopRequireDefault = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  ThemeStyles: true,
  TextFieldStyles: true,
  DropdownStyles: true,
  DatePickerStyles: true,
  LabelStyles: true,
  ButtonStyles: true
};
exports.ButtonStyles = exports.LabelStyles = exports.DatePickerStyles = exports.DropdownStyles = exports.TextFieldStyles = exports.ThemeStyles = void 0;

var _objectSpread2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/objectSpread2 */ "../../node_modules/@babel/runtime/helpers/esm/objectSpread2.js"));

var _ = _interopRequireWildcard(__webpack_require__(/*! lodash */ "../../node_modules/lodash/lodash.js"));

var _lib = __webpack_require__(/*! office-ui-fabric-react/lib */ "../../node_modules/office-ui-fabric-react/lib/index.js");

Object.keys(_lib).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _lib[key];
    }
  });
});

var _icons = __webpack_require__(/*! @uifabric/icons */ "../../node_modules/@uifabric/icons/lib/index.js");

var _inject = __webpack_require__(/*! ../inject */ "./inject.js");

__webpack_require__(/*! ./styles.css */ "./src/styles.css");

(0, _lib.loadTheme)(_.defaultsDeep((0, _inject.getAppOptions)().theme || {}, {
  palette: {
    themePrimary: "#2a44ec",
    themeLighterAlt: "#f6f7fe",
    themeLighter: "#dbdffc",
    themeLight: "#bcc4fa",
    themeTertiary: "#7c8cf4",
    themeSecondary: "#435aef",
    themeDarkAlt: "#263ed5",
    themeDark: "#2034b4",
    themeDarker: "#182685",
    neutralLighterAlt: "#f8f8f8",
    neutralLighter: "#f4f4f4",
    neutralLight: "#eaeaea",
    neutralQuaternaryAlt: "#dadada",
    neutralQuaternary: "#d0d0d0",
    neutralTertiaryAlt: "#c8c8c8",
    neutralTertiary: "#bab8b7",
    neutralSecondary: "#a3a2a0",
    neutralPrimaryAlt: "#8d8b8a",
    neutralPrimary: "#323130",
    neutralDark: "#605e5d",
    black: "#494847",
    white: "#ffffff",
    orange: "#ffa420"
  }
}));
(0, _icons.initializeIcons)();
var ThemeStyles = (0, _lib.getTheme)();
exports.ThemeStyles = ThemeStyles;
var TextFieldStyles = {
  bold: {
    fieldGroup: {
      height: "50px"
    },
    field: {
      fontSize: _lib.FontSizes.large,
      padding: "0 15px",
      selectors: {
        "&::placeholder": {
          fontSize: _lib.FontSizes.large
        }
      }
    },
    icon: {
      lineHeight: "1.5em",
      fontSize: "1.5em",
      padding: "0.1em 0.5em",
      pointerEvents: "auto",
      userSelect: "none"
    }
  }
};
exports.TextFieldStyles = TextFieldStyles;
var DropdownStyles = {
  bold: {
    dropdown: {
      selectors: {
        ".ms-Dropdown-title": {
          height: "48px",
          lineHeight: "48px",
          fontSize: _lib.FontSizes.large,
          padding: "0 15px"
        },
        ".ms-Dropdown-caretDownWrapper": {
          lineHeight: "1.5em",
          fontSize: "1.5em",
          padding: "0.2em 0.5em"
        }
      }
    }
  }
};
exports.DropdownStyles = DropdownStyles;
var DatePickerStyles = {
  bold: {
    root: {
      outline: "none"
    },
    textField: {
      selectors: {
        ".ms-TextField-fieldGroup": {
          height: "50px"
        },
        "input": {
          padding: "0 15px",
          height: "48px",
          fontSize: _lib.FontSizes.large
        },
        "input::placeholder": {
          fontSize: _lib.FontSizes.large
        }
      }
    },
    icon: {
      lineHeight: "1.5em",
      fontSize: "1.5em",
      padding: "0.5em"
    }
  }
};
exports.DatePickerStyles = DatePickerStyles;
var LabelStyles = {
  fieldErrorMessage: {
    root: (0, _objectSpread2.default)({}, ThemeStyles.fonts.small, {
      color: ThemeStyles.palette.redDark,
      paddingBottom: 0,
      marginTop: "0 !important"
    })
  }
};
exports.LabelStyles = LabelStyles;
var ButtonStyles = {
  large: {
    root: {
      height: "50px",
      fontSize: _lib.FontSizes.mediumPlus,
      fontWeight: _lib.FontWeights.light
    }
  },
  largeThin: {
    root: {
      height: "50px",
      fontSize: _lib.FontSizes.mediumPlus,
      fontWeight: _lib.FontWeights.light
    },
    label: {
      fontWeight: 500
    }
  },
  largeFull: {
    root: {
      height: "50px",
      fontSize: _lib.FontSizes.mediumPlus,
      fontWeight: _lib.FontWeights.light,
      width: "100%"
    }
  }
};
exports.ButtonStyles = ButtonStyles;

/***/ }),

/***/ 1:
/*!*********************************************************************************************************************************************************!*\
  !*** multi (webpack)/hot/dev-server.js /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/react-dev-utils/webpackHotDevClient.js ./src/index.tsx ***!
  \*********************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/webpack/hot/dev-server.js */"../../node_modules/webpack/hot/dev-server.js");
__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/react-dev-utils/webpackHotDevClient.js */"../../node_modules/react-dev-utils/webpackHotDevClient.js");
module.exports = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-interaction-renderer/src/index.tsx */"./src/index.tsx");


/***/ })

},[[1,"runtime-main",0]]]);
//# sourceMappingURL=main.chunk.js.map