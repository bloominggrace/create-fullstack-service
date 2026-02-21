import { type OriginFixture } from './test.types';

export const ORIGIN_FIXTURES: readonly OriginFixture[] = [
  { id: '019c7ecc-b93c-706e-8472-6a7f371e788e', url: 'https://bloomingchatbot.com', isActive: true },
  { id: '019c7ecc-7a91-7472-9521-bbe93ebe38fa', url: 'https://google.com', isActive: true },
  { id: '019c7ecc-b93c-7600-a4d8-c10cdd011999', url: 'https://bing.com', isActive: false },
  { id: '019c7ecc-b93c-7a96-ad59-408822d68b15', url: 'https://naver.com', isActive: false },
] as const;
