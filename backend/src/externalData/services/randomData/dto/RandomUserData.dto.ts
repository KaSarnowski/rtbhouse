import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsUrl } from 'class-validator';

export class RandomUserDataDto {
  @ApiProperty()
  @IsString()
  first_name: string;

  @ApiProperty()
  @IsString()
  last_name: string;

  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  @IsUrl()
  avatar: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;
}
