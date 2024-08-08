import { ApiProperty, OmitType } from "@nestjs/swagger";
import { Length } from "class-validator";
import { User } from "./user.entity";

export class CreateUserDto extends OmitType(User, ["id"] as const) {
  @Length(8, 64)
  @ApiProperty({ example: "password" })
  confirmPassword: string;
}
