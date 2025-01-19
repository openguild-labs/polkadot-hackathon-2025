import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.enableVersioning();
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: 'http://localhost:3000', // Allow requests from your frontend origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
    credentials: true, // Allow cookies or credentials
  });

  const config = new DocumentBuilder()
    .setTitle('SolNFTss')
    .setDescription('The version 1')
    .setVersion('v1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3005);
}
bootstrap();
