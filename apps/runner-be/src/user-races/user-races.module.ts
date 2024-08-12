import { Module } from "@nestjs/common";
import { UserRacesController } from "./user-races.controller";
import { UserRacesService } from "./user-races.service";

@Module({
  controllers: [UserRacesController],
  providers: [UserRacesService],
})
export class UserRacesModule {}
