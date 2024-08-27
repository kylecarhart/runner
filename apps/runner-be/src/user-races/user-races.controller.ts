import { Controller, Get, Param, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Jwt } from "src/auth/jwt/jwt-decorator";
import { JwtUserPayload } from "src/auth/jwt/jwt.strategy";
import { User } from "src/users/decorators/user.decorator";
import { UserRacesService } from "./user-races.service";

@Controller()
@ApiTags("user-races")
export class UserRacesController {
  constructor(private readonly userRacesService: UserRacesService) {}

  @Post("races/:id/signup")
  @ApiOperation({ summary: "Sign up for a race" })
  @Jwt()
  signup(@Param("id") id: string, @User() user: JwtUserPayload) {
    return this.userRacesService.signup(id, user.id);
  }

  @Get("races/:id/users")
  @ApiOperation({ summary: "Find all users signed up for a race" })
  findAllRacesByUser(@Param("id") id: string) {
    return this.userRacesService.findByRaceId(id);
  }

  @Get("users/:id/races")
  @ApiOperation({ summary: "Find all races signed up for by a user" })
  findAllUsersByRace(@Param("id") id: string) {
    return this.userRacesService.findByUserId(id);
  }

  // @Get(":id")
  // findOne(@Param("id") id: string) {
  //   return this.userRacesService.findOne(+id);
  // }

  // @Patch(":id")
  // update(
  //   @Param("id") id: string,
  //   @Body() updateUserRaceDto: UpdateUserRaceDto,
  // ) {
  //   return this.userRacesService.update(+id, updateUserRaceDto);
  // }

  // @Delete(":id")
  // remove(@Param("id") id: string) {
  //   return this.userRacesService.remove(+id);
  // }
}
