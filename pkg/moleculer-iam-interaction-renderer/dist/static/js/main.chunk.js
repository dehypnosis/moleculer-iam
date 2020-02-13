(this["webpackJsonpmoleculer-iam-interaction-renderer"] = this["webpackJsonpmoleculer-iam-interaction-renderer"] || []).push([["main"],{

/***/ "../../node_modules/css-loader/dist/cjs.js?!../../node_modules/postcss-loader/src/index.js?!./src/styles.css":
/*!*******************************************************************************************************************************************************************************************************!*\
  !*** /Users/dw.kim/Synced/qmit/moleculer-iam/node_modules/css-loader/dist/cjs.js??ref--6-oneOf-3-1!/Users/dw.kim/Synced/qmit/moleculer-iam/node_modules/postcss-loader/src??postcss!./src/styles.css ***!
  \*******************************************************************************************************************************************************************************************************/
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

var _interopRequireDefault = __webpack_require__(/*! /Users/dw.kim/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../node_modules/@babel/runtime/helpers/interopRequireDefault.js");

var _interopRequireWildcard = __webpack_require__(/*! /Users/dw.kim/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireWildcard */ "../../node_modules/@babel/runtime/helpers/interopRequireWildcard.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.App = void 0;

var _regenerator = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/regenerator */ "../../node_modules/@babel/runtime/regenerator/index.js"));

var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! /Users/dw.kim/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/slicedToArray */ "../../node_modules/@babel/runtime/helpers/esm/slicedToArray.js"));

var _react = _interopRequireWildcard(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _native = __webpack_require__(/*! @react-navigation/native */ "../../node_modules/@react-navigation/native/lib/module/index.js");

var _navigator = __webpack_require__(/*! ./navigator */ "./src/navigator.tsx");

var _jsxFileName = "/Users/dw.kim/Synced/qmit/moleculer-iam/pkg/moleculer-iam-interaction-renderer/src/app.tsx";

var App = function App() {
  var ref = (0, _react.useRef)();

  var _useLinking = (0, _native.useLinking)(ref, {
    prefixes: [window.location.origin],
    config: _navigator.routeConfig
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
      lineNumber: 35
    },
    __self: this
  }, _react.default.createElement(_navigator.Navigator, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 39
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

var _interopRequireDefault = __webpack_require__(/*! /Users/dw.kim/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useWithLoading = useWithLoading;
exports.useServerState = useServerState;
exports.useClose = useClose;

var _regenerator = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/regenerator */ "../../node_modules/@babel/runtime/regenerator/index.js"));

var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! /Users/dw.kim/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/slicedToArray */ "../../node_modules/@babel/runtime/helpers/esm/slicedToArray.js"));

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

  var withLoading = (0, _react.useCallback)(function _callee(callback) {
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
              return setLoading(false);
            }, 500);
            return _context.finish(13);

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[4, 9, 13, 16]]);
  }, [loading]);
  return {
    withLoading: withLoading,
    loading: loading,
    setLoading: setLoading,
    errors: errors,
    setErrors: setErrors
  };
}

function useServerState() {
  return window.__SERVER_STATE__ || {};
}

function useClose() {
  var _useState5 = (0, _react.useState)(false),
      _useState6 = (0, _slicedToArray2.default)(_useState5, 2),
      closed = _useState6[0],
      setClosed = _useState6[1];

  var nav = (0, _native.useNavigation)();
  var close = (0, _react.useCallback)(function () {
    if (nav.canGoBack()) {
      nav.goBack();
    } else {
      window.close();
      setTimeout(function () {
        setClosed(true);
      }, 1000);
    }
  }, [nav, setClosed]);
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

/***/ "./src/index.tsx":
/*!***********************!*\
  !*** ./src/index.tsx ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _interopRequireDefault = __webpack_require__(/*! /Users/dw.kim/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../node_modules/@babel/runtime/helpers/interopRequireDefault.js");

var _interopRequireWildcard = __webpack_require__(/*! /Users/dw.kim/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireWildcard */ "../../node_modules/@babel/runtime/helpers/interopRequireWildcard.js");

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _reactDom = _interopRequireDefault(__webpack_require__(/*! react-dom */ "../../node_modules/react-dom/index.js"));

var _app = __webpack_require__(/*! ./app */ "./src/app.tsx");

var serviceWorker = _interopRequireWildcard(__webpack_require__(/*! ./service-worker */ "./src/service-worker.ts"));

__webpack_require__(/*! ./styles */ "./src/styles.ts");

var _jsxFileName = "/Users/dw.kim/Synced/qmit/moleculer-iam/pkg/moleculer-iam-interaction-renderer/src/index.tsx";

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

var _interopRequireDefault = __webpack_require__(/*! /Users/dw.kim/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Navigator = exports.routeConfig = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _stack = __webpack_require__(/*! @react-navigation/stack */ "../../node_modules/@react-navigation/stack/lib/module/index.js");

var _interaction = __webpack_require__(/*! ./screen/interaction */ "./src/screen/interaction.tsx");

var _error = __webpack_require__(/*! ./screen/error */ "./src/screen/error.tsx");

var _jsxFileName = "/Users/dw.kim/Synced/qmit/moleculer-iam/pkg/moleculer-iam-interaction-renderer/src/navigator.tsx";
var routeConfig = {
  Interaction: "interaction/:name",
  Error: ":all"
};
exports.routeConfig = routeConfig;
var Stack = (0, _stack.createStackNavigator)();

var Navigator = function Navigator() {
  return _react.default.createElement(Stack.Navigator, {
    screenOptions: {
      headerShown: false,
      cardStyle: {
        backgroundColor: "#ffffff"
      }
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 16
    },
    __self: this
  }, _react.default.createElement(Stack.Screen, {
    name: "Interaction",
    component: _interaction.InteractionScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 24
    },
    __self: this
  }), _react.default.createElement(Stack.Screen, {
    name: "Error",
    component: _error.ErrorScreen,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 28
    },
    __self: this
  }));
};

exports.Navigator = Navigator;

/***/ }),

/***/ "./src/screen/error.tsx":
/*!******************************!*\
  !*** ./src/screen/error.tsx ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _interopRequireDefault = __webpack_require__(/*! /Users/dw.kim/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ErrorScreen = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _layout = __webpack_require__(/*! ./layout */ "./src/screen/layout.tsx");

var _hook = __webpack_require__(/*! ../hook */ "./src/hook.ts");

var _jsxFileName = "/Users/dw.kim/Synced/qmit/moleculer-iam/pkg/moleculer-iam-interaction-renderer/src/screen/error.tsx";

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
    error: closed ? "Cannot close the window, you can close the browser manually." : undefined,
    buttons: [{
      primary: false,
      text: "Close",
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

/***/ "./src/screen/interaction.tsx":
/*!************************************!*\
  !*** ./src/screen/interaction.tsx ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _interopRequireDefault = __webpack_require__(/*! /Users/dw.kim/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InteractionScreen = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _layout = __webpack_require__(/*! ./layout */ "./src/screen/layout.tsx");

var _jsxFileName = "/Users/dw.kim/Synced/qmit/moleculer-iam/pkg/moleculer-iam-interaction-renderer/src/screen/interaction.tsx";

var InteractionScreen = function InteractionScreen() {
  return _react.default.createElement(_layout.ScreenLayout, {
    title: "Interaction",
    subtitle: "hello",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    },
    __self: this
  }, "hello~");
};

exports.InteractionScreen = InteractionScreen;

/***/ }),

/***/ "./src/screen/layout.tsx":
/*!*******************************!*\
  !*** ./src/screen/layout.tsx ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _interopRequireDefault = __webpack_require__(/*! /Users/dw.kim/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../node_modules/@babel/runtime/helpers/interopRequireDefault.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScreenLayout = void 0;

var _react = _interopRequireDefault(__webpack_require__(/*! react */ "../../node_modules/react/index.js"));

var _reactNative = __webpack_require__(/*! react-native */ "../../node_modules/react-native-web/dist/index.js");

var _styles = __webpack_require__(/*! ../styles */ "./src/styles.ts");

var _logo = _interopRequireDefault(__webpack_require__(/*! ../image/logo.svg */ "./src/image/logo.svg"));

var _jsxFileName = "/Users/dw.kim/Synced/qmit/moleculer-iam/pkg/moleculer-iam-interaction-renderer/src/screen/layout.tsx";

var ScreenLayout = function ScreenLayout(props) {
  var title = props.title,
      subtitle = props.subtitle,
      children = props.children,
      buttons = props.buttons,
      error = props.error,
      footer = props.footer;
  return _react.default.createElement(_reactNative.ScrollView, {
    contentContainerStyle: {
      marginTop: "auto",
      marginBottom: "auto"
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 23
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
      lineNumber: 24
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
      lineNumber: 36
    },
    __self: this
  }), _react.default.createElement(_styles.Stack, {
    tokens: {
      childrenGap: 5
    },
    __source: {
      fileName: _jsxFileName,
      lineNumber: 38
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
      lineNumber: 39
    },
    __self: this
  }), subtitle ? _react.default.createElement(_styles.Text, {
    variant: "large",
    children: subtitle,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 44
    },
    __self: this
  }) : null), children ? _react.default.createElement(_styles.Stack, {
    tokens: {
      childrenGap: 15
    },
    children: children,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 47
    },
    __self: this
  }) : null, buttons.length > 0 || footer ? _react.default.createElement(_styles.Stack, {
    tokens: {
      childrenGap: 15
    },
    verticalAlign: "end",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 49
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
      lineNumber: 50
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
      onClick: onClick,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 53
      },
      __self: this
    });
  }), footer) : null));
};

exports.ScreenLayout = ScreenLayout;

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

var _interopRequireDefault = __webpack_require__(/*! /Users/dw.kim/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/interopRequireDefault */ "../../node_modules/@babel/runtime/helpers/interopRequireDefault.js");

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

var _objectSpread2 = _interopRequireDefault(__webpack_require__(/*! /Users/dw.kim/Synced/qmit/moleculer-iam/node_modules/@babel/runtime/helpers/esm/objectSpread2 */ "../../node_modules/@babel/runtime/helpers/esm/objectSpread2.js"));

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
/*!*****************************************************************************************************************************************************!*\
  !*** multi (webpack)/hot/dev-server.js /Users/dw.kim/Synced/qmit/moleculer-iam/node_modules/react-dev-utils/webpackHotDevClient.js ./src/index.tsx ***!
  \*****************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! /Users/dw.kim/Synced/qmit/moleculer-iam/node_modules/webpack/hot/dev-server.js */"../../node_modules/webpack/hot/dev-server.js");
__webpack_require__(/*! /Users/dw.kim/Synced/qmit/moleculer-iam/node_modules/react-dev-utils/webpackHotDevClient.js */"../../node_modules/react-dev-utils/webpackHotDevClient.js");
module.exports = __webpack_require__(/*! /Users/dw.kim/Synced/qmit/moleculer-iam/pkg/moleculer-iam-interaction-renderer/src/index.tsx */"./src/index.tsx");


/***/ })

},[[1,"runtime-main",1]]]);
//# sourceMappingURL=main.chunk.js.map