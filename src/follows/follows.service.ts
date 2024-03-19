import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { pick } from 'src/helpers';
import { Plant, Follow } from 'src/entities';
import { StatusOk } from 'src/types';
import { PlantnameDto } from 'src/plants/dto';

@Injectable()
export class FollowsService {
  constructor(
    @InjectRepository(Plant)
    private plantsRepository: Repository<Plant>,
    @InjectRepository(Follow)
    private followRepository: Repository<Follow>,
  ) {}

  async toggleFollowing(dto: PlantnameDto, name: string): Promise<StatusOk> {
    let followFrom = await this.plantsRepository.findOne({
      relations: ['following'],
      where: { plantname: name },
    });
    if (!followFrom) throw new BadRequestException('Plant does not exists');

    let followTo = await this.plantsRepository.findOne({
      where: { plantname: dto.plantname },
    });
    if (!followTo)
      throw new BadRequestException(`Plant "${dto.plantname}" does not exists`);

    let follow = await this.followRepository.findOne({
      where: {
        to: { plantname: followTo.plantname },
        from: { plantname: followFrom.plantname },
      },
    });

    if (follow) {
      await this.followRepository.remove(follow);
    } else {
      const newFollow = this.followRepository.create({
        to: followTo,
        from: followFrom,
      });
      await this.followRepository.save(newFollow);
    }

    return {
      status: 201,
      message:
        (!follow ? 'F' : 'Unf') + `ollowed ${dto.plantname} successfully`,
      data: {
        to: { name: followTo.name, plantname: followTo.plantname },
        from: { name: followFrom.name, plantname: followFrom.plantname },
      },
    };
  }

  async getFollowing(plantname: string): Promise<StatusOk> {
    let following = await this.followRepository.find({
      where: { from: { plantname } },
      relations: ['to'],
      select: { id: false, to: { id: true, name: true, plantname: true } },
    });

    return {
      status: 201,
      message: 'Fetched following successfully',
      data: {
        plantname,
        following: following.map((f) => ({ ...f.to, createdAt: f.createdAt })),
      },
    };
  }

  async getFollowers(plantname: string): Promise<StatusOk> {
    let followers = await this.followRepository.find({
      where: { to: { plantname } },
      relations: ['from'],
      select: { id: false, from: { id: true, name: true, plantname: true } },
    });

    return {
      status: 201,
      message: 'Fetched followers successfully',
      data: {
        plantname,
        followers: followers.map((f) => ({
          ...f.from,
          createdAt: f.createdAt,
        })),
      },
    };
  }
}
