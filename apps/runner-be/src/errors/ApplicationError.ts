import { StatusCodes } from "http-status-codes";

export abstract class ApplicationError extends Error {
  constructor(
    public logMessage: string,
    public apiMessage: string,
    public httpStatusCode: StatusCodes = StatusCodes.INTERNAL_SERVER_ERROR,
  ) {
    super(logMessage);
    this.name = this.constructor.name;
  }
}
