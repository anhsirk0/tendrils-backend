import { Body, Controller, Get, Post, Param, Req } from '@nestjs/common';
import { Request } from 'express';
import { StatusOk } from 'src/types';
import { Plantname } from 'src/plants/plant.decorator';
import { TendrilsService } from './tendrils.service';
import { CreateTendrilDto } from './dto';
import { Pagination, getPaginateOptions } from 'src/paginate';
import { Independent } from 'src/auth/auth.guard';
import { FeedTendril } from './types';

@Controller('tendrils')
export class TendrilsController {
  constructor(private tendrilsService: TendrilsService) {}

  @Post('create')
  createTendril(@Body() dto: CreateTendrilDto, @Plantname() name: string) {
    return this.tendrilsService.createTendril(dto, name);
  }

  @Post('update/:uuid')
  updateTendril(
    @Body() dto: CreateTendrilDto,
    @Param('uuid') uuid: string,
    @Plantname() name: string,
  ) {
    return this.tendrilsService.updateTendril(dto, uuid, name);
  }

  @Get('all/:plantname')
  @Independent()
  getAllTendrils(
    @Param('plantname') plantname: string,
    @Req() request: Request,
  ) {
    return this.tendrilsService.getAllTendrils(
      plantname,
      getPaginateOptions(request.query),
    );
  }

  @Get('feed')
  getFeed(
    @Plantname() name: string,
    @Req() request: Request,
  ): Promise<StatusOk<Pagination<FeedTendril>>> {
    return this.tendrilsService.getFeed(
      name,
      getPaginateOptions(request.query),
    );
  }

  @Get(':uuid')
  @Independent()
  getTendrilByUuid(
    @Param('uuid') uuid: string,
  ): Promise<StatusOk<FeedTendril>> {
    return this.tendrilsService.getTendrilByUuid(uuid);
  }

  @Post('toggle-curl/:uuid')
  toggleCurl(@Plantname() plantname: string, @Param('uuid') uuid: string) {
    return this.tendrilsService.toggleCurl(plantname, uuid);
  }
}
