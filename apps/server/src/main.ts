import { ForbiddenException, InternalServerErrorException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';

import { AllowedOriginsService } from '@/origins/allowed-origins.service';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const logger = app.get(Logger);

  app.useLogger(logger);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableCors({
    origin: async (url: string, callback: (error: Error | null, allow?: boolean) => void) => {
      if (!url) {
        return callback(null, true);
      }

      let allowedOrigins: string[] | undefined;

      try {
        allowedOrigins = await app.get(AllowedOriginsService).get();
      } catch {
        return callback(new InternalServerErrorException(), false);
      }

      if (allowedOrigins?.includes(url)) {
        return callback(null, true);
      } else {
        return callback(new ForbiddenException('허용되지 않은 접근입니다.'), false);
      }
    },
    credentials: true,
  });
  await app.listen(process.env.PORT || 3000, process.env.HOST || '0.0.0.0');
  logger.log(`서버가 ${await app.getUrl()}에서 실행 중입니다.`, 'bootstrap');
}

bootstrap().catch(() => process.exit(1));
