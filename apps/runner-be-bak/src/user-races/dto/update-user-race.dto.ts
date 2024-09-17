import { PartialType } from "@nestjs/swagger";
import { CreateUserRaceDto } from "./create-user-race.dto";

export class UpdateUserRaceDto extends PartialType(CreateUserRaceDto) {}
