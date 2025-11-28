import { Module } from '@nestjs/common';
import { LoggerModule, Params } from 'nestjs-pino';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { isProduction } from './app.utils';
import { AuthModule } from './auth/auth.module';

const loggerConfig: Params = {
  pinoHttp: {
    level: isProduction() ? 'info' : 'debug',
    transport: isProduction()
      ? undefined
      : {
          target: 'pino-pretty',
          options: {
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        },
  },
};

@Module({
  imports: [LoggerModule.forRoot(loggerConfig), AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
