"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// parse app options from html document
function getAppOptions() {
    if (typeof window === "undefined") {
        throw new Error("cannot call getAppOptions from server-side");
    }
    return window.__APP_OPTIONS__ || {};
}
exports.getAppOptions = getAppOptions;
// parse initial app state from html document
function getInitialAppState() {
    if (typeof window === "undefined") {
        throw new Error("cannot call getInitialAppState from server-side");
    }
    return (window.__APP_STATE__ || {
        name: "error",
        error: {
            error: "unexpected_error",
            error_description: "Unrecognized state received from server.",
        },
    });
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
