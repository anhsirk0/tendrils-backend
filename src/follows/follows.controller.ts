import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { FollowsService } from './follows.service';
import { Plantname } from 'src/plants/plant.decorator';
import { PlantnameDto } from 'src/plants/dto';

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
  ) {
    return this.followsService.getFollowing(plantname, name);
  }

  @Get('followers/:plantname')
  getFollowers(
    @Plantname() plantname: string,
    @Param('plantname') name: string,
  ) {
    return this.followsService.getFollowers(plantname, name);
  }
}
