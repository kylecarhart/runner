import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "./create-user.dto";
import { UpdateUserDto } from "./update-user.dto";
import { User, UserWithoutPassword } from "./user.entity";

@Injectable()
export class UserService {
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

  findOneByUsername(
    username: User["username"],
  ): Promise<UserWithoutPassword | null> {
    return this.usersRepository.findOneBy({ username });
  }

  findOneByUsernameForAuth(username: User["username"]): Promise<User | null> {
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

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
