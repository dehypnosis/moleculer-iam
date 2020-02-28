import { InteractionRenderState } from "moleculer-iam";
import { IPartialTheme } from "office-ui-fabric-react/lib";
export declare type ServerState = InteractionRenderState & {
    options: ServerOptions;
};
export declare type ServerOptions = {
    logo: {
        uri: string | null;
        align: "center" | "left" | "right";
    };
    login: {
        federation_options_visible: boolean;
    };
    theme?: IPartialTheme;
};
export declare const getServerState: () => ServerState;
