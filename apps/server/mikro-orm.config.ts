import { Migrator } from '@mikro-orm/migrations';
import { defineConfig } from '@mikro-orm/postgresql';
import { SeedManager } from '@mikro-orm/seeder';
import { config } from 'dotenv';

config({
  path: `.env.${process.env.NODE_ENV}`,
  quiet: true,
});

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

export default defineConfig({
  dbName: process.env.POSTGRES_DB,
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  entities: ['dist/**/*.entity.js'],
  entitiesTs: isDevelopment() ? ['src/**/*.entity.ts'] : undefined,
  debug: isDevelopment(),
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
