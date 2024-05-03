import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { Plant } from 'src/entities';
import { StatusOk } from 'src/types';
import { SigninDto, SignupDto } from './dto';
import { pick } from 'src/helpers';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Plant)
    private plantsRepository: Repository<Plant>,
    private jwtService: JwtService,
  ) {}

  // async remove(id: string): Promise<void> {
  //   await this.plantsRepository.delete(id);
  // }

  async signin(dto: SigninDto): Promise<StatusOk> {
    let plant: Plant;
    plant = await this.plantsRepository.findOne({
      where: { plantname: dto.plantname },
    });

    if (!plant) throw new BadRequestException('Plant does not exists');

    let passMatch: boolean;
    passMatch = await argon2.verify(plant.password, dto.password);

    if (!passMatch) throw new UnauthorizedException('Invalid Credentials');

    const token = await this.jwtService.signAsync({
      sub: plant.uuid,
      username: plant.plantname,
    });
    return {
      status: 201,
      message: 'Login successful',
      data: { ...pick(plant, 'id', 'name', 'plantname', 'avatarUrl'), token },
    };
  }

  async signup(dto: SignupDto): Promise<StatusOk> {
    let plant: Plant;
    plant = await this.plantsRepository.findOne({
      where: { plantname: dto.plantname },
    });

    if (plant) throw new BadRequestException('Account already exists');

    plant = this.plantsRepository.create({ ...dto, bio: '', avatarUrl: '' });
    plant = await this.plantsRepository.save(plant);

    return {
      status: 201,
      message: `Plant '${dto.plantname}' created successfully`,
    };
  }
}
