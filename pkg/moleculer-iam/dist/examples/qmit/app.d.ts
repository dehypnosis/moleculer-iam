/// <reference types="koa-bodyparser" />
/// <reference types="koa-passport" />
import Router from "koa-router";
import { OIDCProvider } from "../../op";
export declare const app: (op: OIDCProvider) => Promise<import("koa-compose").Middleware<import("koa").ParameterizedContext<any, Router.IRouterParamContext<any, {}>>>>;
