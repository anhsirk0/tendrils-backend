import { Injectable, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment, Plant, Tendril } from 'src/entities';
import { StatusOk } from 'src/types';
import { AddCommentDto } from './dto';
import { pick } from 'src/helpers';
import { Pagination, PaginationOptions } from 'src/paginate';
import { CommentItem } from './types';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    @InjectRepository(Tendril)
    private tendrilRepository: Repository<Tendril>,
    @InjectRepository(Plant)
    private plantRepository: Repository<Plant>,
  ) {}

  async addComment(dto: AddCommentDto, plantname: string): Promise<StatusOk> {
    let plant = await this.plantRepository.findOne({ where: { plantname } });
    if (!plant) throw new BadRequestException('Plant does not exists');

    let tendril = await this.tendrilRepository.findOne({
      where: { uuid: dto.uuid },
    });
    if (!tendril) throw new BadRequestException('Tendril does not exists');

    let comment = this.commentsRepository.create({
      tendril,
      plant,
      content: dto.content,
    });
    comment = await this.commentsRepository.save(comment);

    return {
      status: 201,
      message: 'Comment added successfully',
      data: comment,
    };
  }

  async getCommentsByTendril(
    uuid: string,
    options: PaginationOptions,
  ): Promise<StatusOk<Pagination<CommentItem>>> {
    let tendril = await this.tendrilRepository.findOne({ where: { uuid } });
    if (!tendril) throw new BadRequestException('Tendril does not exists');

    const [result, total] = await this.commentsRepository.findAndCount({
      ...options,
      where: { tendril: { uuid } },
      relations: { plant: true },
      select: { plant: { plantname: true, name: true, avatarUrl: true } },
      order: { createdAt: 'DESC' },
    });

    const data = result.map<CommentItem>((comment) => ({
      ...comment,
      plant: pick(comment.plant, 'plantname', 'name', 'avatarUrl'),
    }));

    return {
      status: 200,
      message: 'Fetched tendril comments successfully',
      data: new Pagination<CommentItem>({ data, total }),
    };
  }
}
