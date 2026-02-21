import { Expose } from 'class-transformer';

export class FindOriginRes {
  @Expose()
  id!: string;

  @Expose()
  url!: string;

  @Expose()
  isActive?: boolean;

  @Expose()
  createdAt?: Date;
}
