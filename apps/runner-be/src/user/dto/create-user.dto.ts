import { ApiProperty, OmitType } from "@nestjs/swagger";
import { UserPassword } from "../decorators/user-password.decorator";
import { User } from "../entities/user.entity";

export class CreateUserDto extends OmitType(User, ["id"] as const) {
  @UserPassword()
  @ApiProperty({ example: "Password1!" })
  confirmPassword: string;
}
