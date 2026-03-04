import { Expose, Transform, Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

import { EscapeWildcards, OmitEmpty, Trim } from '@/common/common.decorators';

import { FindOriginRes } from './find-origin.dto';

export class FindOriginsDto {
  @IsOptional()
  @IsString()
  @EscapeWildcards()
  @OmitEmpty()
  @Trim()
  url?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isActive?: boolean;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageNumber!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize!: number;
}

export class FindOriginsRes {
  @Expose()
  @Type(() => FindOriginRes)
  origins!: FindOriginRes[];

  @Expose()
  totalCount!: number;

  @Expose()
  pageNumber!: number;

  @Expose()
  pageSize!: number;

  @Expose()
  totalPages!: number;
}
