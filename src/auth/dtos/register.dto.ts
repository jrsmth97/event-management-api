import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'name', example: 'Gatotsu' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'username', example: 'gatotsu' })
  username: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ description: 'email', example: 'gatotsu@gmail.com' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'password', example: 'password' })
  password: string;
}
