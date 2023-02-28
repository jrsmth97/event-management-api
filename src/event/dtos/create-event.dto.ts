import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Event Name',
    example: 'Event 1',
  })
  eventName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'date', example: '2023-03-10' })
  date: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'time', example: '10:00' })
  time: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'location', example: 'Surakarta' })
  location: string;

  @ApiProperty({ description: 'event image', type: 'string', format: 'binary' })
  image: any;
}
