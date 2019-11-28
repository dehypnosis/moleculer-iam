import * as _ from "lodash";
import { RouterContext } from "koa-router";

export type ClientApplicationContext = {
  interaction_id?: string;
  account_id?: string,
  client?: {
    client_id: string,
    [key: string]: any,
  },
  prompt: {
    name: string;
    details?: any;
    reasons?: string[];
  },
  params: any;
};

export type ClientApplicationProps = {
  context: ClientApplicationContext,
  action?: {
    [key in string]: {
      url: string;
      method: "POST" | "GET" | "DELETE";
      data: any;
    };
  };
  data?: any;
  error?: any;
};

const defaultProps = {
  action: {},
  data: {},
  error: null,
};

export const render = (ctx: RouterContext, props: ClientApplicationProps = {} as any) => {
  ctx.type = "json";
  const { context = {}, action = null, error = null } = props;
  ctx.body = _.defaultsDeep({
    context,
    action,
    error,
  }, defaultProps);
};
