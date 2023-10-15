import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import { StatusOk } from 'src/types';

import { TendrilsService } from './tendrils.service';
import { AddCurlDto, CreateTendrilDto } from './dto';
import { Tendril } from 'src/entities';

@Controller('tendrils')
export class TendrilsController {
  constructor(private tendrilsService: TendrilsService) {}

  @Post('create')
  createTendril(@Body() dto: CreateTendrilDto): Promise<StatusOk> {
    return this.tendrilsService.createTendril(dto);
  }

  @Get('all/:plantname')
  getAllTendrils(@Param('plantname') plantname: string): Promise<StatusOk> {
    return this.tendrilsService.getAllTendrils(plantname);
  }

  @Get(':uuid')
  getTendrilByUuid(@Param('uuid') uuid: string): Promise<StatusOk<Tendril>> {
    return this.tendrilsService.getTendrilByUuid(uuid);
  }

  @Post('add-curl')
  addCurl(@Body() dto: AddCurlDto): Promise<StatusOk> {
    return this.tendrilsService.addCurl(dto);
  }
}
