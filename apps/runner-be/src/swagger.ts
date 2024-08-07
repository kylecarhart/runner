import { INestApplication } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function initSwagger(app: INestApplication) {
  const configService = app.get(ConfigService);
  const path = configService.get("PATH_SWAGGER");
  const pathJson = configService.get("PATH_SWAGGER_JSON");

  const config = new DocumentBuilder()
    .setTitle("Runner")
    .setDescription("Runner API")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(path, app, document, {
    jsonDocumentUrl: pathJson,
  });
}
