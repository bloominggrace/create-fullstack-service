import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { AllowedOriginsService } from './allowed-origins.service';
import { Origin } from './entities';
import { OriginsController } from './origins.controller';
import { OriginsService } from './origins.service';

@Module({
  imports: [MikroOrmModule.forFeature([Origin])],
  controllers: [OriginsController],
  providers: [AllowedOriginsService, OriginsService],
  exports: [AllowedOriginsService],
})
export class OriginsModule {}
