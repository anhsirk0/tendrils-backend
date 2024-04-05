import { Injectable, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment, Tendril } from 'src/entities';
import { StatusOk } from 'src/types';
import { AddCommentDto } from './dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    @InjectRepository(Tendril)
    private tendrilRepository: Repository<Tendril>,
  ) {}

  async addComment(dto: AddCommentDto, plantname: string): Promise<StatusOk> {
    let tendril = await this.tendrilRepository.findOne({
      where: { uuid: dto.uuid },
    });
    if (!tendril) throw new BadRequestException('Tendril does not exists');

    let comment = this.commentsRepository.create({
      tendril,
      plantname,
      content: dto.content,
    });
    comment = await this.commentsRepository.save(comment);

    return {
      status: 201,
      message: 'Comment added successfully',
      data: comment,
    };
  }

  async getCommentsByTendril(uuid: string) {
    let tendril = await this.tendrilRepository.findOne({
      where: { uuid },
    });
    if (!tendril) throw new BadRequestException('Tendril does not exists');
    const comments = await this.commentsRepository.find({
      where: { tendril: { uuid } },
    });

    return {
      status: 200,
      message: 'Retrieved tendril comments successfully',
      data: comments,
    };
  }
}
