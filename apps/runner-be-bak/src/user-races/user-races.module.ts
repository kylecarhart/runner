import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RacesModule } from "src/races/races.module";
import { UsersModule } from "src/users/users.module";
import { UserRace } from "./entities/user-race.entity";
import { UserRacesController } from "./user-races.controller";
import { UserRacesService } from "./user-races.service";

@Module({
  imports: [TypeOrmModule.forFeature([UserRace]), UsersModule, RacesModule],
  controllers: [UserRacesController],
  providers: [UserRacesService],
})
export class UserRacesModule {}
