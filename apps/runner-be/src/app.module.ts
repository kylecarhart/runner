import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { DatabaseModule } from "./database/database.module";
import { EventsModule } from "./events/events.module";
import { RacesModule } from "./races/races.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    RacesModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
