import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, Length } from "class-validator";
import { Base } from "src/database/base.entity";
import { Column, Entity } from "typeorm";
import { UserPassword } from "./user-password.decorator";

@Entity()
export class User extends Base {
  @Column()
  @ApiProperty({ example: "Kyle" })
  @Length(1, 64)
  firstName: string;

  @Column()
  @ApiProperty({ example: "Carhart" })
  @Length(1, 64)
  lastName: string;

  @Column({ unique: true })
  @ApiProperty({ example: "kcarhart" })
  @Length(3, 20)
  username: string;

  @Column({ unique: true })
  @ApiProperty({ example: "kcarhart@example.com" })
  @IsEmail()
  email: string;

  @Column({ select: false })
  @ApiProperty({ example: "Password1!" })
  @UserPassword()
  password: string;
}

export type UserWithoutPassword = Omit<User, "password">;
