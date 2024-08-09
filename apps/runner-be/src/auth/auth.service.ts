import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as argon2 from "argon2";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { UserWithoutPassword } from "src/users/entities/user.entity";
import { UserService } from "src/users/user.service";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findOneByUsernameWithPassword(username);
    const isMatch = await argon2.verify(user.password, password);

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
    const isUsernameTaken = !!(await this.userService.findOneByUsername(
      createUserDto.username,
    ));

    if (isUsernameTaken) {
      throw new Error("Username taken");
    }

    // Hash password
    const hashedPassword = await argon2.hash(createUserDto.password);

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
