import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";
import { ApplicationError } from "./ApplicationError";

/**
 * If the response body to be returned to the client does not match the expected
 * schema, this error will be thrown.
 */
export class ResponseValidationError extends ApplicationError {
  constructor(err: ZodError) {
    super({
      apiMessage: "An unknown error has occurred. Please try again.",
      logMessage: `Error parsing response body: ${JSON.stringify(err.flatten())}. Check the response body and try again.`,
      httpStatusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      code: "RESPONSE_VALIDATION_ERROR", // TODO: Come back and put these codes somewhere together
    });
  }
}
