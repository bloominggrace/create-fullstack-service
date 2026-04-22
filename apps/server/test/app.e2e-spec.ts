import { type ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import {
  ForbiddenException,
  HttpStatus,
  type INestApplication,
  InternalServerErrorException,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { ThrottlerStorage } from '@nestjs/throttler';
import ms from 'ms';
import { Logger } from 'nestjs-pino';
import request from 'supertest';
import { type App } from 'supertest/types';

import { AppModule } from '@/app.module';
import { AllowedOriginsService } from '@/origins/allowed-origins.service';
import {
  type CreateOriginRes,
  type FindOriginRes,
  type FindOriginsRes,
  type SearchOriginsRes,
  type UpdateOriginRes,
} from '@/origins/dto';

import { Random } from './test.utils';

describe('E2E 테스트', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = testingModule.createNestApplication();
    app.useLogger(app.get(Logger));
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.enableCors({
      origin: async (url: string, callback: (error: Error | null, allow?: boolean) => void) => {
        if (!url) {
          return callback(null, true);
        }

        let allowedOrigins: string[] | undefined;

        try {
          allowedOrigins = await app.get(AllowedOriginsService).get();
        } catch {
          return callback(new InternalServerErrorException(), false);
        }

        if (allowedOrigins?.includes(url)) {
          return callback(null, true);
        } else {
          return callback(new ForbiddenException('허용되지 않은 접근입니다.'), false);
        }
      },
      credentials: true,
    });
    await app.init();
  });

  beforeEach(async () => {
    await app.get<ThrottlerStorageRedisService>(ThrottlerStorage).redis.flushdb();
  });

  afterAll(async () => {
    await app.close();
  });

  test('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(HttpStatus.OK).expect('Hello World!');
  });

  describe('AppModule 테스트', () => {
    test(
      'API 요청 제한이 설정되어 있는지 확인한다.',
      async () => {
        const throttleLimit = app.get(ConfigService).getOrThrow<number>('THROTTLE_LIMIT');

        for (let i = 0; i < throttleLimit; i++) {
          await request(app.getHttpServer()).get('/').expect(HttpStatus.OK);
        }

        await request(app.getHttpServer()).get('/').expect(HttpStatus.TOO_MANY_REQUESTS);
      },
      ms('10s'),
    );
  });

  describe('OriginsController 테스트', () => {
    describe('(POST) /v1/origins', () => {
      test('오리진 생성에 성공한다.', async () => {
        const response = await request(app.getHttpServer())
          .post('/v1/origins')
          .send({ url: Random.url() })
          .expect(HttpStatus.CREATED);
        const body = response.body as CreateOriginRes;

        expect(body.id).toBeDefined();
      });
    });

    describe('(GET) /v1/origins/search', () => {
      test('오리진 검색에 성공한다.', async () => {
        const originFixture = Random.originFixture();
        const response = await request(app.getHttpServer())
          .get(`/v1/origins/search`)
          .query({ url: originFixture.url.slice(-10), pageNumber: 1, pageSize: 10 })
          .expect(HttpStatus.OK);
        const body = response.body as SearchOriginsRes;

        expect(body.origins.length).not.toEqual(0);
        expect(body.origins[0].url).toEqual(originFixture.url);
      });
    });

    describe('(GET) /v1/origins', () => {
      test('오리진 목록 조회에 성공한다.', async () => {
        const pageNumber = 1;
        const pageSize = 10;
        const response = await request(app.getHttpServer())
          .get('/v1/origins')
          .query({ pageNumber, pageSize })
          .expect(HttpStatus.OK);
        const body = response.body as FindOriginsRes;

        expect(body.origins).toBeInstanceOf(Array);
        expect(body.origins.length).toEqual(body.totalCount);
        expect(body.totalCount).toBeDefined();
        expect(body.pageNumber).toBe(pageNumber);
        expect(body.totalPages).toBeDefined();
      });
    });

    describe('(GET) /v1/origins/:id', () => {
      test('오리진 조회에 성공한다.', async () => {
        const originFixture = Random.originFixture();
        const response = await request(app.getHttpServer())
          .get(`/v1/origins/${originFixture.id}`)
          .expect(HttpStatus.OK);
        const body = response.body as FindOriginRes;

        expect(body.id).toEqual(originFixture.id);
        expect(body.url).toEqual(originFixture.url);
        expect(body.isActive).toEqual(originFixture.isActive);
      });
    });

    describe('(PATCH) /v1/origins/:id', () => {
      test('오리진을 수정한다.', async () => {
        const originFixture = Random.originFixture();
        const response = await request(app.getHttpServer())
          .patch(`/v1/origins/${originFixture.id}`)
          .send({ isActive: !originFixture.isActive })
          .expect(HttpStatus.OK);
        const body = response.body as UpdateOriginRes;

        expect(body.isActive).not.toEqual(originFixture.isActive);
      });
    });

    describe('(DELETE) /v1/origins/:id', () => {
      test('오리진을 삭제한다.', async () => {
        const originFixture = Random.originFixture({ url: 'https://google.com' });

        await request(app.getHttpServer()).delete(`/v1/origins/${originFixture.id}`).expect(HttpStatus.OK);
      });
    });
  });
});
