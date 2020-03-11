import { ApplicationState } from "moleculer-iam";
import { ApplicationOptions } from "./common";

// parse app options from html document
export function getAppOptions(): Partial<ApplicationOptions> {
  return (window as any).__APP_OPTIONS__ || {};
}

// parse initial app state from html document
export function getInitialAppState(): ApplicationState {
  return ((window as any).__APP_STATE__ || {
    name: "error",
    error: {
      error: "UnexpectedError",
      error_description: "Unexpected Error.",
    },
    session: {},
    locale: {
      language: "ko",
      country: "KR",
    },
  }) as ApplicationState;
}

export function getAppPrefix() {
  return (window as any).__APP_PREFIX__ || "/op";
}

export function getAppDev() {
  return (window as any).__APP_DEV__ !== false;
}
