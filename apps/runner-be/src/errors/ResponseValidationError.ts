import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";
import { ApplicationError } from "./ApplicationError";

export class ResponseValidationError extends ApplicationError {
  constructor(err: ZodError) {
    super(
      `Error parsing response body: ${JSON.stringify(err.flatten())}. Check the response body and try again.`,
      "An unknown error has occurred. Please try again.",
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}
