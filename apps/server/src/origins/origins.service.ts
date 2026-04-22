import { EntityManager, FilterQuery, NotFoundError, UniqueConstraintViolationException } from '@mikro-orm/core';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { isUndefined, omitBy } from 'es-toolkit';

import { getTotalPages } from '@/common/common.utils';

import { AllowedOriginsService } from './allowed-origins.service';
import { Origin } from './entities';

@Injectable()
export class OriginsService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly allowedOriginsService: AllowedOriginsService,
  ) {}

  async create(params: { url: string }): Promise<Origin> {
    const origin = this.entityManager.create(Origin, params);

    try {
      await this.entityManager.persist(origin).flush();
      await this.allowedOriginsService.invalidate();
    } catch (error) {
      if (error instanceof UniqueConstraintViolationException) {
        throw new ConflictException('이미 등록된 오리진이 있습니다.');
      }

      throw error;
    }

    return origin;
  }

  async search(params: {
    url?: string;
    isActive?: boolean;
    pageNumber: number;
    pageSize: number;
  }): Promise<{ origins: Origin[]; totalCount: number; pageNumber: number; pageSize: number; totalPages: number }> {
    const { url, isActive, pageNumber, pageSize } = params;
    const where: FilterQuery<Origin> = {};

    if (url) {
      where.url = { $ilike: `%${url}%` };
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [origins, totalCount] = await this.entityManager.findAndCount(Origin, where, {
      limit: pageSize,
      offset: (pageNumber - 1) * pageSize,
      orderBy: { createdAt: 'DESC', url: 'ASC' },
    });

    return {
      origins,
      totalCount,
      pageNumber,
      pageSize,
      totalPages: getTotalPages(totalCount, pageSize),
    };
  }

  async findAll(params: {
    where?: FilterQuery<Origin>;
    pageNumber: number;
    pageSize: number;
  }): Promise<{ origins: Origin[]; totalCount: number; pageNumber: number; pageSize: number; totalPages: number }> {
    const { where = {}, pageNumber, pageSize } = params;
    const [origins, totalCount] = await this.entityManager.findAndCount(Origin, where, {
      limit: pageSize,
      offset: (pageNumber - 1) * pageSize,
      orderBy: { createdAt: 'DESC', url: 'ASC' },
    });

    return { origins, totalCount, pageNumber, pageSize, totalPages: getTotalPages(totalCount, pageSize) };
  }

  async findOne(where: FilterQuery<Origin>): Promise<Origin> {
    try {
      return await this.entityManager.findOneOrFail(Origin, where);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundException('찾을 수 없는 오리진입니다.');
      }
      throw error;
    }
  }

  async update(params: { origin: Origin; url?: string; isActive?: boolean }): Promise<Origin> {
    const { origin, url, isActive } = params;

    this.entityManager.assign(origin, omitBy({ url, isActive }, isUndefined));
    await this.entityManager.flush();
    await this.allowedOriginsService.invalidate();

    return origin;
  }

  async remove(origin: Origin): Promise<void> {
    await this.entityManager.remove(origin).flush();
    await this.allowedOriginsService.invalidate();
  }
}
