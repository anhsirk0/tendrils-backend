import { Body, Controller, Post, Get, Param, Req } from '@nestjs/common';
import { Request } from 'express';
import { FollowsService } from './follows.service';
import { StatusOk } from 'src/types';
import { Plantname } from 'src/plants/plant.decorator';
import { PlantnameDto } from 'src/plants/dto';
import { Pagination, getPaginateOptions } from 'src/paginate';
import { FollowItem } from './types';

@Controller('follows')
export class FollowsController {
  constructor(private followsService: FollowsService) {}

  @Post('toggle-follow')
  toggleFollowing(@Body() dto: PlantnameDto, @Plantname() name: string) {
    return this.followsService.toggleFollowing(dto, name);
  }

  @Get('following/:plantname')
  getFollowing(
    @Plantname() plantname: string,
    @Param('plantname') name: string,
    @Req() request: Request,
  ): Promise<StatusOk<Pagination<FollowItem>>> {
    return this.followsService.getFollowing(
      plantname,
      name,
      getPaginateOptions(request.query),
    );
  }

  @Get('followers/:plantname')
  getFollowers(
    @Plantname() plantname: string,
    @Param('plantname') name: string,
    @Req() request: Request,
  ): Promise<StatusOk<Pagination<FollowItem>>> {
    return this.followsService.getFollowers(
      plantname,
      name,
      getPaginateOptions(request.query),
    );
  }
}
