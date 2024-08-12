import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Jwt } from "src/auth/jwt/jwt-decorator";
import { JwtUserPayload } from "src/auth/jwt/jwt.strategy";
import { User } from "src/users/decorators/user.decorator";
import { CreateRaceDto } from "./dto/create-race.dto";
import { UpdateRaceDto } from "./dto/update-race.dto";
import { RacesService } from "./races.service";

@Controller()
@ApiTags("races")
export class RacesController {
  constructor(private readonly racesService: RacesService) {}

  @Post("events/:id/races")
  @ApiOperation({ summary: "Create a race for an event" })
  @Jwt()
  create(@Param("id") id: string, @Body() createRaceDto: CreateRaceDto) {
    return this.racesService.create(id, createRaceDto);
  }

  @Post("races/:id")
  @ApiOperation({ summary: "Sign up for a race" })
  @Jwt()
  signup(@Param("id") id: string, @User() user: JwtUserPayload) {
    return this.racesService.signup(id, user.id);
  }

  @Get("races")
  @ApiOperation({ summary: "Get all races for all events" })
  findAll() {
    return this.racesService.findAll();
  }

  @Get("races/:id")
  @ApiOperation({ summary: "Get one race" })
  findOne(@Param("id") id: string) {
    return this.racesService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a race" })
  @Jwt()
  update(@Param("id") id: string, @Body() updateRaceDto: UpdateRaceDto) {
    return this.racesService.update(id, updateRaceDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a race" })
  @Jwt()
  remove(@Param("id") id: string) {
    return this.racesService.remove(id);
  }
}
