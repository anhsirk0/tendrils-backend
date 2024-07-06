import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

// local imports
import { StatusOk } from 'src/types';
import { Tendril, Plant, Curl, Follow } from 'src/entities';
import { CreateTendrilDto } from './dto';
import { Pagination, PaginationOptions } from 'src/paginate';
import { FeedTendril } from './types';
import { toFeedTendril } from './helpers';

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
    @InjectRepository(Follow)
    private followRepository: Repository<Follow>,
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

  async updateTendril(dto: CreateTendrilDto, uuid: string, plantname: string) {
    let plant = await this.plantRepository.findOne({ where: { plantname } });
    if (!plant) throw new BadRequestException('Plant does not exists');

    let tendril = await this.tendrilRepository.findOne({ where: { uuid } });
    if (!tendril) throw new BadRequestException('Tendril does not exists');

    tendril = await this.tendrilRepository.save({
      ...tendril,
      title: dto.title,
      content: dto.content,
    });

    return {
      status: 201,
      message: `Tendril '${dto.title}' updated successfully`,
    };
  }

  async getAllTendrils(plantname: string, options: PaginationOptions) {
    let plant = await this.plantRepository.findOne({ where: { plantname } });
    if (!plant) throw new BadRequestException('Plant does not exists');

    const [result, total] = await this.tendrilRepository.findAndCount({
      take: options.take,
      skip: options.skip,
      where: { plant: { plantname } },
      relations: { curls: true, comments: true },
    });
    const data = result.map((tendril) => {
      let ft = {
        ...tendril,
        curls: tendril.curls.map((c) => c.plantname),
        commentsCount: tendril.comments.length,
      };
      delete ft.comments;
      return ft;
    });

    return {
      status: 200,
      message: `Retrieved all tendrils for '${plant.plantname}'`,
      data: new Pagination({ data, total }),
    };
  }

  async getFeed(
    plantname: string,
    options: PaginationOptions,
  ): Promise<StatusOk<Pagination<FeedTendril>>> {
    let following = await this.followRepository.find({
      where: { from: { plantname } },
      relations: { to: true },
      select: { id: true, to: { plantname: true } },
    });

    const names = following.map((f) => f.to.plantname);

    const [result, total] = await this.tendrilRepository.findAndCount({
      take: options.take,
      skip: options.skip,
      where: { plant: { plantname: In(names) } },
      relations: { curls: true, comments: true, plant: true },
      order: { createdAt: 'DESC' },
    });

    const data = result.map(toFeedTendril);

    return {
      status: 200,
      message: `Retrieved feed for '${plantname}'`,
      data: new Pagination<FeedTendril>({ data, total }),
    };
  }

  async getTendrilByUuid(uuid: string): Promise<StatusOk<FeedTendril>> {
    let tendril = await this.tendrilRepository.findOne({
      where: { uuid },
      relations: { curls: true, comments: true, plant: true },
    });
    if (!tendril) throw new BadRequestException('Tendril does not exists');

    return {
      status: 200,
      message: 'Retrieved tendril successfully',
      data: toFeedTendril(tendril),
    };
  }

  async toggleCurl(plantname: string, uuid: string) {
    let tendril = await this.tendrilRepository.findOne({ where: { uuid } });
    if (!tendril) throw new BadRequestException('Tendril does not exists');

    let curl = await this.curlRepository.findOne({
      where: { plantname, tendril: { uuid } },
    });

    if (curl) {
      await this.curlRepository.remove(curl);
    } else {
      const newCurl = this.curlRepository.create({ plantname, tendril });
      await this.curlRepository.save(newCurl);
    }
    return {
      status: 201,
      message: (!curl ? 'C' : 'Unc') + `urled ${uuid} successfully`,
      data: { plantname, uuid, isCurled: !curl },
    };
  }

  async getPopular(): Promise<StatusOk<Array<FeedTendril>>> {
    // TODO: Fix later
    let tendrils = await this.tendrilRepository
      .createQueryBuilder('tendril')
      .leftJoinAndSelect('tendril.comments', 'comment')
      .leftJoinAndSelect('tendril.plant', 'plant')
      .leftJoinAndSelect('tendril.curls', 'curl')
      .groupBy('curl.id')
      .orderBy('COUNT(curl.id)', 'DESC')
      .limit(20)
      .getMany();

    // console.log(tendrils.map((t) => t.curls.length));

    return {
      status: 200,
      message: 'Fetched popular tendrils successfully',
      data: tendrils.map(toFeedTendril),
    };
  }
}
