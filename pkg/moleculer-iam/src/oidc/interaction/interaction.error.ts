import { InteractionMiddleware } from "./interaction";

// normalize error and set status
export const useErrorMiddleware: InteractionMiddleware = ({ render, router, logger, devModeEnabled }) => {
  router.use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      logger.error("interaction error", err);
      const { error, name, message, status, statusCode, code, status_code, error_description, expose, ...otherProps } = err;
      ctx.status = status || statusCode || code || status_code || 500;
      if (isNaN(ctx.status)) ctx.status = 500;

      const normalizedError = {
        error: error || name,
        error_description: error_description || message || "Unexpected error.",
        ...((expose || devModeEnabled) ? otherProps : {}),
      };

      if (!normalizedError.error || normalizedError.error === "InternalServerError") {
        normalizedError.error = "internal_server_error";
      }

      return render(ctx, { error: normalizedError });
    }
  });
};
