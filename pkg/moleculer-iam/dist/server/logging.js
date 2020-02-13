"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const kleur = tslib_1.__importStar(require("kleur"));
const _ = tslib_1.__importStar(require("lodash"));
const koa_morgan_1 = tslib_1.__importDefault(require("koa-morgan"));
koa_morgan_1.default.token("ip", req => {
    const forwarded = req.headers && req.headers["x-forwarded-for"];
    if (forwarded) {
        if (typeof forwarded === "string") {
            return forwarded;
        }
        return forwarded[0];
    }
    return req.connection && req.connection.remoteAddress || "-";
});
koa_morgan_1.default.token("statusMessage", (req, res) => {
    return res.statusMessage || "-";
});
function logging(logger, opts) {
    const _a = _.defaultsDeep(opts || {}, {
        format: `:method :url HTTP/:http-version - :status :statusMessage :res[content-length] byte :response-time ms - ${kleur.dim(`":ip" ":referrer" ":user-agent"`)}`,
        level: "info",
    }), { format, level } = _a, options = tslib_1.__rest(_a, ["format", "level"]);
    const write = (logger[level] || logger.info).bind(logger);
    return koa_morgan_1.default(format, Object.assign(Object.assign({}, options), { stream: {
            write,
        } }));
}
exports.logging = logging;
//# sourceMappingURL=logging.js.map