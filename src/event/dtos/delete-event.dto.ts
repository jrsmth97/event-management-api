import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class DeleteEventDto {
  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    description: 'Event Id',
    example: [1, 2],
  })
  eventId: number[];
}
