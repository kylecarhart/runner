import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { CreateRaceDto } from "./dto/create-race.dto";
import { UpdateRaceDto } from "./dto/update-race.dto";
import { RacesService } from "./races.service";

@Controller("races")
export class RacesController {
  constructor(private readonly racesService: RacesService) {}

  @Post()
  create(@Body() createRaceDto: CreateRaceDto) {
    return this.racesService.create(createRaceDto);
  }

  @Get()
  findAll() {
    return this.racesService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.racesService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateRaceDto: UpdateRaceDto) {
    return this.racesService.update(+id, updateRaceDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.racesService.remove(+id);
  }
}
