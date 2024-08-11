import { ApiProperty } from "@nestjs/swagger";
import { Length } from "class-validator";
import { Base } from "src/database/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class Race extends Base {
  @Column()
  @ApiProperty({ example: "The Big One" })
  @Length(1, 64)
  name: string;

  @Column()
  @ApiProperty({ example: "2021-10-31T00:00:00Z" })
  date: Date;
}
