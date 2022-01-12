import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { join } from 'path';

import { AppModule } from './app.module';
import { AllExceptionFilter } from './infrastructure/common/filter/exception.filter';
import { LoggingInterceptor } from './infrastructure/common/interceptors/logger.interceptor';
import { ResponseInterceptor } from './infrastructure/common/interceptors/response.interceptor';
import { LoggerService } from './infrastructure/logger/logger.service';
import fastifyCookie from "fastify-cookie";
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Filter
  app.useGlobalFilters(new AllExceptionFilter(new LoggerService()));

  // pipes
  app.useGlobalPipes(new ValidationPipe());

  // interceptors
  app.useGlobalInterceptors(new LoggingInterceptor(new LoggerService()));
  app.useGlobalInterceptors(new ResponseInterceptor());

  app.useStaticAssets({ root: join(__dirname, '../..', 'public') });

  app.setViewEngine({
    engine: { ejs: require('ejs') },
    templates: join(__dirname, '../..', 'views'),
  });
  await app.register(fastifyCookie, {
    secret: 'pixelRobotics',
  });

  const serverHost = process.env.HOST || '0.0.0.0';
  const serverPort = parseInt(process.env.PORT, 10) || 3000;
  await app.listen(serverPort, null, (err, address) => {
    console.error(`Running error on ${address}, Error: ${err}`);
  });

  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
