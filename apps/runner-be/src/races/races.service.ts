import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import { CreateRaceDto } from "./dto/create-race.dto";
import { UpdateRaceDto } from "./dto/update-race.dto";
import { Race } from "./entities/race.entity";

@Injectable()
export class RacesService {
  constructor(
    @InjectRepository(Race)
    private racesRepository: Repository<Race>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  create(eventId: string, createRaceDto: CreateRaceDto) {
    return this.racesRepository.save({
      ...createRaceDto,
      event: { id: eventId },
    });
  }

  async signup(id: string, userId: string) {
    const race = await this.racesRepository.findOneByOrFail({ id });
    const user = await this.usersRepository.findOneBy({ id: userId });

    // if (!race.users) {
    //   race.users = [];
    // }

    // race.users.push(user);
    // return this.racesRepository.save(race);
  }

  findAll() {
    return this.racesRepository.find();
  }

  findOne(id: string) {
    return this.racesRepository.findOneBy({ id });
  }

  update(id: string, updateRaceDto: UpdateRaceDto) {
    return `This action updates a #${id} race`;
  }

  remove(id: string) {
    return `This action removes a #${id} race`;
  }
}
