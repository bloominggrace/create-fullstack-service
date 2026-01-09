import { type ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { HttpStatus, type INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { ThrottlerStorage } from '@nestjs/throttler';
import ms from 'ms';
import request from 'supertest';
import { type App } from 'supertest/types';

import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
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
});
