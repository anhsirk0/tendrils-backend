import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plant, Follow } from 'src/entities';
import { StatusOk } from 'src/types';
import { PlantnameDto } from 'src/plants/dto';
import { pick } from 'src/helpers';

@Injectable()
export class FollowsService {
  constructor(
    @InjectRepository(Plant)
    private plantRepository: Repository<Plant>,
    @InjectRepository(Follow)
    private followRepository: Repository<Follow>,
  ) {}

  async toggleFollowing(dto: PlantnameDto, name: string): Promise<StatusOk> {
    let followFrom = await this.plantRepository.findOne({
      relations: ['following'],
      where: { plantname: name },
    });
    if (!followFrom) throw new BadRequestException('Plant does not exists');

    let followTo = await this.plantRepository.findOne({
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

  async getFollowing(plantname: string, name: string): Promise<StatusOk> {
    let meFollowing = await this.followRepository.find({
      where: { from: { plantname } },
      relations: ['to'],
      select: { id: false, to: { id: true, name: true, plantname: true } },
    });

    let following = await this.followRepository.find({
      where: { from: { plantname: name } },
      relations: ['to'],
      select: {
        id: false,
        to: { id: true, name: true, plantname: true, avatarUrl: true },
      },
    });

    return {
      status: 201,
      message: 'Fetched following successfully',
      data: {
        plantname,
        following: following.map((f) => ({
          ...pick(f.to, 'id', 'name', 'plantname', 'avatarUrl'),
          createdAt: f.createdAt,
          isFollowed: meFollowing.some((pf) => pf.to.id === f.to.id),
          isMe: f.to.plantname === plantname,
        })),
      },
    };
  }

  async getFollowers(plantname: string, name: string): Promise<StatusOk> {
    let meFollowing = await this.followRepository.find({
      where: { from: { plantname } },
      relations: ['to'],
      select: { id: false, to: { id: true, name: true, plantname: true } },
    });
    let followers = await this.followRepository.find({
      where: { to: { plantname: name } },
      relations: ['from'],
      select: {
        id: false,
        from: { id: true, name: true, plantname: true, avatarUrl: true },
      },
    });

    return {
      status: 201,
      message: 'Fetched followers successfully',
      data: {
        plantname,
        followers: followers.map((f) => ({
          ...pick(f.from, 'id', 'name', 'plantname', 'avatarUrl'),
          createdAt: f.createdAt,
          isFollowed: meFollowing.some((pf) => pf.to.id === f.from.id),
          isMe: f.from.plantname === plantname,
        })),
      },
    };
  }
}
