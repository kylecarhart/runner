import { ZodError, ZodIssue } from "zod";

export class ZodResponseError extends ZodError {
  constructor(issues: ZodIssue[]) {
    super(issues);
  }
}
