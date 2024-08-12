import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, Length } from "class-validator";
import { Base } from "src/database/base.entity";
import { UserRace } from "src/user-races/entities/user-race.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { UserPassword } from "../decorators/user-password.decorator";

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

  @OneToMany(() => UserRace, (userRace) => userRace.user)
  public userRaces: UserRace[];
}

export type UserWithoutPassword = Omit<User, "password">;
