import { Body, Controller, Post, Get } from '@nestjs/common';
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

  @Get('followings')
  getFollowings(@Body() dto: PlantnameDto) {
    return this.plantsService.getFollowings(dto);
  }

  @Get('followers')
  getFollowers(@Body() dto: PlantnameDto) {
    return this.plantsService.getFollowers(dto);
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
