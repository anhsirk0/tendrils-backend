import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { pick } from 'src/helpers';
import { Plant } from 'src/entities';
import { StatusOk } from 'src/types';
import { UpdatePlantDto, DeletePlantDto, ChangePasswordDto } from './dto';

@Injectable()
export class PlantsService {
  constructor(
    @InjectRepository(Plant)
    private plantsRepository: Repository<Plant>,
  ) {}

  async updatePlant(dto: UpdatePlantDto, name: string): Promise<StatusOk> {
    let plant = await this.plantsRepository.findOne({
      where: { plantname: name },
    });

    if (!plant) throw new BadRequestException('Plant does not exists');

    plant = await this.plantsRepository.save({
      ...plant,
      ...dto,
      updatedAt: new Date().valueOf(),
    });

    return {
      status: 201,
      message: 'Updated plant successfully',
      data: { name: dto.name },
    };
  }

  async getProfile(plantname: string, name?: string): Promise<StatusOk> {
    const fields = {
      id: true,
      plantname: true,
      name: true,
      createdAt: true,
      avatarUrl: true,
    };
    let plant = await this.plantsRepository.findOne({
      // relations: ['followers', 'following', 'tendrils'],
      relations: {
        followers: { from: true },
        following: true,
        tendrils: true,
      },
      where: { plantname },
      select: {
        ...fields,
        tendrils: { id: true },
        followers: { from: { plantname: true } },
      },
    });

    if (!plant) throw new BadRequestException('Plant does not exists');

    return {
      status: 201,
      message: 'Fetched plant profile successfully',
      data: {
        ...pick(plant, ...(Object.keys(fields) as Array<keyof Plant>)),
        followingCount: plant.following.length,
        followersCount: plant.followers.length,
        tendrilsCount: plant.tendrils.length,
        isMe: name === plantname,
        isFollowed: name
          ? plant.followers.some((f) => f.from.plantname === name)
          : false,
      },
    };
  }

  async deletePlant(dto: DeletePlantDto, name: string): Promise<StatusOk> {
    let plant = await this.plantsRepository.findOne({
      where: { plantname: name },
    });

    if (!plant) throw new BadRequestException('Plant does not exists');

    let passMatch = await argon2.verify(plant.password, dto.password);
    if (!passMatch) throw new BadRequestException('Invalid Credentials');

    await this.plantsRepository.delete({ uuid: plant.uuid });

    return {
      status: 201,
      message: `Plant '${plant.plantname}' deleted successfully`,
    };
  }

  async changePassword(
    dto: ChangePasswordDto,
    name: string,
  ): Promise<StatusOk> {
    let plant = await this.plantsRepository.findOne({
      where: { plantname: name },
    });
    if (!plant) throw new BadRequestException('Plant does not exists');

    let passMatch = await argon2.verify(plant.password, dto.password);
    if (!passMatch) throw new BadRequestException('Invalid Credentials');

    let newPassMatch = await argon2.verify(plant.password, dto.newPassword);
    if (newPassMatch)
      throw new BadRequestException(
        "New password can't be same as the old one",
      );

    let newPasswordHash = await argon2.hash(dto.newPassword);

    plant = await this.plantsRepository.save({
      ...plant,
      password: newPasswordHash,
      updatedAt: new Date().valueOf(),
    });

    return {
      status: 201,
      message: `Password for '${name}' updated successfully`,
    };
  }
}
