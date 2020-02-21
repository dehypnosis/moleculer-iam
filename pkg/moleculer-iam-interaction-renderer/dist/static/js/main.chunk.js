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

/***/ "./src/app.tsx":
/*!*********************!*\
  !*** ./src/app.tsx ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _interopRequireDefault = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../node_modules/@babel/runtime/helpers/interopRequireDefault.js");

var _interopRequireWildcard = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireWildcard */ "../../node_modules/@babel/runtime/helpers/interopRequireWildcard.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.App = void 0;

var _regenerator = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/regenerator */ "../../node_modules/@babel/runtime/regenerator/index.js"));

var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/slicedToArray */ "../../node_modules/@babel/runtime/helpers/esm/slicedToArray.js"));

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _native = __webpack_require__(/*! @react-navigation/native */ "../../node_modules/@react-navigation/native/lib/module/index.js");

var _navigator = __webpack_require__(/*! ./navigator */ "./src/navigator.tsx");

var _hook = __webpack_require__(/*! ./hook */ "./src/hook.ts");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-interaction-renderer/src/app.tsx";

var App = function App() {
  var ref = (0, _react.useRef)();
  var serverState = (0, _hook.useServerState)();

  var _useLinking = (0, _native.useLinking)(ref, {
    prefixes: [window.location.origin],
    config: _navigator.routeConfig,
    getStateFromPath: function getStateFromPath(path, options) {
      var state = (0, _native.getStateFromPath)(path, options);

      if (state && state.routes[0]) {
        var route = state.routes[0];

        if (serverState.error) {
          console.error("serverState.error", serverState);
        }

        if (serverState.interaction && !route.name.startsWith(serverState.interaction.name)) {
          console.warn("serverState.interaction differs from matched route", serverState.interaction, route);
        }
      }

      return state;
    }
  }),
      getInitialState = _useLinking.getInitialState;

  var _useState = (0, _react.useState)(true),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      loading = _useState2[0],
      setLoading = _useState2[1];

  var _useState3 = (0, _react.useState)(),
      _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
      initialState = _useState4[0],
      setInitialState = _useState4[1];

  (0, _react.useEffect)(function () {
    (function _callee() {
      var state;
      return _regenerator.default.async(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return _regenerator.default.awrap(getInitialState());

            case 3:
              state = _context.sent;
              setInitialState(state);
              console.debug("initial state loaded from uri", state);
              _context.next = 11;
              break;

            case 8:
              _context.prev = 8;
              _context.t0 = _context["catch"](0);
              console.error(_context.t0);

            case 11:
              _context.prev = 11;
              setLoading(false);
              return _context.finish(11);

            case 14:
            case "end":
              return _context.stop();
          }
        }
      }, null, null, [[0, 8, 11, 14]]);
    })();
  }, [getInitialState]);

  if (loading) {
    return null;
  }

  return _react.default.createElement(_native.NavigationContainer, {
    initialState: initialState,
    ref: ref,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 51
    },
    __self: this
  }, _react.default.createElement(_navigator.Navigator, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 55
    },
    __self: this
  }));
};

exports.App = App;

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
exports.useServerState = useServerState;
exports.useClose = useClose;

var _toConsumableArray2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/toConsumableArray */ "../../node_modules/@babel/runtime/helpers/esm/toConsumableArray.js"));

var _regenerator = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/regenerator */ "../../node_modules/@babel/runtime/regenerator/index.js"));

var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/slicedToArray */ "../../node_modules/@babel/runtime/helpers/esm/slicedToArray.js"));

var _react = __webpack_require__(/*! react */ "../../node_modules/react/index.js");

var _native = __webpack_require__(/*! @react-navigation/native */ "../../node_modules/@react-navigation/native/lib/module/index.js");

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

var __EMPTY_SERVER_STATE__ = {
  error: {
    error: "unexpected_error",
    error_description: "unrecognized state received from server"
  },
  metadata: {}
};

function useServerState() {
  return window.__SERVER_STATE__ || __EMPTY_SERVER_STATE__;
}

function useClose() {
  var tryGoBack = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

  var _useState5 = (0, _react.useState)(false),
      _useState6 = (0, _slicedToArray2.default)(_useState5, 2),
      closed = _useState6[0],
      setClosed = _useState6[1];

  var nav = (0, _native.useNavigation)();
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

var _app = __webpack_require__(/*! ./app */ "./src/app.tsx");

var serviceWorker = _interopRequireWildcard(__webpack_require__(/*! ./service-worker */ "./src/service-worker.ts"));

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

/***/ "./src/navigator.tsx":
/*!***************************!*\
  !*** ./src/navigator.tsx ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _interopRequireDefault = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Navigator = exports.routeConfig = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _stack = __webpack_require__(/*! @react-navigation/stack */ "../../node_modules/@react-navigation/stack/lib/module/index.js");

var _error = __webpack_require__(/*! ./screen/error */ "./src/screen/error.tsx");

var _login = __webpack_require__(/*! ./screen/login.index */ "./src/screen/login.index.tsx");

var _login2 = __webpack_require__(/*! ./screen/login.credentials */ "./src/screen/login.credentials.tsx");

var _consent = __webpack_require__(/*! ./screen/consent */ "./src/screen/consent.tsx");

var _logout = __webpack_require__(/*! ./screen/logout.index */ "./src/screen/logout.index.tsx");

var _logout2 = __webpack_require__(/*! ./screen/logout.end */ "./src/screen/logout.end.tsx");

var _find_email = __webpack_require__(/*! ./screen/find_email.index */ "./src/screen/find_email.index.tsx");

var _find_email2 = __webpack_require__(/*! ./screen/find_email.sent */ "./src/screen/find_email.sent.tsx");

var _reset_password = __webpack_require__(/*! ./screen/reset_password.index */ "./src/screen/reset_password.index.tsx");

var _reset_password2 = __webpack_require__(/*! ./screen/reset_password.sent */ "./src/screen/reset_password.sent.tsx");

var _reset_password3 = __webpack_require__(/*! ./screen/reset_password.set */ "./src/screen/reset_password.set.tsx");

var _reset_password4 = __webpack_require__(/*! ./screen/reset_password.end */ "./src/screen/reset_password.end.tsx");

var _register = __webpack_require__(/*! ./screen/register.index */ "./src/screen/register.index.tsx");

var _register2 = __webpack_require__(/*! ./screen/register.detail */ "./src/screen/register.detail.tsx");

var _register3 = __webpack_require__(/*! ./screen/register.end */ "./src/screen/register.end.tsx");

var _verify_phone = __webpack_require__(/*! ./screen/verify_phone.index */ "./src/screen/verify_phone.index.tsx");

var _verify_phone2 = __webpack_require__(/*! ./screen/verify_phone.sent */ "./src/screen/verify_phone.sent.tsx");

var _verify_phone3 = __webpack_require__(/*! ./screen/verify_phone.end */ "./src/screen/verify_phone.end.tsx");

var _verify_email = __webpack_require__(/*! ./screen/verify_email.index */ "./src/screen/verify_email.index.tsx");

var _verify_email2 = __webpack_require__(/*! ./screen/verify_email.sent */ "./src/screen/verify_email.sent.tsx");

var _verify_email3 = __webpack_require__(/*! ./screen/verify_email.end */ "./src/screen/verify_email.end.tsx");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-interaction-renderer/src/navigator.tsx";
var routeConfig = {
  "consent": "interaction/consent",
  "login": {
    screens: {
      "login.credentials": "interaction/login/credentials",
      "login.index": "interaction/login",
      "login.consent": "interaction/consent"
    }
  },
  "logout": {
    screens: {
      "logout.end": "oidc/session/end/success",
      "logout.index": "oidc/session/end"
    }
  },
  "find_email": {
    screens: {
      "find_email.sent": "interaction/find_email/sent",
      "find_email.index": "interaction/find_email"
    }
  },
  "reset_password": {
    screens: {
      "reset_password.end": "interaction/reset_password/end",
      "reset_password.set": "interaction/reset_password/set",
      "reset_password.sent": "interaction/reset_password/sent",
      "reset_password.index": "interaction/reset_password"
    }
  },
  "register": {
    screens: {
      "register.end": "interaction/register/end",
      "register.detail": "interaction/register/detail",
      "register.index": "interaction/register"
    }
  },
  "verify_phone": {
    screens: {
      "verify_phone.end": "interaction/verify_phone/end",
      "verify_phone.sent": "interaction/verify_phone/sent",
      "verify_phone.index": "interaction/verify_phone"
    }
  },
  "verify_email": {
    screens: {
      "verify_email.end": "interaction/verify_email/end",
      "verify_email.sent": "interaction/verify_email/sent",
      "verify_email.index": "interaction/verify_email"
    }
  },
  "error": ""
};
exports.routeConfig = routeConfig;
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
      lineNumber: 108
    },
    __self: this
  }, _react.default.createElement(LoginStack.Screen, {
    name: "login.index",
    component: _login.LoginIndexScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 111
    },
    __self: this
  }), _react.default.createElement(LoginStack.Screen, {
    name: "login.credentials",
    component: _login2.LoginCredentialsScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 115
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
      lineNumber: 124
    },
    __self: this
  }, _react.default.createElement(LogoutStack.Screen, {
    name: "logout.index",
    component: _logout.LogoutIndexScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 127
    },
    __self: this
  }), _react.default.createElement(LogoutStack.Screen, {
    name: "logout.end",
    component: _logout2.LogoutEndScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 131
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
      lineNumber: 140
    },
    __self: this
  }, _react.default.createElement(FindEmailStack.Screen, {
    name: "find_email.index",
    component: _find_email.FindEmailIndexScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 143
    },
    __self: this
  }), _react.default.createElement(FindEmailStack.Screen, {
    name: "find_email.sent",
    component: _find_email2.FindEmailSentScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 147
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
      lineNumber: 156
    },
    __self: this
  }, _react.default.createElement(ResetPasswordStack.Screen, {
    name: "reset_password.index",
    component: _reset_password.ResetPasswordIndexScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 159
    },
    __self: this
  }), _react.default.createElement(ResetPasswordStack.Screen, {
    name: "reset_password.sent",
    component: _reset_password2.ResetPasswordSentScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 163
    },
    __self: this
  }), _react.default.createElement(ResetPasswordStack.Screen, {
    name: "reset_password.set",
    component: _reset_password3.ResetPasswordSetScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 167
    },
    __self: this
  }), _react.default.createElement(ResetPasswordStack.Screen, {
    name: "reset_password.end",
    component: _reset_password4.ResetPasswordEndScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 171
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
      lineNumber: 180
    },
    __self: this
  }, _react.default.createElement(RegisterStack.Screen, {
    name: "register.index",
    component: _register.RegisterIndexScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 183
    },
    __self: this
  }), _react.default.createElement(RegisterStack.Screen, {
    name: "register.detail",
    component: _register2.RegisterDetailScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 187
    },
    __self: this
  }), _react.default.createElement(RegisterStack.Screen, {
    name: "register.end",
    component: _register3.RegisterEndScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 191
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
      lineNumber: 200
    },
    __self: this
  }, _react.default.createElement(VerifyPhoneStack.Screen, {
    name: "verify_phone.index",
    component: _verify_phone.VerifyPhoneIndexScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 203
    },
    __self: this
  }), _react.default.createElement(VerifyPhoneStack.Screen, {
    name: "verify_phone.sent",
    component: _verify_phone2.VerifyPhoneSentScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 207
    },
    __self: this
  }), _react.default.createElement(VerifyPhoneStack.Screen, {
    name: "verify_phone.end",
    component: _verify_phone3.VerifyPhoneEndScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 211
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
      lineNumber: 220
    },
    __self: this
  }, _react.default.createElement(VerifyEmailStack.Screen, {
    name: "verify_email.index",
    component: _verify_email.VerifyEmailIndexScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 223
    },
    __self: this
  }), _react.default.createElement(VerifyEmailStack.Screen, {
    name: "verify_email.sent",
    component: _verify_email2.VerifyEmailSentScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 227
    },
    __self: this
  }), _react.default.createElement(VerifyEmailStack.Screen, {
    name: "verify_email.end",
    component: _verify_email3.VerifyEmailEndScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 231
    },
    __self: this
  }));
};

var Navigator = function Navigator() {
  return _react.default.createElement(RootStack.Navigator, {
    screenOptions: screenOptions,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 240
    },
    __self: this
  }, _react.default.createElement(RootStack.Screen, {
    name: "error",
    component: _error.ErrorScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 243
    },
    __self: this
  }), _react.default.createElement(RootStack.Screen, {
    name: "consent",
    component: _consent.ConsentScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 247
    },
    __self: this
  }), _react.default.createElement(RootStack.Screen, {
    name: "login",
    component: LoginStackScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 251
    },
    __self: this
  }), _react.default.createElement(RootStack.Screen, {
    name: "find_email",
    component: FindEmailStackScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 255
    },
    __self: this
  }), _react.default.createElement(RootStack.Screen, {
    name: "reset_password",
    component: ResetPasswordStackScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 259
    },
    __self: this
  }), _react.default.createElement(RootStack.Screen, {
    name: "register",
    component: RegisterStackScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 263
    },
    __self: this
  }), _react.default.createElement(RootStack.Screen, {
    name: "logout",
    component: LogoutStackScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 267
    },
    __self: this
  }), _react.default.createElement(RootStack.Screen, {
    name: "verify_phone",
    component: VerifyPhoneStackScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 271
    },
    __self: this
  }), _react.default.createElement(RootStack.Screen, {
    name: "verify_email",
    component: VerifyEmailStackScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 275
    },
    __self: this
  }));
};

exports.Navigator = Navigator;

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

var _regenerator = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/regenerator */ "../../node_modules/@babel/runtime/regenerator/index.js"));

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _styles = __webpack_require__(/*! ../styles */ "./src/styles.ts");

var _hook = __webpack_require__(/*! ../hook */ "./src/hook.ts");

var _layout = __webpack_require__(/*! ./layout */ "./src/screen/layout.tsx");

var _native = __webpack_require__(/*! @react-navigation/native */ "../../node_modules/@react-navigation/native/lib/module/index.js");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-interaction-renderer/src/screen/consent.tsx";

var ConsentScreen = function ConsentScreen() {
  var _useWithLoading = (0, _hook.useWithLoading)(),
      loading = _useWithLoading.loading,
      withLoading = _useWithLoading.withLoading,
      errors = _useWithLoading.errors,
      setErrors = _useWithLoading.setErrors;

  var nav = (0, _native.useNavigation)();
  var handleAccept = withLoading(function _callee() {
    return _regenerator.default.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
          case "end":
            return _context.stop();
        }
      }
    });
  }, []);
  var handleChangeAccount = withLoading(function () {
    return nav.navigate("login", {
      screen: "login.index",
      params: {}
    });
  }, [nav]);
  var _client$consent$user = {
    client: {
      name: "test",
      homepage_uri: "http://google.com",
      policy_uri: "http://google.com",
      tos_uri: "http://google.com"
    },
    consent: {
      scopes: {
        new: ["new1", "new2"],
        accepted: "accepted1"
      }
    },
    user: {
      name: "Dong Wook",
      email: "todo@todo.com",
      picture_uri: "https://yt3.ggpht.com/a-/AAuE7mA79aIT8nkc3dm0_QdYZbZKEJBV69I1AqXZWlFKog=s88-c-k-c0xffffffff-no-rj-mo"
    }
  },
      client = _client$consent$user.client,
      consent = _client$consent$user.consent,
      user = _client$consent$user.user;
  return _react.default.createElement(_layout.ScreenLayout, {
    title: _react.default.createElement("span", {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 46
      },
      __self: this
    }, "Sign in to ", _react.default.createElement(_styles.Link, {
      href: client.homepage_uri,
      target: "_blank",
      style: {
        color: _styles.ThemeStyles.palette.orange
      },
      variant: "xxLarge",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 46
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
        lineNumber: 70
      },
      __self: this
    }, "To continue, you need to offer ", consent.scopes.new.concat(consent.scopes.accepted).join(", "), " information. Before consent this application, you could review the ", _react.default.createElement(_styles.Link, {
      href: client.homepage_uri,
      target: "_blank",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 72
      },
      __self: this
    }, client.name), "'s ", _react.default.createElement(_styles.Link, {
      href: client.policy_uri,
      target: "_blank",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 72
      },
      __self: this
    }, "privacy policy"), " and ", _react.default.createElement(_styles.Link, {
      href: client.tos_uri,
      target: "_blank",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 72
      },
      __self: this
    }, "terms of service"), "."),
    error: errors.global,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 45
    },
    __self: this
  }, _react.default.createElement(_styles.Persona, {
    text: user.name,
    secondaryText: user.email,
    size: _styles.PersonaSize.size56,
    imageUrl: user.picture_uri,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 78
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
exports.ErrorScreen = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _layout = __webpack_require__(/*! ./layout */ "./src/screen/layout.tsx");

var _hook = __webpack_require__(/*! ../hook */ "./src/hook.ts");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-interaction-renderer/src/screen/error.tsx";

var ErrorScreen = function ErrorScreen() {
  var state = (0, _hook.useServerState)();
  var error = state.error || {
    error: "unexpected_error",
    error_description: "unrecognized state received from server"
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

var _native = __webpack_require__(/*! @react-navigation/native */ "../../node_modules/@react-navigation/native/lib/module/index.js");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-interaction-renderer/src/screen/find_email.index.tsx";

var FindEmailIndexScreen = function FindEmailIndexScreen() {
  var nav = (0, _native.useNavigation)();

  var _useState = (0, _react.useState)(""),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      phoneNumber = _useState2[0],
      setPhoneNumber = _useState2[1];

  var _useWithLoading = (0, _hook.useWithLoading)(),
      loading = _useWithLoading.loading,
      errors = _useWithLoading.errors,
      setErrors = _useWithLoading.setErrors,
      withLoading = _useWithLoading.withLoading;

  var handleCheckPhoneNumber = withLoading(function () {
    return nav.navigate("find_email", {
      screen: "find_email.sent",
      params: {
        phoneNumber: phoneNumber
      }
    });
  }, [phoneNumber]);
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
      tabIndex: 2
    }, {
      text: "Cancel",
      onClick: handleCancel,
      loading: loading,
      tabIndex: 3
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
      lineNumber: 46
    },
    __self: this
  }, "Have a registered phone number? Can find the ID only if have one."), _react.default.createElement(_styles.TextField, {
    label: "Phone number",
    type: "tel",
    inputMode: "tel",
    placeholder: "Enter your mobile phone number",
    autoFocus: true,
    tabIndex: 1,
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
      lineNumber: 49
    },
    __self: this
  }));
};

exports.FindEmailIndexScreen = FindEmailIndexScreen;

/***/ }),

/***/ "./src/screen/find_email.sent.tsx":
/*!****************************************!*\
  !*** ./src/screen/find_email.sent.tsx ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _interopRequireDefault = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FindEmailSentScreen = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _layout = __webpack_require__(/*! ./layout */ "./src/screen/layout.tsx");

var _styles = __webpack_require__(/*! ../styles */ "./src/styles.ts");

var _hook = __webpack_require__(/*! ../hook */ "./src/hook.ts");

var _native = __webpack_require__(/*! @react-navigation/native */ "../../node_modules/@react-navigation/native/lib/module/index.js");

var _screen_sent = _interopRequireDefault(__webpack_require__(/*! ../image/screen_sent.svg */ "./src/image/screen_sent.svg"));

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-interaction-renderer/src/screen/find_email.sent.tsx";

var FindEmailSentScreen = function FindEmailSentScreen() {
  var _useWithLoading = (0, _hook.useWithLoading)(),
      loading = _useWithLoading.loading,
      errors = _useWithLoading.errors,
      setErrors = _useWithLoading.setErrors,
      withLoading = _useWithLoading.withLoading;

  var nav = (0, _native.useNavigation)();
  var handleDone = withLoading(function () {
    return nav.navigate("login", {
      screen: "login.index",
      params: {}
    });
  });

  var _ref = (0, _native.useRoute)().params || {},
      _ref$phoneNumber = _ref.phoneNumber,
      phoneNumber = _ref$phoneNumber === void 0 ? "" : _ref$phoneNumber;

  return _react.default.createElement(_layout.ScreenLayout, {
    title: "Find email",
    subtitle: phoneNumber,
    buttons: [{
      primary: true,
      text: "Done",
      onClick: handleDone,
      loading: loading,
      tabIndex: 1
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
      lineNumber: 39
    },
    __self: this
  }));
};

exports.FindEmailSentScreen = FindEmailSentScreen;

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

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _reactNative = __webpack_require__(/*! react-native */ "../../node_modules/react-native-web/dist/index.js");

var _styles = __webpack_require__(/*! ../styles */ "./src/styles.ts");

var _logo = _interopRequireDefault(__webpack_require__(/*! ../image/logo.svg */ "./src/image/logo.svg"));

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-interaction-renderer/src/screen/layout.tsx";

var ScreenLayout = function ScreenLayout(props) {
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
      lineNumber: 22
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
      lineNumber: 23
    },
    __self: this
  }, _react.default.createElement(_styles.Image, {
    src: _logo.default,
    styles: {
      root: {
        height: "47px"
      }
    },
    shouldFadeIn: false,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 35
    },
    __self: this
  }), _react.default.createElement(_styles.Stack, {
    tokens: {
      childrenGap: 5
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 37
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
      lineNumber: 38
    },
    __self: this
  }), _react.default.createElement(_styles.Text, {
    variant: "large",
    children: subtitle,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 43
    },
    __self: this
  })), _react.default.createElement(_styles.Stack, {
    tokens: {
      childrenGap: 15
    },
    children: children,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 46
    },
    __self: this
  }), _react.default.createElement(_styles.Stack, {
    tokens: {
      childrenGap: 15
    },
    verticalAlign: "end",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 48
    },
    __self: this
  }, error ? _react.default.createElement(_styles.MessageBar, {
    messageBarType: _styles.MessageBarType.error,
    styles: {
      root: _styles.AnimationStyles.slideDownIn20
    },
    children: error,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 49
    },
    __self: this
  }) : null, buttons.map(function (_ref, index) {
    var primary = _ref.primary,
        text = _ref.text,
        onClick = _ref.onClick,
        autoFocus = _ref.autoFocus,
        loading = _ref.loading,
        tabIndex = _ref.tabIndex;
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
        lineNumber: 52
      },
      __self: this
    });
  }), footer)));
};

exports.ScreenLayout = ScreenLayout;

/***/ }),

/***/ "./src/screen/login.credentials.tsx":
/*!******************************************!*\
  !*** ./src/screen/login.credentials.tsx ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _interopRequireDefault = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../node_modules/@babel/runtime/helpers/interopRequireDefault.js");

var _interopRequireWildcard = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireWildcard */ "../../node_modules/@babel/runtime/helpers/interopRequireWildcard.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LoginCredentialsScreen = void 0;

var _regenerator = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/regenerator */ "../../node_modules/@babel/runtime/regenerator/index.js"));

var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/slicedToArray */ "../../node_modules/@babel/runtime/helpers/esm/slicedToArray.js"));

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _layout = __webpack_require__(/*! ./layout */ "./src/screen/layout.tsx");

var _styles = __webpack_require__(/*! ../styles */ "./src/styles.ts");

var _hook = __webpack_require__(/*! ../hook */ "./src/hook.ts");

var _native = __webpack_require__(/*! @react-navigation/native */ "../../node_modules/@react-navigation/native/lib/module/index.js");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-interaction-renderer/src/screen/login.credentials.tsx";

var LoginCredentialsScreen = function LoginCredentialsScreen() {
  var nav = (0, _native.useNavigation)();

  var _ref = (0, _native.useRoute)().params || {},
      _ref$email = _ref.email,
      email = _ref$email === void 0 ? "" : _ref$email,
      _ref$name = _ref.name,
      name = _ref$name === void 0 ? "" : _ref$name;

  var _useWithLoading = (0, _hook.useWithLoading)(),
      loading = _useWithLoading.loading,
      errors = _useWithLoading.errors,
      setErrors = _useWithLoading.setErrors,
      withLoading = _useWithLoading.withLoading;

  var _useState = (0, _react.useState)(""),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      password = _useState2[0],
      setPassword = _useState2[1];

  var handleCheckLoginPassword = withLoading(function _callee() {
    return _regenerator.default.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
          case "end":
            return _context.stop();
        }
      }
    });
  }, [password]);
  var handleResetPassword = withLoading(function () {
    return nav.navigate("reset_password", {
      screen: "reset_password.index",
      params: {
        email: email
      }
    });
  }, [nav, email]);
  var handleCancel = withLoading(function () {
    return nav.navigate("login", {
      screen: "login.index",
      params: {
        email: email
      }
    });
  }, [nav, email]);
  return _react.default.createElement(_layout.ScreenLayout, {
    title: "Hi, " + name,
    subtitle: email,
    buttons: [{
      primary: true,
      text: "Sign in",
      onClick: handleCheckLoginPassword,
      loading: loading,
      tabIndex: 2
    }, {
      text: "Cancel",
      onClick: handleCancel,
      tabIndex: 3
    }],
    error: errors.global,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 33
    },
    __self: this
  }, _react.default.createElement("form", {
    onSubmit: function onSubmit(e) {
      e.preventDefault();
      handleCheckLoginPassword();
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 52
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
      lineNumber: 53
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
    tabIndex: 1,
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
      lineNumber: 54
    },
    __self: this
  })), _react.default.createElement(_styles.Link, {
    tabIndex: 4,
    onClick: handleResetPassword,
    variant: "small",
    style: {
      marginTop: "10px"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 70
    },
    __self: this
  }, "Forgot password?"));
};

exports.LoginCredentialsScreen = LoginCredentialsScreen;

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

var _native = __webpack_require__(/*! @react-navigation/native */ "../../node_modules/@react-navigation/native/lib/module/index.js");

var _layout = __webpack_require__(/*! ./layout */ "./src/screen/layout.tsx");

var _styles = __webpack_require__(/*! ../styles */ "./src/styles.ts");

var _hook = __webpack_require__(/*! ../hook */ "./src/hook.ts");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-interaction-renderer/src/screen/login.index.tsx";

var LoginIndexScreen = function LoginIndexScreen() {
  var nav = (0, _native.useNavigation)();

  var _useWithLoading = (0, _hook.useWithLoading)(),
      loading = _useWithLoading.loading,
      errors = _useWithLoading.errors,
      setErrors = _useWithLoading.setErrors,
      withLoading = _useWithLoading.withLoading;

  var _useState = (0, _react.useState)(((0, _native.useRoute)().params || {}).email || ""),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      email = _useState2[0],
      setEmail = _useState2[1];

  var federationProviders = ["google", "kakao", "facebook"];

  var _useState3 = (0, _react.useState)(false),
      _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
      federationOptionsVisible = _useState4[0],
      setFederationOptionsVisible = _useState4[1];

  var handleCheckLoginEmail = withLoading(function () {
    nav.navigate("login", {
      screen: "login.credentials",
      params: {
        email: email || "todo@todo.com",
        name: "Dong Wook"
      }
    });
  }, [email, nav]);
  var handleFindEmail = withLoading(function () {
    return nav.navigate("find_email", {
      screen: "find_email.index",
      params: {}
    });
  }, [nav]);
  var handleSignUp = withLoading(function () {
    return nav.navigate("register", {
      screen: "register.index",
      params: {}
    });
  }, [nav]);
  var handleFederation = withLoading(function (provider) {
    alert(provider);
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
      tabIndex: 2
    }, {
      text: "Sign up",
      onClick: handleSignUp,
      loading: loading,
      tabIndex: 3
    }],
    footer: federationProviders.length > 0 ? _react.default.createElement(_react.default.Fragment, null, _react.default.createElement(_styles.Separator, {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 66
      },
      __self: this
    }, _react.default.createElement("span", {
      style: {
        color: _styles.ThemeStyles.palette.neutralTertiary
      },
      __source: {
        fileName: _jsxFileName,
        lineNumber: 66
      },
      __self: this
    }, "OR")), federationOptionsVisible ? _react.default.createElement(_styles.Stack, {
      tokens: {
        childrenGap: 15
      },
      __source: {
        fileName: _jsxFileName,
        lineNumber: 68
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
        lineNumber: 70
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
        lineNumber: 78
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
        lineNumber: 86
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
        lineNumber: 102
      },
      __self: this
    }, "Find more login options?")) : undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 44
    },
    __self: this
  }, _react.default.createElement("form", {
    onSubmit: function onSubmit(e) {
      e.preventDefault();
      handleCheckLoginEmail();
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 108
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
    tabIndex: 1,
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
      lineNumber: 109
    },
    __self: this
  })), _react.default.createElement(_styles.Link, {
    onClick: handleFindEmail,
    tabIndex: 5,
    variant: "small",
    style: {
      marginTop: "10px"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 127
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

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _styles = __webpack_require__(/*! ../styles */ "./src/styles.ts");

var _hook = __webpack_require__(/*! ../hook */ "./src/hook.ts");

var _layout = __webpack_require__(/*! ./layout */ "./src/screen/layout.tsx");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-interaction-renderer/src/screen/logout.end.tsx";

var LogoutEndScreen = function LogoutEndScreen() {
  var _useClose = (0, _hook.useClose)(false),
      closed = _useClose.closed,
      close = _useClose.close;

  return _react.default.createElement(_layout.ScreenLayout, {
    title: "Signed out",
    buttons: [{
      primary: false,
      text: "Close",
      onClick: close,
      loading: closed,
      tabIndex: 1
    }],
    error: closed ? "Please close the window manually." : undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 12
    },
    __self: this
  }, _react.default.createElement(_styles.Text, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 25
    },
    __self: this
  }, "All you sessions have been closed successfully."));
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

var _regenerator = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/regenerator */ "../../node_modules/@babel/runtime/regenerator/index.js"));

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _styles = __webpack_require__(/*! ../styles */ "./src/styles.ts");

var _hook = __webpack_require__(/*! ../hook */ "./src/hook.ts");

var _layout = __webpack_require__(/*! ./layout */ "./src/screen/layout.tsx");

var _native = __webpack_require__(/*! @react-navigation/native */ "../../node_modules/@react-navigation/native/lib/module/index.js");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-interaction-renderer/src/screen/logout.index.tsx";

var LogoutIndexScreen = function LogoutIndexScreen() {
  var _useWithLoading = (0, _hook.useWithLoading)(),
      loading = _useWithLoading.loading,
      withLoading = _useWithLoading.withLoading,
      errors = _useWithLoading.errors,
      setErrors = _useWithLoading.setErrors;

  var nav = (0, _native.useNavigation)();
  var handleSignOutAll = withLoading(function _callee() {
    return _regenerator.default.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            nav.navigate("logout", {
              screen: "logout.end",
              params: {}
            });

          case 1:
          case "end":
            return _context.stop();
        }
      }
    });
  }, []);

  var _useClose = (0, _hook.useClose)(false),
      closed = _useClose.closed,
      close = _useClose.close;

  var _client = {
    client: {
      name: "test"
    }
  },
      client = _client.client;
  return _react.default.createElement(_layout.ScreenLayout, {
    title: "Signed out",
    subtitle: "Do you want to close all the other sessions?",
    buttons: [{
      primary: true,
      text: "Sign out all",
      onClick: handleSignOutAll,
      loading: loading
    }, {
      primary: false,
      text: "Close",
      onClick: close,
      loading: closed,
      tabIndex: 1
    }],
    error: errors.global || (closed ? "Please close the window manually." : undefined),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 25
    },
    __self: this
  }, _react.default.createElement(_styles.Text, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 45
    },
    __self: this
  }, "You has been signed out from ", client.name, "."));
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

var _objectSpread2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/objectSpread2 */ "../../node_modules/@babel/runtime/helpers/esm/objectSpread2.js"));

var _regenerator = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/regenerator */ "../../node_modules/@babel/runtime/regenerator/index.js"));

var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/slicedToArray */ "../../node_modules/@babel/runtime/helpers/esm/slicedToArray.js"));

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _layout = __webpack_require__(/*! ./layout */ "./src/screen/layout.tsx");

var _styles = __webpack_require__(/*! ../styles */ "./src/styles.ts");

var _hook = __webpack_require__(/*! ../hook */ "./src/hook.ts");

var _native = __webpack_require__(/*! @react-navigation/native */ "../../node_modules/@react-navigation/native/lib/module/index.js");

var _moment = _interopRequireDefault(__webpack_require__(/*! moment */ "../../node_modules/moment/moment.js"));

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-interaction-renderer/src/screen/register.detail.tsx";

var RegisterDetailScreen = function RegisterDetailScreen() {
  var nav = (0, _native.useNavigation)();

  var _useState = (0, _react.useState)({
    phone_number: "",
    birthdate: "",
    gender: ""
  }),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      payload = _useState2[0],
      setPayload = _useState2[1];

  var _useWithLoading = (0, _hook.useWithLoading)(),
      loading = _useWithLoading.loading,
      errors = _useWithLoading.errors,
      setErrors = _useWithLoading.setErrors,
      withLoading = _useWithLoading.withLoading;

  var handlePayloadSubmit = withLoading(function _callee() {
    return _regenerator.default.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (payload.phone_number) {
              nav.navigate("verify_phone", {
                screen: "verify_phone.index",
                params: {
                  phoneNumber: payload.phone_number,
                  callback: "register"
                }
              });
            } else {
              nav.navigate("register", {
                screen: "register.end",
                params: {
                  email: "to@do.com"
                }
              });
            }

          case 1:
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
  var _email = {
    email: "to@do.com"
  },
      email = _email.email;
  return _react.default.createElement(_layout.ScreenLayout, {
    title: "Sign up",
    subtitle: email,
    buttons: [{
      primary: true,
      text: "Continue",
      onClick: handlePayloadSubmit,
      loading: loading,
      tabIndex: 3
    }, {
      text: "Cancel",
      onClick: handleCancel,
      loading: loading,
      tabIndex: 4
    }],
    error: errors.global,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 44
    },
    __self: this
  }, _react.default.createElement("form", {
    onSubmit: function onSubmit(e) {
      e.preventDefault();
      handlePayloadSubmit();
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 64
    },
    __self: this
  }, _react.default.createElement(_styles.Stack, {
    tokens: {
      childrenGap: 15
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 68
    },
    __self: this
  }, _react.default.createElement(_styles.Text, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 69
    },
    __self: this
  }, "It is highly recommended to enter the mobile phone number to make it easier to find the your lost account."), _react.default.createElement(_styles.TextField, {
    label: "Phone (optional)",
    type: "text",
    inputMode: "tel",
    placeholder: "Enter your mobile phone number",
    autoFocus: true,
    tabIndex: 1,
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
      lineNumber: 70
    },
    __self: this
  }), _react.default.createElement(_styles.DatePicker, {
    label: "Birthdate",
    placeholder: "Select your birthdate",
    tabIndex: 2,
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
      lineNumber: 84
    },
    __self: this
  }), errors.birthdate ? _react.default.createElement(_styles.Label, {
    styles: _styles.LabelStyles.fieldErrorMessage,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 103
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
      lineNumber: 105
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

var _native = __webpack_require__(/*! @react-navigation/native */ "../../node_modules/@react-navigation/native/lib/module/index.js");

var _layout = __webpack_require__(/*! ./layout */ "./src/screen/layout.tsx");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-interaction-renderer/src/screen/register.end.tsx";

var RegisterEndScreen = function RegisterEndScreen() {
  var _useWithLoading = (0, _hook.useWithLoading)(),
      loading = _useWithLoading.loading,
      errors = _useWithLoading.errors,
      setErrors = _useWithLoading.setErrors,
      withLoading = _useWithLoading.withLoading;

  var _ref = (0, _native.useRoute)().params || {},
      _ref$email = _ref.email,
      email = _ref$email === void 0 ? "" : _ref$email;

  var nav = (0, _native.useNavigation)();
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
      lineNumber: 28
    },
    __self: this
  }, _react.default.createElement(_styles.Text, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 43
    },
    __self: this
  }, "Congratulations! The account has been registered. This email account can be used to sign in to multiple services. So don't forget it please. \uD83D\uDE42"));
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

var _native = __webpack_require__(/*! @react-navigation/native */ "../../node_modules/@react-navigation/native/lib/module/index.js");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-interaction-renderer/src/screen/register.index.tsx";

var RegisterIndexScreen = function RegisterIndexScreen() {
  var nav = (0, _native.useNavigation)();

  var _useState = (0, _react.useState)({
    name: "",
    email: "",
    password: "",
    password_confirmation: ""
  }),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      payload = _useState2[0],
      setPayload = _useState2[1];

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
    return _regenerator.default.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            nav.navigate("register", {
              screen: "register.detail",
              params: {}
            });

          case 1:
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

  var _useServerState = (0, _hook.useServerState)(),
      metadata = _useServerState.metadata;

  return _react.default.createElement(_layout.ScreenLayout, {
    title: "Sign up",
    subtitle: "Create account",
    buttons: [{
      primary: true,
      text: "Continue",
      onClick: handlePayloadSubmit,
      loading: loading,
      tabIndex: 5
    }, {
      text: "Cancel",
      onClick: handleCancel,
      loading: loading,
      tabIndex: 6
    }],
    error: errors.global,
    footer: _react.default.createElement(_react.default.Fragment, null, _react.default.createElement(_styles.Text, {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 54
      },
      __self: this
    }, "When you sign up as a member, you agree to the ", _react.default.createElement(_styles.Link, {
      href: metadata.op_tos_uri,
      target: "_blank",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 54
      },
      __self: this
    }, "terms of service"), " and the ", _react.default.createElement(_styles.Link, {
      href: metadata.op_policy_uri,
      target: "_blank",
      __source: {
        fileName: _jsxFileName,
        lineNumber: 54
      },
      __self: this
    }, "privacy policy"), ".")),
    __source: {
      fileName: _jsxFileName,
      lineNumber: 33
    },
    __self: this
  }, _react.default.createElement("form", {
    onSubmit: function onSubmit(e) {
      e.preventDefault();
      handlePayloadSubmit();
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 58
    },
    __self: this
  }, _react.default.createElement(_styles.Stack, {
    tokens: {
      childrenGap: 15
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 62
    },
    __self: this
  }, _react.default.createElement(_styles.TextField, {
    label: "Name",
    type: "text",
    inputMode: "text",
    placeholder: "Enter your name",
    autoFocus: true,
    tabIndex: 1,
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
      lineNumber: 63
    },
    __self: this
  }), _react.default.createElement(_styles.TextField, {
    label: "Email",
    type: "text",
    inputMode: "email",
    placeholder: "Enter your email",
    autoComplete: "username",
    tabIndex: 2,
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
      lineNumber: 76
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
    tabIndex: 3,
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
      lineNumber: 89
    },
    __self: this
  }), _react.default.createElement(_styles.TextField, {
    label: "Confirm",
    type: "password",
    inputMode: "text",
    autoComplete: "password",
    placeholder: "Confirm your password",
    tabIndex: 4,
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
      lineNumber: 103
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

var _native = __webpack_require__(/*! @react-navigation/native */ "../../node_modules/@react-navigation/native/lib/module/index.js");

var _layout = __webpack_require__(/*! ./layout */ "./src/screen/layout.tsx");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-interaction-renderer/src/screen/reset_password.end.tsx";

var ResetPasswordEndScreen = function ResetPasswordEndScreen() {
  var _useWithLoading = (0, _hook.useWithLoading)(),
      loading = _useWithLoading.loading,
      errors = _useWithLoading.errors,
      setErrors = _useWithLoading.setErrors,
      withLoading = _useWithLoading.withLoading;

  var _ref = (0, _native.useRoute)().params || {},
      _ref$email = _ref.email,
      email = _ref$email === void 0 ? "" : _ref$email;

  var nav = (0, _native.useNavigation)();
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
      lineNumber: 39
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

var _native = __webpack_require__(/*! @react-navigation/native */ "../../node_modules/@react-navigation/native/lib/module/index.js");

var _layout = __webpack_require__(/*! ./layout */ "./src/screen/layout.tsx");

var _screen_password = _interopRequireDefault(__webpack_require__(/*! ../image/screen_password.svg */ "./src/image/screen_password.svg"));

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-interaction-renderer/src/screen/reset_password.index.tsx";

var ResetPasswordIndexScreen = function ResetPasswordIndexScreen() {
  var _useWithLoading = (0, _hook.useWithLoading)(),
      loading = _useWithLoading.loading,
      errors = _useWithLoading.errors,
      setErrors = _useWithLoading.setErrors,
      withLoading = _useWithLoading.withLoading;

  var _ref = (0, _native.useRoute)().params || {},
      _ref$email = _ref.email,
      email = _ref$email === void 0 ? "" : _ref$email;

  var nav = (0, _native.useNavigation)();
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
      tabIndex: 2
    }, {
      text: "Cancel",
      onClick: handleCancel,
      loading: loading,
      tabIndex: 3
    }],
    error: errors.global,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 32
    },
    __self: this
  }, _react.default.createElement(_styles.Text, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 52
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
      lineNumber: 55
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

var _screen_sent = _interopRequireDefault(__webpack_require__(/*! ../image/screen_sent.svg */ "./src/image/screen_sent.svg"));

var _native = __webpack_require__(/*! @react-navigation/native */ "../../node_modules/@react-navigation/native/lib/module/index.js");

var _layout = __webpack_require__(/*! ./layout */ "./src/screen/layout.tsx");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-interaction-renderer/src/screen/reset_password.sent.tsx";

var ResetPasswordSentScreen = function ResetPasswordSentScreen() {
  var _useWithLoading = (0, _hook.useWithLoading)(),
      loading = _useWithLoading.loading,
      errors = _useWithLoading.errors,
      setErrors = _useWithLoading.setErrors,
      withLoading = _useWithLoading.withLoading;

  var _ref = (0, _native.useRoute)().params || {},
      _ref$email = _ref.email,
      email = _ref$email === void 0 ? "" : _ref$email,
      _ref$ttl = _ref.ttl,
      ttl = _ref$ttl === void 0 ? 0 : _ref$ttl;

  var nav = (0, _native.useNavigation)();
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
      tabIndex: 1
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
      lineNumber: 38
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
      lineNumber: 41
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

var _native = __webpack_require__(/*! @react-navigation/native */ "../../node_modules/@react-navigation/native/lib/module/index.js");

var _layout = __webpack_require__(/*! ./layout */ "./src/screen/layout.tsx");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-interaction-renderer/src/screen/reset_password.set.tsx";

var ResetPasswordSetScreen = function ResetPasswordSetScreen() {
  var _useWithLoading = (0, _hook.useWithLoading)(),
      loading = _useWithLoading.loading,
      errors = _useWithLoading.errors,
      setErrors = _useWithLoading.setErrors,
      withLoading = _useWithLoading.withLoading;

  var _ref = (0, _native.useRoute)().params || {},
      _ref$email = _ref.email,
      email = _ref$email === void 0 ? "" : _ref$email;

  var _useState = (0, _react.useState)({
    password: "",
    password_confirmation: ""
  }),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      payload = _useState2[0],
      setPayload = _useState2[1];

  var nav = (0, _native.useNavigation)();
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
      tabIndex: 3
    }],
    error: errors.global,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 29
    },
    __self: this
  }, _react.default.createElement(_styles.Text, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 43
    },
    __self: this
  }, "Set a new password for your account."), _react.default.createElement(_styles.TextField, {
    label: "Password",
    type: "password",
    inputMode: "text",
    placeholder: "Enter new password",
    autoFocus: true,
    tabIndex: 1,
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
      lineNumber: 46
    },
    __self: this
  }), _react.default.createElement(_styles.TextField, {
    label: "Confirm",
    type: "password",
    inputMode: "text",
    autoComplete: "password",
    placeholder: "Confirm your password",
    tabIndex: 2,
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
      lineNumber: 59
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

var _native = __webpack_require__(/*! @react-navigation/native */ "../../node_modules/@react-navigation/native/lib/module/index.js");

var _layout = __webpack_require__(/*! ./layout */ "./src/screen/layout.tsx");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-interaction-renderer/src/screen/verify_email.end.tsx";

var VerifyEmailEndScreen = function VerifyEmailEndScreen() {
  var _useWithLoading = (0, _hook.useWithLoading)(),
      loading = _useWithLoading.loading,
      errors = _useWithLoading.errors,
      setErrors = _useWithLoading.setErrors,
      withLoading = _useWithLoading.withLoading;

  var _ref = (0, _native.useRoute)().params || {},
      _ref$email = _ref.email,
      email = _ref$email === void 0 ? "" : _ref$email;

  var nav = (0, _native.useNavigation)();
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
      tabIndex: 1
    }],
    error: errors.global,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 27
    },
    __self: this
  }, _react.default.createElement(_styles.Text, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 41
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

var _native = __webpack_require__(/*! @react-navigation/native */ "../../node_modules/@react-navigation/native/lib/module/index.js");

var _layout = __webpack_require__(/*! ./layout */ "./src/screen/layout.tsx");

var _screen_verify = _interopRequireDefault(__webpack_require__(/*! ../image/screen_verify.svg */ "./src/image/screen_verify.svg"));

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-interaction-renderer/src/screen/verify_email.index.tsx";

var VerifyEmailIndexScreen = function VerifyEmailIndexScreen() {
  var _useWithLoading = (0, _hook.useWithLoading)(),
      loading = _useWithLoading.loading,
      errors = _useWithLoading.errors,
      setErrors = _useWithLoading.setErrors,
      withLoading = _useWithLoading.withLoading;

  var _ref = (0, _native.useRoute)().params || {},
      _ref$email = _ref.email,
      email = _ref$email === void 0 ? "" : _ref$email,
      _ref$callback = _ref.callback,
      callback = _ref$callback === void 0 ? "" : _ref$callback;

  var nav = (0, _native.useNavigation)();
  var handleSend = withLoading(function () {
    nav.navigate("verify_email", {
      screen: "verify_email.sent",
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
      tabIndex: 2
    }, {
      text: "Cancel",
      onClick: handleCancel,
      loading: loading,
      tabIndex: 3
    }],
    error: errors.global,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 39
    },
    __self: this
  }, _react.default.createElement(_styles.Text, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 59
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
      lineNumber: 62
    },
    __self: this
  }));
};

exports.VerifyEmailIndexScreen = VerifyEmailIndexScreen;

/***/ }),

/***/ "./src/screen/verify_email.sent.tsx":
/*!******************************************!*\
  !*** ./src/screen/verify_email.sent.tsx ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _interopRequireDefault = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VerifyEmailSentScreen = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _styles = __webpack_require__(/*! ../styles */ "./src/styles.ts");

var _hook = __webpack_require__(/*! ../hook */ "./src/hook.ts");

var _native = __webpack_require__(/*! @react-navigation/native */ "../../node_modules/@react-navigation/native/lib/module/index.js");

var _layout = __webpack_require__(/*! ./layout */ "./src/screen/layout.tsx");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-interaction-renderer/src/screen/verify_email.sent.tsx";

var VerifyEmailSentScreen = function VerifyEmailSentScreen() {
  var _useWithLoading = (0, _hook.useWithLoading)(),
      loading = _useWithLoading.loading,
      errors = _useWithLoading.errors,
      setErrors = _useWithLoading.setErrors,
      withLoading = _useWithLoading.withLoading;

  var _ref = (0, _native.useRoute)().params || {},
      _ref$email = _ref.email,
      email = _ref$email === void 0 ? "" : _ref$email,
      _ref$ttl = _ref.ttl,
      ttl = _ref$ttl === void 0 ? 0 : _ref$ttl,
      _ref$callback = _ref.callback,
      callback = _ref$callback === void 0 ? "" : _ref$callback;

  var nav = (0, _native.useNavigation)();
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
      lineNumber: 48
    },
    __self: this
  }, "An email with the verification link has been sent."));
};

exports.VerifyEmailSentScreen = VerifyEmailSentScreen;

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

var _native = __webpack_require__(/*! @react-navigation/native */ "../../node_modules/@react-navigation/native/lib/module/index.js");

var _layout = __webpack_require__(/*! ./layout */ "./src/screen/layout.tsx");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-interaction-renderer/src/screen/verify_phone.end.tsx";

var VerifyPhoneEndScreen = function VerifyPhoneEndScreen() {
  var _useWithLoading = (0, _hook.useWithLoading)(),
      loading = _useWithLoading.loading,
      errors = _useWithLoading.errors,
      setErrors = _useWithLoading.setErrors,
      withLoading = _useWithLoading.withLoading;

  var _ref = (0, _native.useRoute)().params || {},
      _ref$phoneNumber = _ref.phoneNumber,
      phoneNumber = _ref$phoneNumber === void 0 ? "" : _ref$phoneNumber;

  var nav = (0, _native.useNavigation)();
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
      lineNumber: 39
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

var _native = __webpack_require__(/*! @react-navigation/native */ "../../node_modules/@react-navigation/native/lib/module/index.js");

var _layout = __webpack_require__(/*! ./layout */ "./src/screen/layout.tsx");

var _screen_verify = _interopRequireDefault(__webpack_require__(/*! ../image/screen_verify.svg */ "./src/image/screen_verify.svg"));

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-interaction-renderer/src/screen/verify_phone.index.tsx";

var VerifyPhoneIndexScreen = function VerifyPhoneIndexScreen() {
  var _useWithLoading = (0, _hook.useWithLoading)(),
      loading = _useWithLoading.loading,
      errors = _useWithLoading.errors,
      setErrors = _useWithLoading.setErrors,
      withLoading = _useWithLoading.withLoading;

  var _ref = (0, _native.useRoute)().params || {},
      _ref$phoneNumber = _ref.phoneNumber,
      phoneNumber = _ref$phoneNumber === void 0 ? "" : _ref$phoneNumber,
      _ref$callback = _ref.callback,
      callback = _ref$callback === void 0 ? "" : _ref$callback;

  var nav = (0, _native.useNavigation)();
  var handleSend = withLoading(function () {
    nav.navigate("verify_phone", {
      screen: "verify_phone.sent",
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
      tabIndex: 2
    }, {
      text: "Cancel",
      onClick: handleCancel,
      loading: loading,
      tabIndex: 3
    }],
    error: errors.global,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 37
    },
    __self: this
  }, _react.default.createElement(_styles.Text, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 57
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
      lineNumber: 60
    },
    __self: this
  }));
};

exports.VerifyPhoneIndexScreen = VerifyPhoneIndexScreen;

/***/ }),

/***/ "./src/screen/verify_phone.sent.tsx":
/*!******************************************!*\
  !*** ./src/screen/verify_phone.sent.tsx ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _interopRequireDefault = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../node_modules/@babel/runtime/helpers/interopRequireDefault.js");

var _interopRequireWildcard = __webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireWildcard */ "../../node_modules/@babel/runtime/helpers/interopRequireWildcard.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VerifyPhoneSentScreen = void 0;

var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! /Users/dehypnosis/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/slicedToArray */ "../../node_modules/@babel/runtime/helpers/esm/slicedToArray.js"));

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _styles = __webpack_require__(/*! ../styles */ "./src/styles.ts");

var _hook = __webpack_require__(/*! ../hook */ "./src/hook.ts");

var _native = __webpack_require__(/*! @react-navigation/native */ "../../node_modules/@react-navigation/native/lib/module/index.js");

var _layout = __webpack_require__(/*! ./layout */ "./src/screen/layout.tsx");

var _jsxFileName = "/Users/dehypnosis/Synced/qmit/moleculer-iam/pkg/moleculer-iam-interaction-renderer/src/screen/verify_phone.sent.tsx";

var VerifyPhoneSentScreen = function VerifyPhoneSentScreen() {
  var _useWithLoading = (0, _hook.useWithLoading)(),
      loading = _useWithLoading.loading,
      errors = _useWithLoading.errors,
      setErrors = _useWithLoading.setErrors,
      withLoading = _useWithLoading.withLoading;

  var _useState = (0, _react.useState)(""),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      code = _useState2[0],
      setCode = _useState2[1];

  var _ref = (0, _native.useRoute)().params || {},
      _ref$phoneNumber = _ref.phoneNumber,
      phoneNumber = _ref$phoneNumber === void 0 ? "" : _ref$phoneNumber,
      _ref$ttl = _ref.ttl,
      ttl = _ref$ttl === void 0 ? 0 : _ref$ttl,
      _ref$callback = _ref.callback,
      callback = _ref$callback === void 0 ? "" : _ref$callback;

  var _useState3 = (0, _react.useState)(ttl),
      _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
      remainingSeconds = _useState4[0],
      setRemainingSeconds = _useState4[1];

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
  var nav = (0, _native.useNavigation)();
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
    if (callback === "register") {
      nav.navigate("register", {
        screen: "register.detail",
        params: {}
      });
    } else {
      nav.navigate("login", {
        screen: "login.index",
        params: {}
      });
    }
  }, [nav, phoneNumber, callback]);
  return _react.default.createElement(_layout.ScreenLayout, {
    title: "Verify phone number",
    subtitle: phoneNumber,
    buttons: [{
      primary: true,
      text: "Continue",
      onClick: handleVerify,
      loading: loading,
      tabIndex: 2
    }, {
      text: "Resend",
      onClick: handleResend,
      loading: loading,
      tabIndex: 3
    }, {
      text: "Cancel",
      onClick: handleCancel,
      loading: loading,
      tabIndex: 4
    }],
    error: errors.global,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 60
    },
    __self: this
  }, _react.default.createElement(_styles.Text, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 86
    },
    __self: this
  }, "Enter the received 6-digit verification code."), _react.default.createElement(_styles.TextField, {
    label: "Verification code",
    type: "tel",
    inputMode: "tel",
    placeholder: "Enter the verification code",
    autoFocus: true,
    tabIndex: 1,
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
      lineNumber: 89
    },
    __self: this
  }));
};

exports.VerifyPhoneSentScreen = VerifyPhoneSentScreen;

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

__webpack_require__(/*! ./styles.css */ "./src/styles.css");

(0, _lib.loadTheme)({
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
});
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