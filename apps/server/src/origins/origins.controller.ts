import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { isUndefined, omitBy } from 'es-toolkit';

import { mapTo } from '@/common/common.utils';

import { UpdateOriginDto, UpdateOriginRes } from './dto';
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
    return mapTo(CreateOriginRes, await this.originsService.create(dto));
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
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<FindOriginRes> {
    return mapTo(FindOriginRes, await this.originsService.findOne({ id }));
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateOriginDto): Promise<UpdateOriginRes> {
    const origin = await this.originsService.findOne({ id });

    return mapTo(UpdateOriginRes, await this.originsService.update({ origin, ...dto }));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.originsService.remove(await this.originsService.findOne({ id }));
  }
}
