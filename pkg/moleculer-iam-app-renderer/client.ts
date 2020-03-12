import { ApplicationState } from "moleculer-iam";
import { ApplicationOptions } from "./common";

// parse app options from html document
export function getAppOptions(): Partial<ApplicationOptions> {
  return (window as any).__APP_OPTIONS__ || {};
}

// parse initial app state from html document
export function getAppState(): ApplicationState {
  return ((window as any).__APP_STATE__ || {
    name: "error",
    error: {
      error: "Unexpected Error",
      error_description: "Cannot read application state.",
    },
    session: {},
    locale: {
      language: "ko",
      country: "KR",
    },
    metadata: {},
  });
}

export function getAppPrefix() {
  return (window as any).__APP_PREFIX__ || "/op";
}

export function getAppDev() {
  return (window as any).__APP_DEV__ !== false;
}
