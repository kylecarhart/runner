import { applyDecorators } from "@nestjs/common";
import { IsStrongPassword } from "class-validator";

export function UserPassword() {
  return applyDecorators(
    IsStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
    }),
  );
}
