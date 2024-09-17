import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RacesService } from "src/races/races.service";
import { UsersService } from "src/users/users.service";
import { Repository } from "typeorm";
import { UpdateUserRaceDto } from "./dto/update-user-race.dto";
import { UserRace } from "./entities/user-race.entity";

@Injectable()
export class UserRacesService {
  constructor(
    @InjectRepository(UserRace)
    private userRacesRepository: Repository<UserRace>,
    private usersService: UsersService,
    private racesService: RacesService,
  ) {}

  /**
   * Signs up a user for a race.
   * @param raceId Race Id
   * @param userId User Id
   * @returns The user race entity representing registration.
   */
  async signup(raceId: string, userId: string) {
    const user = await this.usersService.findOne(userId);

    if (!user) {
      throw new Error(`User ${userId} does not exist.`);
    }

    const race = await this.racesService.findOne(raceId);

    if (!race) {
      throw new Error(`Race ${raceId} does not exist.`);
    }

    const isUserAlreadySignedUp = await this.isUserSignedUpForRace(
      userId,
      raceId,
    );
    if (isUserAlreadySignedUp) {
      throw new Error(`User ${userId} already signed up for race ${raceId}.`);
    }

    const userRace = this.userRacesRepository.create({
      userId,
      raceId,
    });

    return this.userRacesRepository.save(userRace);
  }

  findOne(id: number) {
    return `This action returns a #${id} userRace`;
  }

  async findByUserId(userId: string) {
    const userRaces = await this.userRacesRepository.findBy({});
    console.log(userRaces);
    return userRaces.map((userRace) => userRace.race);
  }

  findByRaceId(raceId: string) {
    return this.userRacesRepository.findBy({ raceId });
  }

  async isUserSignedUpForRace(userId: string, raceId: string) {
    return !!(await this.userRacesRepository.findBy({ userId, raceId }));
  }

  update(id: number, updateUserRaceDto: UpdateUserRaceDto) {
    return `This action updates a #${id} userRace`;
  }

  remove(id: number) {
    return `This action removes a #${id} userRace`;
  }
}
