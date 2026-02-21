import { Transform, type TransformOptions } from 'class-transformer';

import { escapeWildcards } from './common.utils';

export function EscapeWildcards(): PropertyDecorator {
  return Transform(({ value }): string => {
    return typeof value === 'string' ? escapeWildcards(value) : value;
  });
}

export function OmitEmpty(options?: TransformOptions): PropertyDecorator {
  return Transform(({ value }): string | undefined => {
    return typeof value === 'string' && value === '' ? undefined : value;
  }, options);
}

export function Trim(): PropertyDecorator {
  return Transform(({ value }): string => {
    return typeof value === 'string' ? value.trim() : value;
  });
}
