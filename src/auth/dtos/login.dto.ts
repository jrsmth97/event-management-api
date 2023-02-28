import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'username/email', example: 'gatotsu' })
  identity: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'password', example: 'password' })
  password: string;
}
