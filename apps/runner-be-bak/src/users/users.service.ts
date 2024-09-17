import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as argon2 from "argon2";
import { Repository } from "typeorm";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User, UserWithoutPassword } from "./entities/user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<UserWithoutPassword[]> {
    return this.usersRepository.find();
  }

  findOne(id: User["id"]): Promise<UserWithoutPassword | null> {
    return this.usersRepository.findOneBy({ id });
  }

  findOneWithPassword(id: User["id"]): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder("user")
      .addSelect("user.password")
      .where("user.id = :id", { id })
      .getOne();
  }

  findOneByUsername(
    username: User["username"],
  ): Promise<UserWithoutPassword | null> {
    return this.usersRepository.findOneBy({ username });
  }

  findOneByUsernameWithPassword(
    username: User["username"],
  ): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder("user")
      .addSelect("user.password")
      .where("user.username = :username", { username })
      .getOne();
  }

  create(createUserDto: CreateUserDto): Promise<UserWithoutPassword> {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserWithoutPassword> {
    await this.usersRepository.update(id, updateUserDto);
    return this.usersRepository.findOneByOrFail({ id });
  }

  async remove(id: User["id"]): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async changePassword(id: User["id"], changePasswordDto: ChangePasswordDto) {
    const { oldPassword, password, confirmPassword } = changePasswordDto;

    // Check if new password and confirm password match
    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    // Get the user with password
    const user = await this.findOneWithPassword(id);

    // Check if old password is correct
    const isOldPasswordMatch = await argon2.verify(user.password, oldPassword);
    if (!isOldPasswordMatch) {
      throw new Error("Old password is incorrect");
    }

    // Hash and update password
    const hashedPassword = await argon2.hash(password);
    await this.usersRepository.update(id, { password: hashedPassword });
  }
}
