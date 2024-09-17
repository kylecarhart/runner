import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsOptional, Length } from "class-validator";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { Base } from "src/database/base.entity";
import { Race } from "src/races/entities/race.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity()
export class Event extends Base {
  @Column()
  @ApiProperty({ example: "The Big One" })
  @Length(1, 64)
  name: string;

  @Column({ type: "timestamptz" })
  @ApiProperty({ example: "2021-10-15T00:00:00Z" })
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @Column({ nullable: true, type: "timestamptz" })
  @ApiProperty({ example: "2021-10-16T00:00:00Z" })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  endDate?: Date;

  @OneToMany(() => Race, (race) => race.event, { eager: true })
  races: Race[];
}

export const event = pgTable("event", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  createdDate: timestamp("createdDate", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedDate: timestamp("updatedDate", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  name: text("name").notNull(),
  startDate: timestamp("startDate", {
    withTimezone: true,
    mode: "string",
  }).notNull(),
  endDate: timestamp("endDate", { withTimezone: true, mode: "string" }),
});
