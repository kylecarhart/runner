import { ApiProperty } from "@nestjs/swagger";
import { Length } from "class-validator";
import { Base } from "src/database/base.entity";
import { Race } from "src/races/entities/race.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity()
export class Event extends Base {
  @Column()
  @ApiProperty({ example: "The Big One" })
  @Length(1, 64)
  name: string;

  @Column()
  @ApiProperty({ example: "2021-10-15T00:00:00Z" })
  startDate: Date;

  @Column({ nullable: true })
  @ApiProperty({ example: "2021-10-16T00:00:00Z" })
  endDate?: Date;

  @OneToMany(() => Race, (race) => race.event)
  races: Race[];
}
