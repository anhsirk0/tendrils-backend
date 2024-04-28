import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { CommentService } from './comment.service';
import { AddCommentDto } from './dto';
import { Plantname } from 'src/plants/plant.decorator';
import { Independent } from 'src/auth/auth.guard';

@Controller('comment')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Post('add')
  addComment(@Body() dto: AddCommentDto, @Plantname() name: string) {
    return this.commentService.addComment(dto, name);
  }

  @Get(':uuid')
  @Independent()
  getCommentsByTendril(@Param('uuid') uuid: string) {
    return this.commentService.getCommentsByTendril(uuid);
  }
}
