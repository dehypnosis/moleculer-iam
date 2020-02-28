"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _ = __importStar(require("lodash"));
var defaultServerOptions = {
    logo: {
        uri: null,
        align: "left",
    },
    login: {
        federation_options_visible: false,
    },
};
// used only from browser
var cachedServerState;
var __EMPTY_SERVER_STATE__ = {
    error: {
        error: "unexpected_error",
        error_description: "unrecognized state received from server",
    },
};
exports.getServerState = function () {
    if (typeof window === "undefined") {
        throw new Error("cannot call getServerState from server-side");
    }
    else {
        if (cachedServerState)
            return cachedServerState;
        return cachedServerState = _.defaultsDeep(window.__SERVER_STATE__ || __EMPTY_SERVER_STATE__, {
            options: defaultServerOptions,
        });
    }
};
