import { IsString, IsNotEmpty, IsNumber, IsPositive, Min } from 'class-validator';

export class CreateSpaceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsPositive()
  pricePerHour: number;

  @IsNumber()
  @Min(1)
  capacity: number;
}