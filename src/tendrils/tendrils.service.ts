import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// local imports
import { StatusOk } from 'src/types';
import { Tendril, Plant, Curl } from 'src/entities';
import { AddCurlDto, CreateTendrilDto } from './dto';
import { Pagination, PaginationOptions } from 'src/paginate';

type Resp<T = any> = Promise<StatusOk<T>>;

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

  async createTendril(dto: CreateTendrilDto, plantname: string): Resp {
    let plant = await this.plantRepository.findOne({ where: { plantname } });
    if (!plant) throw new BadRequestException('Plant does not exists');

    let tendril = this.tendrilRepository.create({
      title: dto.title,
      content: dto.content,
      plant,
    });
    tendril = await this.tendrilRepository.save(tendril);
    let curl = this.curlRepository.create({
      plantname: plant.plantname,
      tendril,
    });
    curl = await this.curlRepository.save(curl);

    return {
      status: 201,
      message: `Tendril '${dto.title}' created successfully`,
    };
  }

  async getAllTendrils(
    plantname: string,
    options: PaginationOptions,
  ): Resp<Pagination<Tendril>> {
    let plant = await this.plantRepository.findOne({ where: { plantname } });
    if (!plant) throw new BadRequestException('Plant does not exists');

    const [data, total] = await this.tendrilRepository.findAndCount({
      take: options.take,
      skip: options.skip,
      where: { plant: { plantname } },
      relations: { curls: true },
      select: { curls: { plantname: true } },
    });

    return {
      status: 200,
      message: `Retrieved all tendrils for '${plant.plantname}'`,
      data: new Pagination<Tendril>({ data, total }),
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
