import KeyvRedis from '@keyv/redis';
import { type CacheModuleAsyncOptions, type CacheModuleOptions } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import ms from 'ms';
import { type Params } from 'nestjs-pino';

import { isDevelopment, isProduction } from '../mikro-orm.config';

export function getStatusCodeIcon(statusCode: number): string {
  if (statusCode >= 500) return '🔥';
  if (statusCode >= 400) return '⚠️';
  if (statusCode >= 300) return '↪️';
  if (statusCode >= 200) return '✅';
  return 'ℹ️';
}

export const loggerConfig: Params = {
  pinoHttp: {
    level: isProduction() ? 'info' : isDevelopment() ? 'debug' : 'warn',
    transport: isProduction()
      ? undefined
      : {
          target: 'pino-pretty',
          options: {
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname,req,res,responseTime',
            singleLine: true,
            messageFormat: '{msg}',
          },
        },
    customLogLevel: (_, res, err) => {
      const { statusCode } = res;

      if (statusCode >= 500 || err) return 'error';
      if (statusCode >= 400) return 'warn';
      return 'info';
    },
    customSuccessMessage: (req, res, responseTime) => {
      const { statusCode } = res;
      const { method, url } = req;

      return `${getStatusCodeIcon(statusCode)} ${statusCode} (${method}) ${url} - ${Math.round(responseTime)}ms`;
    },
    customErrorMessage: (req, res) => {
      const { statusCode } = res;
      const { method, url } = req;

      return `${getStatusCodeIcon(statusCode)} ${statusCode} (${method}) ${url}`;
    },
  },
};

export const cacheConfig: CacheModuleAsyncOptions = {
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
