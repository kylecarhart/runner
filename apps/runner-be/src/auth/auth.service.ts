import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { CreateUserDto } from "src/user/create-user.dto";
import { UserWithoutPassword } from "src/user/user.entity";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findOneByUsernameForAuth(username);
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: UserWithoutPassword) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(createUserDto: CreateUserDto): Promise<UserWithoutPassword> {
    // Confirm password
    if (createUserDto.password !== createUserDto.confirmPassword) {
      throw new Error("Passwords do not match");
    }

    // Check if username is taken
    const isUsernameTaken = !!(await this.userService.findOneByUsernameForAuth(
      createUserDto.username,
    ));

    if (isUsernameTaken) {
      throw new Error("Username taken");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Remove password and confirmPassword from memory
    delete createUserDto.password;
    delete createUserDto.confirmPassword;

    // Create user and return without password
    const newUser = await this.userService.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return newUser;
  }
}
