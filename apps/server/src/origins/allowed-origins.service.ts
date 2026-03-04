import { EntityManager } from '@mikro-orm/core';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Origin } from './entities';

const ALLOWED_ORIGINS_CACHE_KEY = 'allowed-origins';

@Injectable()
export class AllowedOriginsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly entityManager: EntityManager,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async get(): Promise<string[]> {
    let allowedOrigins = await this.cacheManager.get<string[]>(ALLOWED_ORIGINS_CACHE_KEY);

    if (allowedOrigins) {
      return allowedOrigins;
    }

    allowedOrigins = Array.from(
      new Set([
        ...(this.configService.get<string[]>('ALLOWED_ORIGINS') || []),
        ...(await this.entityManager.fork().find(Origin, { isActive: true })).map((origin) => origin.url),
      ]),
    );
    await this.cacheManager.set(ALLOWED_ORIGINS_CACHE_KEY, allowedOrigins);

    return allowedOrigins;
  }

  async invalidate(): Promise<void> {
    await this.cacheManager.del(ALLOWED_ORIGINS_CACHE_KEY);
  }
}
