import { StatusCodes } from "http-status-codes";
import { ApplicationError } from "./ApplicationError";

/**
 * When a constraint is violated in the database.
 */
export class ConstraintError extends ApplicationError {
  constructor(apiMessage: string, constraintName: string, obj?: object) {
    super({
      apiMessage,
      logMessage: `Constraint '${constraintName}' violated${obj ? ` on ${JSON.stringify(obj)}.` : "."}`,
      httpStatusCode: StatusCodes.BAD_REQUEST,
    });
  }
}
