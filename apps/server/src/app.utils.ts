import { type ClassConstructor, plainToInstance } from 'class-transformer';

export function mapTo<T, I>(type: ClassConstructor<T>, instance: I): T {
  return plainToInstance(type, instance, {
    excludeExtraneousValues: true,
  });
}
