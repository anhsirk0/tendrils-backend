import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// local imports
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Plant } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Plant])],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
