import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { isUndefined, omitBy } from 'es-toolkit';

import { mapTo } from '@/common/common.utils';
import { UpdateOriginDto, UpdateOriginRes } from '@/origins/dto/update-origin.dto';

import {
  CreateOriginDto,
  CreateOriginRes,
  FindOriginRes,
  FindOriginsDto,
  FindOriginsRes,
  SearchOriginsDto,
  SearchOriginsRes,
} from './dto';
import { OriginsService } from './origins.service';

@Controller('v1/origins')
export class OriginsController {
  constructor(private readonly originsService: OriginsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateOriginDto): Promise<CreateOriginRes> {
    const { origin } = await this.originsService.create(dto);

    return mapTo(CreateOriginRes, origin);
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  async search(@Query() dto: SearchOriginsDto): Promise<SearchOriginsRes> {
    return mapTo(SearchOriginsRes, await this.originsService.search(dto));
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() dto: FindOriginsDto): Promise<FindOriginsRes> {
    const { pageNumber, pageSize, ...where } = dto;

    return mapTo(
      FindOriginsRes,
      await this.originsService.findAll({ where: omitBy(where, isUndefined), pageNumber, pageSize }),
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<FindOriginRes> {
    const { origin } = await this.originsService.findOne({ id });

    return mapTo(FindOriginRes, origin);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() dto: UpdateOriginDto): Promise<UpdateOriginRes> {
    const { origin } = await this.originsService.findOne({ id });

    await this.originsService.update({ origin, ...dto });

    return mapTo(UpdateOriginRes, origin);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string): Promise<void> {
    const { origin } = await this.originsService.findOne({ id });

    await this.originsService.delete({ origin });
  }
}
