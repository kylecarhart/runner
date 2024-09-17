import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { resolve } from "path";
import { AppModule } from "./app.module";
import { client, db } from "./drizzle/db";
import { event } from "./events/entities/event.entity";
import { initSwagger } from "./swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get("PORT");

  // Swagger
  initSwagger(app);

  await client.connect();
  console.log(resolve(__dirname, "drizzle"));
  // await migrate(db, { migrationsFolder: "src/drizzle" });

  const events = await db.select().from(event);
  console.log(events);

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip unknown incoming properties
    }),
  );

  await app.listen(port);
}

bootstrap();
