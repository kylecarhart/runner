import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { CreateUserRaceDto } from "./dto/create-user-race.dto";
import { UpdateUserRaceDto } from "./dto/update-user-race.dto";
import { UserRacesService } from "./user-races.service";

@Controller("user-races")
export class UserRacesController {
  constructor(private readonly userRacesService: UserRacesService) {}

  @Post()
  create(@Body() createUserRaceDto: CreateUserRaceDto) {
    return this.userRacesService.create(createUserRaceDto);
  }

  @Get()
  findAll() {
    return this.userRacesService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.userRacesService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateUserRaceDto: UpdateUserRaceDto,
  ) {
    return this.userRacesService.update(+id, updateUserRaceDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.userRacesService.remove(+id);
  }
}
