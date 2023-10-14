import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// local imports
import { StatusOk } from 'src/types';
import { Tendril, Plant, Curl } from 'src/entities';
import { CreateTendrilDto } from './dto';

@Injectable()
export class TendrilsService {
  constructor(
    @InjectRepository(Tendril)
    private tendrilRepository: Repository<Tendril>,
    @InjectRepository(Plant)
    private plantRepository: Repository<Plant>,
    @InjectRepository(Curl)
    private curlRepository: Repository<Curl>,
  ) {}

  async createTendril(dto: CreateTendrilDto): Promise<StatusOk> {
    let plant = await this.plantRepository.findOne({
      where: { plantname: dto.plantname },
    });
    if (!plant) throw new BadRequestException('Plant does not exists');

    let curl = this.curlRepository.create({
      plant,
    });
    curl = await this.curlRepository.save(curl);

    let tendril = this.tendrilRepository.create({
      title: dto.title,
      body: dto.body,
      plant,
      curls: [curl],
    });
    tendril = await this.tendrilRepository.save(tendril);

    return {
      status: 201,
      message: `Tendril '${dto.title}' created successfully`,
    };
  }

  async getAllTendrils(plantname: string): Promise<StatusOk> {
    let plant: Plant = await this.plantRepository.findOne({
      where: { plantname },
    });

    if (!plant) throw new BadRequestException('Plant does not exists');

    let tendrils = await this.tendrilRepository.find({
      relations: ['curls'],
      where: {
        plant: { plantname },
      },
    });

    return {
      status: 200,
      message: `Retrieved all tendrils for '${plant.plantname}'`,
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
