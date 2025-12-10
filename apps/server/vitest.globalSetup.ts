import { MikroORM } from '@mikro-orm/core';

import { TestSeeder } from './mikro-orm.seeders';

export async function setup(): Promise<void> {
  const mikroOrm = await MikroORM.init();
  const schemaGenerator = mikroOrm.getSchemaGenerator();
  await schemaGenerator.ensureDatabase();
  await schemaGenerator.updateSchema();
  await schemaGenerator.clearDatabase();
  await mikroOrm.getSeeder().seed(TestSeeder);
  await mikroOrm.close();
}
