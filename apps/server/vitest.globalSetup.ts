// @ts-expect-error no type declarations
import '@swc-node/register/esm-register';

import { MikroORM } from '@mikro-orm/core';

import mikroOrmConfig from './mikro-orm.config';
import { TestSeeder } from './mikro-orm.seeders';

export async function setup(): Promise<void> {
  const mikroOrm = await MikroORM.init(mikroOrmConfig);

  await mikroOrm.schema.ensureDatabase();
  await mikroOrm.schema.update();
  await mikroOrm.schema.clear();
  await mikroOrm.seeder.seed(TestSeeder);
  await mikroOrm.close();
}
