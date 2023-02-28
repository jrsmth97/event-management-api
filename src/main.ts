import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationError, useContainer } from 'class-validator';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

const corsDevelopment = '*';
const corsProduction = ['https://prod-url', /\.prod-url\.com$/];

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin:
        process.env.APP_ENV === 'development'
          ? corsDevelopment
          : corsProduction,
    },
  });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => {
        return new BadRequestException(errors);
      },
    }),
  );

  if (process.env.APP_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Event Management API')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  }
  await app.listen(process.env.APP_PORT || 8081);
}
bootstrap();
