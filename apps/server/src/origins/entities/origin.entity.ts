import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { uuidv7 } from 'uuidv7';

@Entity()
export class Origin {
  @PrimaryKey()
  id: string = uuidv7();

  @Property()
  @Unique()
  url!: string;

  @Property({ default: true })
  isActive?: boolean;

  @Property({ onCreate: () => new Date() })
  createdAt?: Date;

  @Property({ onCreate: () => new Date(), onUpdate: () => new Date() })
  updatedAt?: Date;
}
