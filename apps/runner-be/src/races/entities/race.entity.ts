import { ApiProperty } from "@nestjs/swagger";
import { Length } from "class-validator";
import { Base } from "src/database/base.entity";
import { Event } from "src/events/entities/event.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class Race extends Base {
  @Column()
  @ApiProperty({ example: "The Big 5K" })
  @Length(1, 64)
  name: string;

  @Column()
  @ApiProperty({ example: "5K" })
  type: string;

  @Column()
  @ApiProperty({ example: "2021-10-31T00:00:00Z" })
  date: Date;

  @ManyToOne(() => Event, (event) => event.races)
  event: Event;
}
