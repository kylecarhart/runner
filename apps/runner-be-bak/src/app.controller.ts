import { Controller, Get } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: "Heartbeat",
    description: "Used to check if the server is online.",
  })
  heartbeat(): string {
    return this.appService.getHeartbeat();
  }
}
