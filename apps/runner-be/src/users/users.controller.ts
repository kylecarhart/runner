import { Body, Controller, Get, Param, Put, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/jwt/jwt-auth.guard";
import { JwtUserPayload } from "src/auth/jwt/jwt.strategy";
import { User } from "./decorators/user.decorator";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersService } from "./users.service";

@ApiTags("users")
@Controller("users")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: "Get all users" })
  @ApiOkResponse({ description: "Returns all users" })
  findAll() {
    return this.usersService.findAll();
  }

  @Get("profile")
  @ApiOperation({ summary: "Get logged in user profile" })
  async getUser(@User() user: JwtUserPayload) {
    return await this.usersService.findOne(user.id);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update user" })
  async updateUser(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }
}
