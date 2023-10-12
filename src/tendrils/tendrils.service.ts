import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { StatusOk } from 'src/types';
import { Tendril, Plant } from 'src/entities';
import { CreateTendrilDto } from './dto';

@Injectable()
export class TendrilsService {
  constructor(
    @InjectRepository(Tendril)
    private tendrilRepository: Repository<Tendril>,
    @InjectRepository(Plant)
    private plantRepository: Repository<Plant>,
  ) {}

  async createTendril(dto: CreateTendrilDto): Promise<StatusOk> {
    let plant = await this.plantRepository.findOne({
      where: { uuid: dto.plantUuid },
    });
    if (!plant) throw new BadRequestException('Plant does not exists');

    let tendril = this.tendrilRepository.create({
      title: dto.title,
      body: dto.body,
      plant,
    });
    tendril = await this.tendrilRepository.save(tendril);

    return {
      status: 201,
      message: `Tendril '{dto.title}' created successfully`,
    };
  }

  async getAllTendrils(plantUuid: string): Promise<StatusOk> {
    let plant: Plant = await this.plantRepository.findOne({
      where: { uuid: plantUuid },
    });

    if (!plant) throw new BadRequestException('Plant does not exists');

    let tendrils = await this.tendrilRepository.find({
      where: {
        plant: { uuid: plantUuid },
      },
    });

    return {
      status: 200,
      message: `Retrieved all tendrils for '${plant.username}'`,
      data: tendrils,
    };
  }

  async getTendrilByUuid(uuid: string): Promise<StatusOk<Tendril>> {
    let tendril = await this.tendrilRepository.findOne({
      where: { uuid },
    });

    if (!tendril) throw new BadRequestException('Tendril does not exists');

    return {
      status: 200,
      message: 'Retrieved tendril successfully',
      data: tendril,
    };
  }
}
