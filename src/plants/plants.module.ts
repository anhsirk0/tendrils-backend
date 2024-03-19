import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlantsController } from './plants.controller';
import { PlantsService } from './plants.service';
import { Plant, Follow } from 'src/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Plant]),
    TypeOrmModule.forFeature([Follow]),
  ],
  controllers: [PlantsController],
  providers: [PlantsService],
})
export class PlantsModule {}
