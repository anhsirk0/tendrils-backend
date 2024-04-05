import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tendril, Comment } from 'src/entities';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment]),
    TypeOrmModule.forFeature([Tendril]),
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
