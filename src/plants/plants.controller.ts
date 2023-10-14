import { Body, Controller, Post } from '@nestjs/common';
import { StatusOk } from 'src/types';
import { PlantsService } from './plants.service';
import { UpdatePlantDto, DeletePlantDto, ChangePasswordDto } from './dto';

@Controller('plants')
export class PlantsController {
  constructor(private plantsService: PlantsService) {}

  @Post('change-password')
  changePassword(@Body() dto: ChangePasswordDto): Promise<StatusOk> {
    return this.plantsService.changePassword(dto);
  }

  @Post('update')
  update(@Body() dto: UpdatePlantDto): Promise<StatusOk> {
    return this.plantsService.updatePlant(dto);
  }

  @Post('delete')
  delete(@Body() dto: DeletePlantDto): Promise<StatusOk> {
    return this.plantsService.deletePlant(dto);
  }
}
