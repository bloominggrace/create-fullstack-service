import { MikroORM } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { LoggerModule, Params } from 'nestjs-pino';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { isProduction } from './app.utils';

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
            singleLine: true,
          },
        },
  },
};

@Module({
  imports: [
    LoggerModule.forRoot(loggerConfig),
    MikroOrmModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly orm: MikroORM) {}

  async onModuleInit(): Promise<void> {
    if (!isProduction()) {
      await this.updateDatabase();
    }
  }

  private async updateDatabase() {
    const generator = this.orm.getSchemaGenerator();
    await generator.ensureDatabase();

    if ((await generator.getUpdateSchemaSQL()).length !== 0) {
      await generator.updateSchema();
      Logger.log(`DB가 업데이트 되었습니다.`, AppModule.name);
    }
  }
}
