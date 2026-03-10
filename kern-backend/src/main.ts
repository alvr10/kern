import { PinoLoggerService } from "@common/logger";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import helmet from "helmet";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    cors: true, // Enable CORS
  });

  // Use Pino logger
  const logger = app.get(PinoLoggerService);
  app.useLogger(logger);

  const configService = app.get(ConfigService);

  // Security
  app.use(helmet());

  // Global prefix
  const apiPrefix = configService.get<string>("API_PREFIX", "api");
  app.setGlobalPrefix(apiPrefix);

  // Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "1",
  });

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  // Swagger Documentation
  const swaggerEnabled = configService.get<string>("SWAGGER_ENABLED", "true");
  if (swaggerEnabled === "true") {
    const config = new DocumentBuilder()
      .setTitle("Kern API")
      .setDescription("Kern Backend API")
      .setVersion("1.0")
      .addTag("App", "Application endpoints")
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api/docs", app, document);

    logger.log("Swagger documentation available at /api/docs", "Bootstrap");
  }

  const port = configService.get<number>("PORT", 3000);
  await app.listen(port);

  logger.log(
    `Application is running on: http://localhost:${port}/${apiPrefix}`,
    "Bootstrap"
  );
  logger.log(
    `WebSocket server available at: ws://localhost:${port}`,
    "Bootstrap"
  );
  if (swaggerEnabled === "true") {
    logger.log(`Swagger docs: http://localhost:${port}/api/docs`, "Bootstrap");
  }
  logger.log("Bootstrap");
}

bootstrap();
