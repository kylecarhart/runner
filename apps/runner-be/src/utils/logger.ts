import winston from "winston";
import { Env } from "./env";

const { combine, timestamp, printf, colorize, json } = winston.format;

const customFormat = printf(({ level, message, timestamp, ...meta }) => {
  return `${timestamp} ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ""}`;
});

export const logger = winston.createLogger({
  level: Env.LOG_LEVEL,
  format: json(),
  transports: [
    // Your file transports can remain here if needed
  ],
});

// Console logger
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: combine(colorize({ all: true }), timestamp(), customFormat),
    }),
  );
}
