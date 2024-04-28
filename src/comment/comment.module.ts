import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tendril, Comment, Plant } from 'src/entities';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment]),
    TypeOrmModule.forFeature([Tendril]),
    TypeOrmModule.forFeature([Plant]),
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
