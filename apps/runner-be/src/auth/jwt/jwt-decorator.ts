import { applyDecorators, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { JwtAuthGuard } from "./jwt-auth.guard";

export function Jwt() {
  return applyDecorators(ApiBearerAuth(), UseGuards(JwtAuthGuard));
}
