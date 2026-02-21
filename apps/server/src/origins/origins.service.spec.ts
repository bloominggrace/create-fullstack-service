// noinspection ES6RedundantAwait

import { type EntityManager, MikroORM } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { type Cache, CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, type TestingModule } from '@nestjs/testing';
import { Random } from '@test/test.utils';
import { expect } from 'vitest';

import { configConfig } from '@/app.configs';

import { AllowedOriginsService } from './allowed-origins.service';
import { Origin } from './entities';
import { OriginsService } from './origins.service';

describe('OriginsService 테스트', () => {
  let testingModule: TestingModule;
  let mikroOrm: MikroORM;
  let cacheManager: Cache;
  let originsService: OriginsService;
  let entityManager: EntityManager;

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      imports: [
        await ConfigModule.forRoot(configConfig),
        MikroOrmModule.forRoot(),
        MikroOrmModule.forFeature([Origin]),
        CacheModule.register(),
      ],
      providers: [AllowedOriginsService, OriginsService],
    }).compile();

    mikroOrm = testingModule.get(MikroORM);
    cacheManager = testingModule.get<Cache>(CACHE_MANAGER);
    originsService = testingModule.get(OriginsService);
  });

  beforeEach(async () => {
    entityManager = mikroOrm.em.fork();
    Object.assign(originsService, { entityManager });
    await entityManager.begin();
  });

  afterEach(async () => {
    await cacheManager.clear();
    await entityManager.rollback();
  });

  afterAll(async () => {
    await testingModule.close();
  });

  describe('오리진 생성', () => {
    test('오리진 생성에 성공한다.', async () => {
      const { origin } = await originsService.create({ url: Random.url() });

      expect(origin).toBeDefined();
    });

    test('이미 존재하는 URL로 오리진을 생성하면 실패한다.', async () => {
      const originFixture = Random.originFixture();

      await expect(originsService.create({ url: originFixture.url })).rejects.toThrow(ConflictException);
    });
  });

  describe('오리진 검색', () => {
    test('오리진 검색에 성공한다.', async () => {
      const originFixture = Random.originFixture({ url: 'https://bloomingchatbot.com' });
      const { origins: origins0 } = await originsService.search({
        url: originFixture.url.slice(0, 14),
        pageNumber: 1,
        pageSize: 10,
      });
      const { origins: origins1 } = await originsService.search({
        url: originFixture.url.slice(-10),
        pageNumber: 1,
        pageSize: 10,
      });

      expect(origins0).not.toHaveLength(0);
      expect(origins0.map((origin) => origin.url)).toContainEqual(originFixture.url);
      expect(origins1).not.toHaveLength(0);
      expect(origins1.map((origin) => origin.url)).toContainEqual(originFixture.url);
    });

    test('오리진 검색에 실패한다.', async () => {
      const { origins } = await originsService.search({ url: 'https://www.lycos.com', pageNumber: 1, pageSize: 10 });

      expect(origins).toHaveLength(0);
    });
  });

  describe('오리진 조회', () => {
    test('오리진 목록 조회에 성공한다.', async () => {
      const { origins, totalCount, pageNumber, totalPages } = await originsService.findAll({
        pageNumber: 1,
        pageSize: 10,
      });

      expect(origins.length).toBeGreaterThan(0);
      expect(totalCount).toBeGreaterThan(0);
      expect(pageNumber).toEqual(1);
      expect(totalPages).toBeGreaterThanOrEqual(0);
    });

    test('오리진 조회에 성공한다.', async () => {
      const originFixture = Random.originFixture();
      const { origin } = await originsService.findOne({ id: originFixture.id });

      expect(origin.id).toEqual(originFixture.id);
      expect(origin.url).toEqual(originFixture.url);
      expect(origin.isActive).toEqual(originFixture.isActive);
    });

    test('오리진 조회에 실패한다.', async () => {
      await expect(originsService.findOne({ url: 'https://www.lycos.com' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('오리진 수정', () => {
    test('오리진 수정에 성공한다.', async () => {
      const originFixture = Random.originFixture({ url: 'https://bloomingchatbot.com' });
      const { origin } = await originsService.findOne({ url: originFixture.url });

      await originsService.update({ origin, url: Random.url(), isActive: !originFixture.isActive });

      expect(origin.url).not.toEqual(originFixture.url);
      expect(origin.isActive).not.toEqual(originFixture.isActive);
    });
  });

  describe('오리진 삭제', () => {
    test('오리진 삭제에 성공한다.', async () => {
      const originFixture = Random.originFixture();
      const { origin } = await originsService.findOne({ id: originFixture.id });

      await originsService.delete({ origin });

      await expect(originsService.findOne({ id: originFixture.id })).rejects.toThrow(NotFoundException);
    });
  });
});
