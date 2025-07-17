import winston from "winston";

import { config } from "../config";

const levels = {
  debug: 3,
  error: 0,
  info: 2,
  warn: 1,
};

const colors = {
  debug: "blue",
  error: "red",
  info: "green",
  warn: "yellow",
};

winston.addColors(colors);

const logger = winston.createLogger({
  defaultMeta: { service: "server" },
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  level: config.LOG_LEVEL,
  levels,
  transports: [
    // Write all logs with importance level of `error` or less to `error.log`
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    // Write all logs with importance level of `info` or less to `combined.log`
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

// If we're not in production, log to the console with a simple format
if (config.isDevelopment) {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.simple(),
        winston.format.printf((info: winston.Logform.TransformableInfo) => {
          const { level, message, timestamp, ...meta } = info;
          return `${timestamp} [${level}]: ${message} ${
            Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ""
          }`;
        }),
      ),
    }),
  );
}

export default logger;
