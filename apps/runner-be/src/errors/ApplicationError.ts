import { StatusCodes } from "http-status-codes";

interface ApplicationErrorParams {
  apiMessage: string;
  logMessage?: string;
  httpStatusCode?: StatusCodes;
}

/**
 * Base class for all application errors
 */
export abstract class ApplicationError extends Error {
  apiMessage: string;
  logMessage: string;
  httpStatusCode: StatusCodes;

  constructor({
    apiMessage,
    logMessage,
    httpStatusCode,
  }: ApplicationErrorParams) {
    super(logMessage);
    this.name = this.constructor.name;
    this.apiMessage = apiMessage;
    this.logMessage = logMessage ?? apiMessage;
    this.httpStatusCode = httpStatusCode ?? StatusCodes.INTERNAL_SERVER_ERROR;
  }
}
