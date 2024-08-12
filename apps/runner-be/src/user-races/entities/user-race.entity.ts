import { Base } from "src/database/base.entity";
import { Race } from "src/races/entities/race.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class UserRace extends Base {
  @Column()
  userId: string;

  @Column()
  raceId: string;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Race)
  race: Race;
}
