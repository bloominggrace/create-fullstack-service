import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';

import { Dummy } from './src/entities/dummy.entity';

export class TestSeeder extends Seeder {
  async run(entityManager: EntityManager): Promise<void> {
    await entityManager.persistAndFlush([
      entityManager.create(Dummy, {
        id: 0,
      }),
    ]);
  }
}
