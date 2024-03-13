import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { PlantsService } from './plants.service';
import { Plantname } from './plant.decorator';

import {
  UpdatePlantDto,
  DeletePlantDto,
  ChangePasswordDto,
  PlantnameDto,
} from './dto';

@Controller('plants')
export class PlantsController {
  constructor(private plantsService: PlantsService) {}

  @Post('toggle-follow')
  toggleFollowing(@Body() dto: PlantnameDto, @Plantname() name: string) {
    return this.plantsService.toggleFollowing(dto, name);
  }

  @Get('profile/:plantname')
  getProfile(@Param('plantname') plantname: string) {
    return this.plantsService.getProfile(plantname);
  }

  @Get('followings/:plantname')
  getFollowings(@Param('plantname') plantname: string) {
    return this.plantsService.getFollowings(plantname);
  }

  @Get('followers/:plantname')
  getFollowers(@Param('plantname') plantname: string) {
    return this.plantsService.getFollowers(plantname);
  }

  @Post('change-password')
  changePassword(@Body() dto: ChangePasswordDto, @Plantname() name: string) {
    return this.plantsService.changePassword(dto, name);
  }

  @Post('update')
  update(@Body() dto: UpdatePlantDto, @Plantname() name: string) {
    return this.plantsService.updatePlant(dto, name);
  }

  @Post('delete')
  delete(@Body() dto: DeletePlantDto, @Plantname() name: string) {
    return this.plantsService.deletePlant(dto, name);
  }
}
