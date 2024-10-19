import { StatusCodes } from "http-status-codes";
import { ApplicationError } from "./ApplicationError.ts";

/**
 * When a user fails to authenticate, supplies an incorrect password
 */
export class AuthenticationError extends ApplicationError {
  constructor(logMessage?: string) {
    super({
      apiMessage: "Authentication failed.",
      httpStatusCode: StatusCodes.UNAUTHORIZED,
      logMessage,
      code: "AUTHENTICATION_ERROR", // TODO: Come back and put these codes somewhere together
    });
  }
}
