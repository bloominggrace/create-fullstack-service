import { Expose } from 'class-transformer';
import { IsUrl } from 'class-validator';

export class CreateOriginDto {
  @IsUrl()
  url!: string;
}

export class CreateOriginRes {
  @Expose()
  id!: string;

  @Expose()
  url!: string;

  @Expose()
  isActive!: boolean;

  @Expose()
  createdAt?: Date;
}
