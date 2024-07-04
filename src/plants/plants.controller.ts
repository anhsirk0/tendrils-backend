import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { PlantsService } from './plants.service';
import { Plantname } from './plant.decorator';
import { UpdatePlantDto, DeletePlantDto, ChangePasswordDto } from './dto';
import { Independent } from 'src/auth/auth.guard';

@Controller('plants')
export class PlantsController {
  constructor(private plantsService: PlantsService) {}

  @Independent()
  @Get('profile/:plantname')
  getProfile(@Param('plantname') plantname: string, @Plantname() name: string) {
    return this.plantsService.getProfile(plantname, name);
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

  @Independent()
  @Get('popular')
  getPopular() {
    return this.plantsService.getPopular();
  }
}
