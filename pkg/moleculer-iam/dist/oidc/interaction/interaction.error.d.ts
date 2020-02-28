import { InteractionMiddleware } from "./interaction";
export declare const useErrorMiddleware: InteractionMiddleware;
export declare function normalizeError(err: any, devModeEnabled: boolean): {
    error: any;
    status: any;
};
