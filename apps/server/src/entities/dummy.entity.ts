import { Entity, PrimaryKey } from '@mikro-orm/core';

// TODO: Dummy 실제 Entity가 추가된 뒤 삭제되어야 합니다.
@Entity()
export class Dummy {
  @PrimaryKey()
  id!: number;
}
