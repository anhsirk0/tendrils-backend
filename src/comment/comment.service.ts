import { Injectable, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment, Plant, Tendril } from 'src/entities';
import { StatusOk } from 'src/types';
import { AddCommentDto } from './dto';
import { pick } from 'src/helpers';

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

  async getCommentsByTendril(uuid: string) {
    let tendril = await this.tendrilRepository.findOne({ where: { uuid } });
    if (!tendril) throw new BadRequestException('Tendril does not exists');

    const comments = await this.commentsRepository.find({
      where: { tendril: { uuid } },
      relations: { plant: true },
      select: { plant: { plantname: true, name: true } },
      order: { createdAt: 'DESC' },
    });

    return {
      status: 200,
      message: 'Retrieved tendril comments successfully',
      data: comments.map((c) => ({
        ...c,
        plant: pick(c.plant, 'plantname', 'name'),
      })),
    };
  }
}
