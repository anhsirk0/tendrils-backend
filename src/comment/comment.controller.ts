import { Controller, Post, Get, Body, Param, Req } from '@nestjs/common';
import { Request } from 'express';
import { CommentService } from './comment.service';
import { AddCommentDto } from './dto';
import { Plantname } from 'src/plants/plant.decorator';
import { Independent } from 'src/auth/auth.guard';
import { Pagination, getPaginateOptions } from 'src/paginate';
import { CommentItem } from './types';
import { StatusOk } from 'src/types';

@Controller('comment')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Post('add')
  addComment(@Body() dto: AddCommentDto, @Plantname() name: string) {
    return this.commentService.addComment(dto, name);
  }

  @Get(':uuid')
  @Independent()
  getCommentsByTendril(
    @Param('uuid') uuid: string,
    @Req() request: Request,
  ): Promise<StatusOk<Pagination<CommentItem>>> {
    return this.commentService.getCommentsByTendril(
      uuid,
      getPaginateOptions(request.query),
    );
  }
}
