import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import { StatusOk } from 'src/types';

import { TendrilsService } from './tendrils.service';
import { CreateTendrilDto } from './dto';
import { Tendril } from 'src/entities';

@Controller('tendrils')
export class TendrilsController {
  constructor(private tendrilsService: TendrilsService) {}

  @Post('create')
  createTendril(@Body() dto: CreateTendrilDto): Promise<StatusOk> {
    return this.tendrilsService.createTendril(dto);
  }

  @Get('all/:plantUuid')
  getAllTendrils(@Param('plantUuid') plantUuid: string): Promise<StatusOk> {
    return this.tendrilsService.getAllTendrils(plantUuid);
  }

  @Get(':uuid')
  getTendrilByUuid(@Param('uuid') uuid: string): Promise<StatusOk<Tendril>> {
    return this.tendrilsService.getTendrilByUuid(uuid);
  }
}
