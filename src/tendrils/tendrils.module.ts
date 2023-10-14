import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// local imports
import { TendrilsService } from './tendrils.service';
import { TendrilsController } from './tendrils.controller';
import { Plant, Tendril, Curl } from 'src/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tendril]),
    TypeOrmModule.forFeature([Plant]),
    TypeOrmModule.forFeature([Curl]),
  ],
  providers: [TendrilsService],
  controllers: [TendrilsController],
})
export class TendrilsModule {}
