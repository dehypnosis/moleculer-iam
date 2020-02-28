import * as _ from "lodash";
import { InteractionRenderState } from "moleculer-iam";
import { IPartialTheme } from "office-ui-fabric-react/lib";

export type ServerState = InteractionRenderState & { options: ServerOptions };
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
};

// used only from browser
let cachedServerState: any;
const __EMPTY_SERVER_STATE__ = {
  error: {
    error: "unexpected_error",
    error_description: "unrecognized state received from server",
  },
};
export const getServerState = (): ServerState => {
  if (typeof window === "undefined") {
    throw new Error("cannot call getServerState from server-side");
  } else {
    if (cachedServerState) return cachedServerState;
    return cachedServerState = _.defaultsDeep((window as any).__SERVER_STATE__ || __EMPTY_SERVER_STATE__, {
      options: defaultServerOptions,
    } as ServerState);
  }
};
