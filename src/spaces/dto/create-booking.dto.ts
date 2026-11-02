import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  spaceId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;
}