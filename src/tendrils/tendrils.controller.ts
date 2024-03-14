import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import { StatusOk } from 'src/types';
import { Plantname } from 'src/plants/plant.decorator';

import { TendrilsService } from './tendrils.service';
import { AddCurlDto, CreateTendrilDto } from './dto';
import { Tendril } from 'src/entities';

@Controller('tendrils')
export class TendrilsController {
  constructor(private tendrilsService: TendrilsService) {}

  @Post('create')
  createTendril(@Body() dto: CreateTendrilDto, @Plantname() name: string) {
    return this.tendrilsService.createTendril(dto, name);
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
  addCurl(@Body() dto: AddCurlDto, @Plantname() plantname: string) {
    return this.tendrilsService.addCurl(dto, plantname);
  }
}
