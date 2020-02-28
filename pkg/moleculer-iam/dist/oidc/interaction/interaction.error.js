"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// normalize error and set status
exports.useErrorMiddleware = ({ render, router, logger, devModeEnabled }) => {
    router.use(async (ctx, next) => {
        try {
            await next();
        }
        catch (err) {
            logger.error("interaction error", err);
            const { status, error } = normalizeError(err, devModeEnabled);
            ctx.status = status;
            return render(ctx, { error });
        }
    });
};
function normalizeError(err, devModeEnabled) {
    const { error, name, message, status, statusCode, code, status_code, error_description, expose, ...otherProps } = err;
    let normalizedStatus = status || statusCode || code || status_code || 500;
    if (isNaN(normalizedStatus))
        normalizedStatus = 500;
    const e = {
        error: error || name,
        error_description: error_description || message || "Unexpected error.",
        ...((expose || devModeEnabled) ? otherProps : {}),
    };
    if (!e.error || e.error === "InternalServerError") {
        e.error = "internal_server_error";
    }
    return { error: e, status };
}
exports.normalizeError = normalizeError;
//# sourceMappingURL=interaction.error.js.map