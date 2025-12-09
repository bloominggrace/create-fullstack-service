import { MikroORM } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CacheModule } from '@nestjs/cache-manager';
import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';

import { isProduction } from '../mikro-orm.config';
import { cacheConfig, loggerConfig } from './app.configs';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    LoggerModule.forRoot(loggerConfig),
    MikroOrmModule.forRoot(),
    CacheModule.registerAsync(cacheConfig),
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
