import { InteractionRenderState } from "moleculer-iam";
import { IPartialTheme } from "office-ui-fabric-react/lib";
export declare type Inject = InteractionRenderState;
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
export declare const getServerState: () => InteractionRenderState;
export declare const getServerOptions: () => ServerOptions;
