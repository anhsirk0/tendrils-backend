import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTendrilDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;
}

export class AddCurlDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  tendrilUuid: string;
}
