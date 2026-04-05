import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { ORIGIN_FIXTURES } from '@test/test.fixtures';

import { Origin } from '@/origins/entities';

export class TestSeeder extends Seeder {
  async run(entityManager: EntityManager): Promise<void> {
    await entityManager
      .persist([
        ...ORIGIN_FIXTURES.map((originFixture) => {
          return entityManager.create(Origin, originFixture);
        }),
      ])
      .flush();
  }
}
