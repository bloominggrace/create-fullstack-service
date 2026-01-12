import { MikroORM } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CacheModule } from '@nestjs/cache-manager';
import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TerminusModule } from '@nestjs/terminus';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';

import { isProduction } from '@/../mikro-orm.config';
import { RedisModule } from '@/redis/redis.module';

import { cacheConfig, configConfig, loggerConfig, throttlerConfig } from './app.configs';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot(configConfig),
    LoggerModule.forRoot(loggerConfig),
    MikroOrmModule.forRoot(),
    CacheModule.registerAsync(cacheConfig),
    RedisModule,
    TerminusModule,
    ThrottlerModule.forRootAsync(throttlerConfig),
  ],
  controllers: [AppController],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }, AppService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly orm: MikroORM) {}

  async onModuleInit(): Promise<void> {
    if (!isProduction()) {
      await this.updateDatabase();
    }
  }

  private async updateDatabase() {
    const schema = this.orm.schema;
    await schema.ensureDatabase();

    if ((await schema.getUpdateSchemaSQL()).length !== 0) {
      await schema.updateSchema();
      Logger.log(`DB가 업데이트 되었습니다.`, AppModule.name);
    }
  }
}
