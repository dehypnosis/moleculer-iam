import * as _ from "lodash";
import { ApplicationState } from "moleculer-iam";
import { IPartialTheme } from "office-ui-fabric-react/lib";

export type ApplicationOptions = {
  logo: {
    uri: string | null,
    align: "center" | "left" | "right",
  },
  login: {
    federationOptionsVisibleDefault: boolean,
  },
  theme?: IPartialTheme;
};

// parse app options from html document
export function getAppOptions(): ApplicationOptions {
  if (typeof window === "undefined") {
    throw new Error("cannot call getAppOptions from server-side");
  }
  return (window as any).__APP_OPTIONS__ || {};
}

// parse initial app state from html document
export function getInitialAppState(): ApplicationState {
  if (typeof window === "undefined") {
    throw new Error("cannot call getInitialAppState from server-side");
  }
  return ((window as any).__APP_STATE__ || {
    name: "error",
    error: {
      error: "unexpected_error",
      error_description: "unrecognized state received from server",
    },
  }) as ApplicationState;
}

export function getAppPrefix() {
  if (typeof window === "undefined") {
    throw new Error("cannot call getAppPrefix from server-side");
  }
  return (window as any).__APP_PREFIX__ || "/op";
}

export function getAppDev() {
  if (typeof window === "undefined") {
    throw new Error("cannot call getAppDev from server-side");
  }
  return (window as any).__APP_DEV__ !== false;
}
