import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  plantname: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class SigninDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  plantname: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}
