import { ApplicationState } from "moleculer-iam";
import { ApplicationThemePalette } from "./theme";

export type ApplicationOptions = {
  logo: {
    uri: string | null;
    align: "center" | "flex-start" | "flex-end";
    height: string;
    width: string;
  },
  login: {
    federationOptionsVisible: boolean;
  },
  register: {
    skipDetailClaims: boolean;
    skipPhoneVerification: boolean;
    skipEmailVerification: boolean;
  },
  theme: string;
  palette: {
    [theme: string]: ApplicationThemePalette;
  };
};

// parse app options from html document
export function getAppOptions(): Partial<ApplicationOptions> {
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
      error_description: "Unrecognized state received from server.",
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
