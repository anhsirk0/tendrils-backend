import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { FollowsService } from './follows.service';
import { Plantname } from 'src/plants/plant.decorator';
import { PlantnameDto } from 'src/plants/dto';
import { Public } from 'src/auth/auth.guard';

@Controller('follows')
export class FollowsController {
  constructor(private followsService: FollowsService) {}

  @Post('toggle-follow')
  toggleFollowing(@Body() dto: PlantnameDto, @Plantname() name: string) {
    return this.followsService.toggleFollowing(dto, name);
  }

  @Get('following/:plantname')
  getFollowing(@Param('plantname') plantname: string) {
    return this.followsService.getFollowing(plantname);
  }

  @Get('followers/:plantname')
  getFollowers(@Param('plantname') plantname: string) {
    return this.followsService.getFollowers(plantname);
  }
}
