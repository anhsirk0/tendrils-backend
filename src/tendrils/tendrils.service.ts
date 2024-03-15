import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// local imports
import { StatusOk } from 'src/types';
import { Tendril, Plant, Curl } from 'src/entities';
import { AddCurlDto, CreateTendrilDto } from './dto';

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

    let curl = this.curlRepository.create({ plant });
    curl = await this.curlRepository.save(curl);

    let tendril = this.tendrilRepository.create({
      title: dto.title,
      content: dto.content,
      plant,
      curls: [curl],
    });
    tendril = await this.tendrilRepository.save(tendril);

    return {
      status: 201,
      message: `Tendril '${dto.title}' created successfully`,
    };
  }

  async getAllTendrils(plantname: string): Resp<Array<Tendril>> {
    let plant = await this.plantRepository.findOne({ where: { plantname } });
    if (!plant) throw new BadRequestException('Plant does not exists');

    let tendrils = await this.tendrilRepository.find({
      relations: ['curls'],
      where: { plant: { plantname } },
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

  async addCurl(dto: AddCurlDto, plantname: string): Resp {
    let plant = await this.plantRepository.findOne({ where: { plantname } });
    if (!plant) throw new BadRequestException('Plant does not exists');

    let tendril = await this.tendrilRepository.findOne({
      relations: ['curls', 'curls.plant'],
      where: { uuid: dto.tendrilUuid },
    });
    if (!tendril) throw new BadRequestException('Tendril does not exists');

    let newCurls = tendril.curls;
    let curl = await this.curlRepository.findOne({
      where: { plant: { uuid: plant.uuid }, tendril: { uuid: tendril.uuid } },
    });
    if (!curl) {
      curl = this.curlRepository.create({ plant });
      curl = await this.curlRepository.save(curl);
      newCurls = [curl, ...tendril.curls];
    } else {
      newCurls = newCurls.filter((c) => c.plant.uuid !== plant.uuid);
    }

    await this.tendrilRepository.save({ ...tendril, curls: newCurls });

    return {
      status: 201,
      message: `Tendril '${dto.tendrilUuid}' curled successfully`,
    };
  }
}
