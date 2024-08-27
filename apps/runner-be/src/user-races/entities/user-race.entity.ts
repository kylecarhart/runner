import { Base } from "src/database/base.entity";
import { Race } from "src/races/entities/race.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, Unique } from "typeorm";

@Entity()
@Unique(["userId", "raceId"])
export class UserRace extends Base {
  @Column()
  userId: string;

  @Column()
  raceId: string;

  // TODO: Should this be eager?
  @ManyToOne(() => User, { eager: true })
  user: User;

  // TODO: Should this be eager?
  @ManyToOne(() => Race, { eager: true })
  race: Race;
}
