import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowsController } from './follows.controller';
import { FollowsService } from './follows.service';
import { Follow, Plant } from 'src/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Plant]),
    TypeOrmModule.forFeature([Follow]),
  ],
  controllers: [FollowsController],
  providers: [FollowsService],
})
export class FollowsModule {}
