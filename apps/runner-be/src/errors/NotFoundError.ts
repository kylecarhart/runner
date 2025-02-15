import { StatusCodes } from "http-status-codes";
import { ApplicationError } from "./ApplicationError.js";

/**
 * When a resource is not found in the database.
 */
export class NotFoundError extends ApplicationError {
  constructor(message: string) {
    super({
      apiMessage: message,
      httpStatusCode: StatusCodes.NOT_FOUND,
      code: "NOT_FOUND_ERROR", // TODO: Come back and put these codes somewhere together
    });
  }
}
