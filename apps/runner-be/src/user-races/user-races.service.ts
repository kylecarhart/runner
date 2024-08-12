import { Injectable } from "@nestjs/common";
import { CreateUserRaceDto } from "./dto/create-user-race.dto";
import { UpdateUserRaceDto } from "./dto/update-user-race.dto";

@Injectable()
export class UserRacesService {
  create(createUserRaceDto: CreateUserRaceDto) {
    return "This action adds a new userRace";
  }

  findAll() {
    return `This action returns all userRaces`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userRace`;
  }

  update(id: number, updateUserRaceDto: UpdateUserRaceDto) {
    return `This action updates a #${id} userRace`;
  }

  remove(id: number) {
    return `This action removes a #${id} userRace`;
  }
}
