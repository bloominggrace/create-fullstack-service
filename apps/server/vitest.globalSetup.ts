import { MikroORM } from '@mikro-orm/core';

import mikroOrmConfig from './mikro-orm.config';
import { TestSeeder } from './mikro-orm.seeders';

export async function setup(): Promise<void> {
  const mikroOrm = await MikroORM.init(mikroOrmConfig);
  await mikroOrm.schema.ensureDatabase();
  await mikroOrm.schema.updateSchema();
  await mikroOrm.schema.clearDatabase();
  await mikroOrm.seeder.seed(TestSeeder);
  await mikroOrm.close();
}
