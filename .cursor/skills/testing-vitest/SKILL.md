---
name: testing-vitest
description: Use when writing tests for NestJS + MikroORM with transaction rollback and real DB integration.
---

# Vitest Testing Guide

Use this skill when writing tests (`*.spec.ts`, `*.e2e-spec.ts`) for NestJS + MikroORM projects.

## Test Types

1. **Integration Tests (*.spec.ts)**: Service layer, uses real DB
2. **E2E Tests (*.e2e-spec.ts)**: Full API endpoint flow

> ⚠️ Do NOT write controller unit tests
> ⚠️ Use real DB connection instead of mocks

## Service Integration Test Structure

```typescript
import { faker } from '@faker-js/faker';
import { type EntityManager, MikroORM } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

import { CreateEntityDto } from './dto/create-entity.dto';
import { Entity } from './entities/entity.entity';
import { EntityService } from './entity.service';

async function generateCreateEntityDto(): Promise<CreateEntityDto> {
  const dto = plainToInstance(CreateEntityDto, {
    field: faker.lorem.word(),
  });
  await validateOrReject(dto);
  return dto;
}

describe('EntityService 테스트', () => {
  let testingModule: TestingModule;
  let mikroOrm: MikroORM;
  let entityService: EntityService;
  let entityManager: EntityManager;

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      imports: [MikroOrmModule.forRoot(), MikroOrmModule.forFeature([Entity])],
      providers: [EntityService],
    }).compile();

    mikroOrm = testingModule.get(MikroORM);
    entityService = testingModule.get(EntityService);
  });

  beforeEach(async () => {
    entityManager = mikroOrm.em.fork();
    Object.assign(entityService, { entityManager });
    await entityManager.begin();
  });

  afterEach(async () => {
    await entityManager.rollback();
  });

  afterAll(async () => {
    await testingModule.close();
  });

  describe('생성', () => {
    test('신규 엔티티를 생성한다.', async () => {
      const dto = await generateCreateEntityDto();
      const entity = await entityService.create(dto);

      expect(entity.id).toBeDefined();
    });
  });
});
```

## Transaction Rollback Pattern

Each test must run independently:

```typescript
beforeEach(async () => {
  entityManager = mikroOrm.em.fork();
  Object.assign(entityService, { entityManager });
  await entityManager.begin();  // Start transaction
});

afterEach(async () => {
  await entityManager.rollback();  // Rollback to clean data
});
```

## E2E Test Structure

```typescript
import { faker } from '@faker-js/faker';
import { type INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Logger } from 'nestjs-pino';
import request from 'supertest';
import { type App } from 'supertest/types';

import { AppModule } from '../src/app.module';

describe('E2E 테스트', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useLogger(app.get(Logger));
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('EntityController 테스트', () => {
    describe('(GET) /entities/:id', () => {
      test('엔티티를 조회한다.', async () => {
        const entityId = '019afbdc-b30f-771f-a859-7c17a7dea978';
        const response = await request(app.getHttpServer())
          .get(`/entities/${entityId}`)
          .expect(200);

        expect(response.body.id).toEqual(entityId);
      });

      test('존재하지 않는 엔티티를 조회한다.', async () => {
        await request(app.getHttpServer())
          .get(`/entities/${faker.string.uuid()}`)
          .expect(404);
      });
    });
  });
});
```

## Test Naming Conventions

### describe Blocks
- Top level: `{Service/Controller}Service 테스트`
- Feature level: Korean description of behavior (e.g., `사용자 생성`, `OTP 발송`)
- HTTP method: `(METHOD) /path/to/endpoint`

### test Blocks
- Write in Korean with specific scenario description
- End with `~한다.` format

```typescript
describe('사용자 생성', () => {
  test('신규 사용자를 생성한다.', async () => { });
  test('중복 사용자를 생성한다.', async () => { });
});
```

## DTO Generation Helper Functions

Generate test DTOs using helper functions:

```typescript
async function generateCreateUserDto(): Promise<CreateUserDto> {
  const dto = plainToInstance(CreateUserDto, {
    phoneNumber: faker.helpers.arrayElement([
      `+82101${faker.string.numeric(7)}`,
      `+81901${faker.string.numeric(7)}`,
    ]),
  });
  await validateOrReject(dto);
  return dto;
}
```

## Test Fixtures

Separate reusable test data into fixture files:

```typescript
// test/phone-number.fixture.ts
import { faker } from '@faker-js/faker';

export const PHONE_NUMBER_TEST_CASES = [
  { country: '한국', phoneNumber: () => `+82101${faker.string.numeric(7)}` },
  { country: '일본', phoneNumber: () => `+81901${faker.string.numeric(7)}` },
  { country: '중국', phoneNumber: () => `+86131${faker.string.numeric(8)}` },
];

export function generatePhoneNumber(): string {
  return faker.helpers.arrayElement(PHONE_NUMBER_TEST_CASES).phoneNumber();
}
```

## test.each Pattern

Repeat tests for multiple cases:

```typescript
test.each(PHONE_NUMBER_TEST_CASES)(
  '$country 전화번호로 OTP를 발송한다.',
  async ({ phoneNumber }) => {
    const result = await service.sendOtp({ phoneNumber: phoneNumber() });
    expect(result.message).toBe('OTP 발송 성공');
  }
);
```

## File Structure

```
src/
├── {module}/
│   └── {module}.service.spec.ts      # Service test
test/
└── app.e2e-spec.ts                   # E2E tests
```

## Vitest Configuration (vitest.config.ts)

```typescript
import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    globalSetup: 'vitest.globalSetup.ts',
    include: ['src/**/*.spec.ts', 'test/**/*.e2e-spec.ts'],
  },
  plugins: [swc.vite()],
});
```

## Global Setup (vitest.globalSetup.ts)

```typescript
import { MikroORM } from '@mikro-orm/core';

import { TestSeeder } from './mikro-orm.seeders';

export async function setup(): Promise<void> {
  const mikroOrm = await MikroORM.init();
  await mikroOrm.schema.ensureDatabase();
  await mikroOrm.schema.updateSchema();
  await mikroOrm.schema.clearDatabase();
  await mikroOrm.seeder.seed(TestSeeder);
  await mikroOrm.close();
}
```

