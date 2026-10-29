import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { RequestIdMiddleware } from './platform/request-id.middleware';
import { GlobalErrorFilter } from './platform/global-error.filter';
import { StructuredLogger } from './platform/structured-logger';
import { parseEnvironment } from '@court-booking/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap(): Promise<void> {
  const environment = parseEnvironment(process.env);
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bufferLogs: true });
  app.useLogger(new StructuredLogger());
  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.useBodyParser('json', { limit: '25mb' });
  app.useBodyParser('urlencoded', { limit: '25mb', extended: true });
  app.setGlobalPrefix(environment.API_PREFIX);
  const requestIdMiddleware = new RequestIdMiddleware();
  app.use(requestIdMiddleware.use.bind(requestIdMiddleware));
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );
  app.useGlobalFilters(new GlobalErrorFilter());
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Court Booking Platform API')
    .setDescription('Egypt-focused football and padel court booking API')
    .setVersion('0.1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'bearerAuth')
    .addServer(`/${environment.API_PREFIX}`)
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument, {
    customSiteTitle: 'Court Booking API Documentation',
    swaggerOptions: { persistAuthorization: true },
  });
  await app.listen(environment.PORT, '0.0.0.0');
}

void bootstrap();
