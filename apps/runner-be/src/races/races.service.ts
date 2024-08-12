import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateRaceDto } from "./dto/create-race.dto";
import { UpdateRaceDto } from "./dto/update-race.dto";
import { Race } from "./entities/race.entity";

@Injectable()
export class RacesService {
  constructor(
    @InjectRepository(Race)
    private racesRepository: Repository<Race>,
  ) {}

  create(eventId: string, createRaceDto: CreateRaceDto) {
    return this.racesRepository.save({
      ...createRaceDto,
      event: { id: eventId },
    });
  }

  findAll() {
    return this.racesRepository.find();
  }

  findOne(id: string) {
    return `This action returns a #${id} race`;
  }

  update(id: string, updateRaceDto: UpdateRaceDto) {
    return `This action updates a #${id} race`;
  }

  remove(id: string) {
    return `This action removes a #${id} race`;
  }
}
