import { ApiProperty, OmitType } from "@nestjs/swagger";
import { UserPassword } from "./user-password.decorator";
import { User } from "./user.entity";

export class CreateUserDto extends OmitType(User, ["id"] as const) {
  @UserPassword()
  @ApiProperty({ example: "Password1!" })
  confirmPassword: string;
}
