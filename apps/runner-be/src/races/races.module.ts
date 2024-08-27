import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/users/entities/user.entity";
import { Race } from "./entities/race.entity";
import { RacesController } from "./races.controller";
import { RacesService } from "./races.service";

@Module({
  imports: [TypeOrmModule.forFeature([Race, User])],
  controllers: [RacesController],
  providers: [RacesService],
  exports: [RacesService],
})
export class RacesModule {}
