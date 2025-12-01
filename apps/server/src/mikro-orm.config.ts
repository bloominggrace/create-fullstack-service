import { Entity, PrimaryKey } from '@mikro-orm/core';
import { Migrator } from '@mikro-orm/migrations';
import { defineConfig } from '@mikro-orm/postgresql';
import { SeedManager } from '@mikro-orm/seeder';
import { config } from 'dotenv';

import { isProduction } from './app.utils';

config({
  path: `.env.${process.env.NODE_ENV}`,
});

// TODO: TestEntity는 실제 Entity가 추가된 뒤 삭제되어야 합니다.
@Entity()
export class TestEntity {
  @PrimaryKey()
  id!: number;
}

export const mikroOrmConfig = defineConfig({
  dbName: process.env.POSTGRES_DB_NAME,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  entities: ['dist/**/*.entity.js', TestEntity],
  entitiesTs: ['src/**/*.entity.ts'],
  debug: !isProduction(),
  validate: true,
  strict: true,
  extensions: [Migrator, SeedManager],
  migrations: {
    path: 'dist/migrations',
    pathTs: 'src/migrations',
    disableForeignKeys: false,
    emit: 'ts',
  },
  seeder: {
    path: 'dist/seeders',
    pathTs: 'src/seeders',
    emit: 'ts',
  },
});

export default mikroOrmConfig;
