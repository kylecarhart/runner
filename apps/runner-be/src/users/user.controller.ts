import { Body, Controller, Get, Param, Put, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { JwtUserPayload } from "src/auth/jwt.strategy";
import { User } from "./decorators/user.decorator";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserService } from "./user.service";

@ApiTags("user")
@Controller("users")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: "Get all users" })
  @ApiOkResponse({ description: "Returns all users" })
  findAll() {
    return this.userService.findAll();
  }

  @Get("profile")
  @ApiOperation({ summary: "Get logged in user profile" })
  async getUser(@User() user: JwtUserPayload) {
    return await this.userService.findOne(user.id);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update user" })
  async updateUser(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }
}
