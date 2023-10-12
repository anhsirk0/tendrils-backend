import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// local imports
import { TendrilsService } from './tendrils.service';
import { TendrilsController } from './tendrils.controller';
import { Plant, Tendril } from 'src/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tendril]),
    TypeOrmModule.forFeature([Plant]),
  ],
  providers: [TendrilsService],
  controllers: [TendrilsController],
})
export class TendrilsModule {}
