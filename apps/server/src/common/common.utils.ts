import { type ClassConstructor, plainToInstance } from 'class-transformer';

export function escapeWildcards(input: string): string {
  return input.replace(/[%_\\]/g, '\\$&');
}

export function getTotalPages(totalCount: number, pageSize: number): number {
  return pageSize ? Math.ceil(totalCount / pageSize) : 0;
}

export function mapTo<T, I>(type: ClassConstructor<T>, instance: I): T {
  return plainToInstance(type, instance, {
    excludeExtraneousValues: true,
  });
}
