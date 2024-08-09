import {
  Body,
  Controller,
  Post,
  Put,
  Request,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ChangePasswordDto } from "src/user/change-password.dto";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { User } from "src/user/user.decorator";
import { UserService } from "src/user/user.service";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { JwtUserPayload } from "./jwt.strategy";
import { LocalAuthGuard } from "./local-auth.guard";
import { LoginDto } from "./login.dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post("login")
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginDto })
  @ApiOperation({
    summary: "Log in user",
    description: "Log in a user with username and password.",
  })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post("register")
  @ApiOperation({
    summary: "Register user",
    description: "Create a new user.",
  })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Put("change-password")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Change password" })
  async changePassword(
    @User() user: JwtUserPayload,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.userService.changePassword(user.id, changePasswordDto);
  }
}
