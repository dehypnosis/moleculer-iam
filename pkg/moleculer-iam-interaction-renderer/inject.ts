import * as _ from "lodash";
import { InteractionRenderState } from "moleculer-iam";
import { IPartialTheme } from "office-ui-fabric-react/lib";

export type Inject = InteractionRenderState;
export type ServerOptions = {
  logo: {
    uri: string | null,
    align: "center" | "left" | "right",
  },
  login: {
    federation_options_visible: boolean,
  },
  theme?: IPartialTheme;
};

const defaultServerOptions: ServerOptions = {
  logo: {
    uri: null,
    align: "left",
  },
  login: {
    federation_options_visible: false,
  },
  // default theme is on ./src/styles.ts
};

export const getServerState = (): Inject => {
  if (typeof window === "undefined") {
    throw new Error("cannot call getServerState from server-side");
  } else {
    return (window as any).__SERVER_STATE__ || {
      error: {
        error: "unexpected_error",
        error_description: "unrecognized state received from server",
      },
    };
  }
};

let cachedServerOptions: ServerOptions;
export const getServerOptions = (): ServerOptions => {
  if (typeof window === "undefined") {
    throw new Error("cannot call getServerState from server-side");
  } else {
    return cachedServerOptions || (cachedServerOptions = _.defaultsDeep((window as any).__SERVER_OPTIONS__, defaultServerOptions));
  }
};
