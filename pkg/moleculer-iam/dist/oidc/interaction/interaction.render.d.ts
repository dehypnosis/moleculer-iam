import { KoaContextWithOIDC } from "oidc-provider";
import { RouterContext } from "koa-router";
export interface InteractionRenderProps {
    interaction?: {
        name: string;
        action?: {
            [key: string]: {
                url: string;
                method: "POST" | "GET";
                data?: any;
                urlencoded?: boolean;
            };
        };
        data?: any;
        [key: string]: any;
    };
    error?: {
        error?: string;
        error_description?: string;
        [key: string]: any;
    };
}
export declare type InteractionRenderer = (ctx: KoaContextWithOIDC | RouterContext, props: InteractionRenderProps) => void;
export declare const defaultInteractionRenderer: InteractionRenderer;
