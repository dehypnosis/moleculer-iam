import { ApplicationState } from "moleculer-iam";
import { ApplicationThemePalette } from "./theme";
export declare type ApplicationOptions = {
    logo: {
        uri: string | null;
        align: "center" | "left" | "right";
    };
    login: {
        federationOptionsVisibleDefault: boolean;
    };
    theme: string;
    palette: {
        [theme: string]: ApplicationThemePalette;
    };
};
export declare function getAppOptions(): Partial<ApplicationOptions>;
export declare function getInitialAppState(): ApplicationState;
export declare function getAppPrefix(): any;
export declare function getAppDev(): boolean;
