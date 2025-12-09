import KeyvRedis from '@keyv/redis';
import { type CacheModuleOptions } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import ms from 'ms';
import { type Params } from 'nestjs-pino';

import { isProduction } from '../mikro-orm.config';

export const loggerConfig: Params = {
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

export const cacheConfig = {
  isGlobal: true,
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService): CacheModuleOptions => {
    return {
      stores: [
        new KeyvRedis({
          socket: {
            host: configService.getOrThrow<string>('REDIS_HOST'),
            port: configService.getOrThrow<number>('REDIS_PORT'),
          },
          password: configService.getOrThrow<string>('REDIS_PASSWORD'),
          database: configService.getOrThrow<number>('REDIS_DB'),
        }),
      ],
      ttl: ms('5m'),
    };
  },
};
