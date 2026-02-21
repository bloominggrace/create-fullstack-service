import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { ORIGIN_FIXTURES } from '@test/test.fixtures';

import { Dummy } from '@/entities/dummy.entity';
import { Origin } from '@/origins/entities';

export class TestSeeder extends Seeder {
  async run(entityManager: EntityManager): Promise<void> {
    await entityManager
      .persist([
        entityManager.create(Dummy, {
          id: 0,
        }),
        ...ORIGIN_FIXTURES.map((originFixture) => {
          return entityManager.create(Origin, originFixture);
        }),
      ])
      .flush();
  }
}
