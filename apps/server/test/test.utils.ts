import { faker } from '@faker-js/faker';
import { sample } from 'es-toolkit';
import { isMatch } from 'es-toolkit/compat';

import { ORIGIN_FIXTURES } from './test.fixtures';
import { type OriginFixture } from './test.types';

export class Random {
  static originFixture(criteria: Partial<OriginFixture> = {}): OriginFixture {
    const originFixture = sample(
      ORIGIN_FIXTURES.filter((originFixture) => {
        return isMatch(originFixture, criteria);
      }),
    );

    if (!originFixture) {
      throw new Error('조건에 맞는 오리진이 없습니다.');
    }

    return originFixture;
  }

  static uuid(): string {
    return faker.string.uuid();
  }

  static url(): string {
    return faker.internet.url();
  }
}
