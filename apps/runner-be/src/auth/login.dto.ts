import { PickType } from "@nestjs/swagger";
import { User } from "src/user/entities/user.entity";

export class LoginDto extends PickType(User, [
  "username",
  "password",
] as const) {}
