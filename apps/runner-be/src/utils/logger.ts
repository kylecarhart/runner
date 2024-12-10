import { getContext } from "hono/context-storage";
import { HonoEnv } from "../index.js";
import { Env, isDevelopment } from "./env.js";

type LogLevel = "trace" | "debug" | "info" | "warn" | "error" | "fatal";

/**
 * Represents log levels and their numeric values
 */
interface LogLevels {
  [key: string]: number;
}

const levels: LogLevels = {
  trace: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60,
};

/**
 * Configuration options for Logger instance
 */
interface LoggerOptions {
  level?: LogLevel;
  baseObject?: Record<string, unknown>;
  pretty?: boolean;
}

/**
 * Logger class for handling application logging
 */
export class Logger {
  private level: LogLevel;
  private baseObject: Record<string, unknown>;
  private pretty: boolean;

  constructor(options: LoggerOptions = {}) {
    this.level = options.level || "info";
    this.baseObject = options.baseObject || {};
    this.pretty = options.pretty || false;
  }

  /**
   * Formats log message for pretty printing
   * @param level - Log level
   * @param message - Log message
   * @param data - Additional data to log
   */
  private formatPretty(
    level: LogLevel,
    message: unknown,
    data: Record<string, unknown>,
  ): string {
    const time = new Date().toISOString();
    const levelPadded = level.toUpperCase();
    const dataStr = Object.keys(data).length
      ? `\n${JSON.stringify(data, null, 2)}`
      : "";

    return `${time} [${levelPadded}] ${message}${dataStr}`;
  }

  /**
   * Main logging method
   * @param level - Log level
   * @param message - Log message
   * @param data - Additional data to log
   */
  log(
    level: LogLevel,
    message: unknown,
    data: Record<string, unknown> = {},
  ): void {
    if (levels[level]! >= levels[this.level]!) {
      if (this.pretty) {
        console.log(
          this.formatPretty(level, message, { ...this.baseObject, ...data }),
        );
      } else {
        const logObject = {
          level,
          time: new Date().toISOString(),
          message,
          ...this.baseObject,
          ...data,
        };
        console.log(JSON.stringify(logObject));
      }
    }
  }

  /**
   * Creates child logger with additional base context
   * @param childObject - Additional context to add
   */
  child(childObject: Record<string, unknown>): Logger {
    return new Logger({
      level: this.level,
      baseObject: { ...this.baseObject, ...childObject },
      pretty: this.pretty,
    });
  }

  /**
   * Log at trace level
   * @param message - Log message
   * @param data - Additional data to log
   */
  trace(message: unknown, data?: Record<string, unknown>): void {
    this.log("trace", message, data);
  }

  /**
   * Log at debug level
   * @param message - Log message
   * @param data - Additional data to log
   */
  debug(message: unknown, data?: Record<string, unknown>): void {
    this.log("debug", message, data);
  }

  /**
   * Log at info level
   * @param message - Log message
   * @param data - Additional data to log
   */
  info(message: unknown, data?: Record<string, unknown>): void {
    this.log("info", message, data);
  }

  /**
   * Log at warn level
   * @param message - Log message
   * @param data - Additional data to log
   */
  warn(message: unknown, data?: Record<string, unknown>): void {
    this.log("warn", message, data);
  }

  /**
   * Log at error level
   * @param message - Log message
   * @param data - Additional data to log
   */
  error(message: unknown, data?: Record<string, unknown>): void {
    this.log("error", message, data);
  }

  /**
   * Log at fatal level
   * @param message - Log message
   * @param data - Additional data to log
   */
  fatal(message: unknown, data?: Record<string, unknown>): void {
    this.log("fatal", message, data);
  }
}

/**
 * Create a logger. This should only be used once in the app.
 * @param env - Environment variables
 * @returns Logger
 */
export function createLogger(env: Env): Logger {
  return new Logger({
    level: env.LOG_LEVEL,
    pretty: isDevelopment(),
  });
}

/**
 * Logger from context.
 * @returns Logger
 */
export const logger = () => getContext<HonoEnv>().var.logger;
