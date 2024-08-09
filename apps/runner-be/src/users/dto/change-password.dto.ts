import { ApiProperty } from "@nestjs/swagger";
import { UserPassword } from "../decorators/user-password.decorator";

export class ChangePasswordDto {
  @ApiProperty({ example: "Password1!" })
  @UserPassword()
  oldPassword: string;

  @ApiProperty({ example: "Password2!" })
  @UserPassword()
  password: string;

  @ApiProperty({ example: "Password2!" })
  @UserPassword()
  confirmPassword: string;
}
