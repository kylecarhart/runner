import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { CreateUserDto } from "src/user/create-user.dto";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findOneByUsername(username);
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(
    createUserDto: CreateUserDto,
  ): Promise<Omit<User, "password">> {
    // Confirm password
    if (createUserDto.password !== createUserDto.confirmPassword) {
      throw new Error("Passwords do not match");
    }

    // Check if username is taken
    const isUsernameTaken = !!(await this.userService.findOneByUsername(
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
    const { password, ...newUser } = await this.userService.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return newUser;
  }
}
