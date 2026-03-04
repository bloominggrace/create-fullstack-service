import { type Origin } from '@/origins/entities';

export type OriginFixture = Omit<Origin, 'createdAt' | 'updatedAt'>;
