import { UserInteractionConfiguration } from "../index";
import { renderInternalFlow } from "./render";

// render interaction errors
export const renderError: UserInteractionConfiguration["renderError"] = (ctx, out, error) => {
  // @ts-ignore
  ctx.status = error.status || error.statusCode || 500;

  // @ts-ignore
  if (!error.expose) {
    (ctx.logger || console).error(error);
  }

  renderInternalFlow(ctx, {
    error: out,
  });
};
