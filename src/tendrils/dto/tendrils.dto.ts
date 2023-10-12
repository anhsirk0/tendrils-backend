import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTendrilDto {
  @IsString()
  @IsNotEmpty()
  plantUuid: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  body: string;
}
