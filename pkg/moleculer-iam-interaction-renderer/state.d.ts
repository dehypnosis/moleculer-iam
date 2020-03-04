import { InteractionState } from "moleculer-iam";
import { IPartialTheme } from "office-ui-fabric-react/lib";
export declare type AppOptions = {
    dev: boolean;
    prefix: string;
    logo: {
        uri: string | null;
        align: "center" | "left" | "right";
    };
    login: {
        federation_options_visible: boolean;
    };
    theme?: IPartialTheme;
};
export declare function getAppOptions(): AppOptions;
export declare function getInitialAppState(): InteractionState;
