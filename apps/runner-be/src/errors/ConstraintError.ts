import { StatusCodes } from "http-status-codes";
import { ApplicationError } from "./ApplicationError.ts";

/**
 * When a constraint is violated in the database.
 */
export class ConstraintError extends ApplicationError {
  constructor(apiMessage: string, constraintName: string, obj?: object) {
    super({
      apiMessage,
      logMessage: `Constraint '${constraintName}' violated${
        obj ? ` on ${JSON.stringify(obj)}.` : "."
      }`,
      httpStatusCode: StatusCodes.BAD_REQUEST,
      code: "CONSTRAINT_ERROR", // TODO: Come back and put these codes somewhere together
    });
  }
}
