import { ApplicationState } from "moleculer-iam";
import { IPartialTheme } from "office-ui-fabric-react/lib";
export declare type ApplicationOptions = {
    logo: {
        uri: string | null;
        align: "center" | "left" | "right";
    };
    login: {
        federationOptionsVisibleDefault: boolean;
    };
    theme?: IPartialTheme;
};
export declare function getAppOptions(): ApplicationOptions;
export declare function getInitialAppState(): ApplicationState;
export declare function getAppPrefix(): any;
export declare function getAppDev(): boolean;
