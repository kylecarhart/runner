import type { ErrorResponse } from "@runner/schemas/response";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { StatusCodes } from "http-status-codes";

/**
 * Parameters for creating an application error
 */
interface ApplicationErrorParams {
  /** Message to be returned to the client */
  apiMessage: string;
  /** Message to be logged, defaults to `apiMessage` */
  logMessage?: string;
  /** HTTP status code */
  httpStatusCode?: ContentfulStatusCode;
  /** Application specific error code */
  code: string;
  /** Additional data related to the error */
  data?: unknown;
}

/**
 * Base class for all application errors
 */
export abstract class ApplicationError extends Error {
  apiMessage: string;
  logMessage: string;
  code: string;
  httpStatusCode: ContentfulStatusCode;
  data: unknown;

  constructor({
    apiMessage,
    logMessage,
    httpStatusCode,
    code,
    data,
  }: ApplicationErrorParams) {
    super(logMessage);
    this.name = this.constructor.name;
    this.apiMessage = apiMessage;
    this.logMessage = logMessage ?? apiMessage;
    this.httpStatusCode = httpStatusCode ?? StatusCodes.INTERNAL_SERVER_ERROR;
    this.code = code;
    this.data = data;
  }

  /**
   * Get the error response body based on the error.
   * @returns Error response
   */
  getResponseBody(): ErrorResponse {
    return {
      success: false,
      message: this.apiMessage,
      code: this.code,
      data: this.data,
    };
  }
}
