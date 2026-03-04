import { CanActivate, ExecutionContext, Injectable, Type, UnauthorizedException } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

export function Any(...guards: Type<CanActivate>[]): Type<CanActivate> {
  @Injectable()
  class AnyGuardMixin implements CanActivate {
    constructor(private readonly moduleRef: ModuleRef) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const results = await Promise.all(
        guards.map(async (Guard) => {
          const guard = await this.moduleRef.create(Guard);

          try {
            return { isAuthorized: !!(await guard.canActivate(context)) };
          } catch (error) {
            if (error instanceof UnauthorizedException) {
              return { isAuthorized: false, reason: error.message };
            }

            throw error;
          }
        }),
      );

      if (results.some((result) => result.isAuthorized)) {
        return true;
      }

      throw new UnauthorizedException(results.map((result) => result.reason));
    }
  }

  return AnyGuardMixin;
}
