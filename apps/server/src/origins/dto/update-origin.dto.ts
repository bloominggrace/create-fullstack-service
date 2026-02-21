import { Expose } from 'class-transformer';
import { IsBoolean, IsOptional, IsUrl } from 'class-validator';

export class UpdateOriginDto {
  @IsOptional()
  @IsUrl()
  url?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateOriginRes {
  @Expose()
  id!: string;

  @Expose()
  url!: string;

  @Expose()
  isActive!: boolean;
}
