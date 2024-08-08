import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "src/user/create-user.dto";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./local-auth.guard";
import { LoginDto } from "./login.dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

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
}
