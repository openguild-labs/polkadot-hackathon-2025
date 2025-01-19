import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import { ConfigService } from '@nestjs/config';
import {
  CorsConfig,
  NestConfig,
  SwaggerConfig,
} from './configs/config.interface';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PaginationQueryPipeTransform } from './common/pipes/parse-query.pipe';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import compression from 'compression';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

// Config dayjs
dayjs.extend(utc);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: false,
      },
    }),
    new PaginationQueryPipeTransform(),
  );

  app.use(cookieParser());
  app.use(helmet());
  app.use(compression());

  // enable shutdown hook
  app.enableShutdownHooks();

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  const configService = app.get(ConfigService);

  const nestConfig = configService.get<NestConfig>('nest');
  const corsConfig = configService.get<CorsConfig>('cors');
  const swaggerConfig = configService.get<SwaggerConfig>('swagger');

  // Global Prefix
  app.setGlobalPrefix(nestConfig.path);

  // Swagger Api
  if (swaggerConfig.enabled) {
    const options = new DocumentBuilder()
      .setTitle(swaggerConfig.title)
      .setDescription(swaggerConfig.description)
      .setVersion(swaggerConfig.version)
      // .addApiKey({ type: 'apiKey', name: 'X-API-KEY', in: 'header' }, 'Api-Key')
      .build();
    const document = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup(swaggerConfig.path || 'api', app, document);
  }

  // Cors
  if (corsConfig.enabled) {
    app.enableCors({
      // allowedHeaders: '*',
      origin: corsConfig.origins,
      credentials: true,
    });
  }

  await app.listen(nestConfig.port, () => {
    console.log(
      `Server running port: ${nestConfig.port}`,
      `🚀 API server listenning on http://localhost:${nestConfig.port}/api`,
    );
  });
}
bootstrap();
