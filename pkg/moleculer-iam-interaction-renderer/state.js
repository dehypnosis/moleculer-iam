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
// parse app options from html document
var cachedAppOptions;
function getAppOptions() {
    if (cachedAppOptions) {
        return cachedAppOptions;
    }
    if (typeof window === "undefined") {
        throw new Error("cannot call getAppOptions from server-side");
    }
    else {
        return cachedAppOptions = _.defaultsDeep(window.__APP_OPTIONS__ || {}, {
            prefix: "/op",
            logo: {
                uri: null,
                align: "left",
            },
            login: {
                federation_options_visible: false,
            },
        });
    }
}
exports.getAppOptions = getAppOptions;
// parse initial app state from html document
function getInitialAppState() {
    if (typeof window === "undefined") {
        throw new Error("cannot call getInitialAppState from server-side");
    }
    else {
        return (window.__APP_STATE__ || {
            name: "error",
            error: {
                error: "unexpected_error",
                error_description: "unrecognized state received from server",
            },
        });
    }
}
exports.getInitialAppState = getInitialAppState;
