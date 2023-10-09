import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plant } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Plant])],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
