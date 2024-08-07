import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { initSwagger } from "./swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get("PORT");

  /** Swagger */
  initSwagger(app);

  await app.listen(port);
}

bootstrap();
