import { KoaContextWithOIDC } from "../provider";
import { RouterContext } from "koa-router";
export interface InteractionRenderProps {
    interaction?: {
        name: string;
        url: string;
        action?: {
            [key: string]: {
                url: string;
                method: "POST" | "GET";
                data?: any;
            };
        };
        data?: any;
    };
    error?: {
        error?: string;
        error_description?: string;
    };
}
export declare type InteractionRenderer = (ctx: KoaContextWithOIDC | RouterContext, props: InteractionRenderProps) => void;
