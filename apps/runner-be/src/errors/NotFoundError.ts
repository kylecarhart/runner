import { StatusCodes } from "http-status-codes";
import { ApplicationError } from "./ApplicationError";

/**
 * When a resource is not found in the database.
 */
export class NotFoundError extends ApplicationError {
  constructor(name: string, model: { id: string; [key: string]: unknown }) {
    super({
      apiMessage: `${name} with id ${model.id} not found`,
      httpStatusCode: StatusCodes.NOT_FOUND,
    });
  }
}
