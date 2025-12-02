import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const logger = app.get(Logger);
  app.useLogger(logger);
  await app.listen(process.env.PORT || 3000, process.env.HOST || '0.0.0.0');
  logger.log(`서버가 ${await app.getUrl()}에서 실행 중입니다.`, 'bootstrap');
}

bootstrap().catch(() => process.exit(1));
