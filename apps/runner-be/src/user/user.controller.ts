import { Body, Controller, Get, Param, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import * as bcrypt from "bcrypt";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { UpdateUserDto } from "./update-user.dto";
import { User } from "./user.decorator";
import { UserService } from "./user.service";

@ApiTags("user")
@Controller("users")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOkResponse({ description: "Returns all users" })
  findAll() {
    return this.userService.findAll();
  }

  @Get("profile")
  async getUser(@User("id") id) {
    const user = await this.userService.findOne(id);
    return user;
  }

  @Put(":id")
  async updateUser(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    if (
      updateUserDto.password &&
      updateUserDto.password === updateUserDto.confirmPassword
    ) {
      delete updateUserDto.confirmPassword;
    }

    updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);

    return this.userService.update(id, updateUserDto);
  }
}
