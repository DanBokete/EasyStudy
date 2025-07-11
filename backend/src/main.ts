import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import * as session from 'express-session';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:4173',
      'https://easy-study-six.vercel.app',
      'https://easy-study-git-production-dan-boketes-projects.vercel.app',
    ],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
