import Router from "koa-router";
import { IdentityProvider } from "../../identity";
import { Provider } from "../provider";
export declare const createInteractionRouter: (provider: Provider, idp: IdentityProvider) => Router<any, {}>;
