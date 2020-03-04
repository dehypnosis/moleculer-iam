import * as _ from "lodash";
import { InteractionState } from "moleculer-iam";
import { IPartialTheme } from "office-ui-fabric-react/lib";

export type AppOptions = {
  dev: boolean;
  prefix: string;
  logo: {
    uri: string | null,
    align: "center" | "left" | "right",
  },
  login: {
    federation_options_visible: boolean,
  },
  theme?: IPartialTheme;
};

// parse app options from html document
let cachedAppOptions: AppOptions;
export function getAppOptions(): AppOptions {
  if (cachedAppOptions) {
    return cachedAppOptions;
  }
  if (typeof window === "undefined") {
    throw new Error("cannot call getAppOptions from server-side");
  } else {
    return cachedAppOptions = _.defaultsDeep((window as any).__APP_OPTIONS__ || {}, {
      prefix: "/op",
      logo: {
        uri: null,
        align: "left",
      },
      login: {
        federation_options_visible: false,
      },
      // default theme is on ./src/styles.ts
    } as AppOptions);
  }
}

// parse initial app state from html document
export function getInitialAppState(): InteractionState {
  if (typeof window === "undefined") {
    throw new Error("cannot call getInitialAppState from server-side");
  } else {
    return ((window as any).__APP_STATE__ || {
      name: "error",
      error: {
        error: "unexpected_error",
        error_description: "unrecognized state received from server",
      },
    }) as InteractionState;
  }
}
