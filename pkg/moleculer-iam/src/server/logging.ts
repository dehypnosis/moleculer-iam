import * as kleur from "kleur";
import * as _ from "lodash";
import morgan from "koa-morgan";
import { Logger, LogLevel } from "../lib/logger";

export type LoggingOptions = {
  format?: morgan.FormatFn | string,
  level?: LogLevel,
} & Omit<morgan.Options, "stream">;

morgan.token("ip", req => {
  const forwarded = req.headers && req.headers["x-forwarded-for"];
  if (forwarded) {
    if (typeof forwarded === "string") {
      return forwarded;
    }
    return forwarded[0];
  }
  return req.connection && req.connection.remoteAddress || "-";
});

morgan.token("statusMessage", (req, res) => {
  return res.statusMessage || "-";
});

export function logging(logger: Logger, opts?: LoggingOptions) {
  const { format, level, ...options }: LoggingOptions = _.defaultsDeep(opts || {}, {
    format: `:method :url HTTP/:http-version - :status :statusMessage :res[content-length] byte :response-time ms - ${kleur.dim(`":ip" ":referrer" ":user-agent"`)}`,
    level: "info",
  });
  const write = (logger[level as LogLevel] || logger.info).bind(logger);
  return morgan(format as string, {
    ...options,
    stream: {
      write,
    },
  });
}
