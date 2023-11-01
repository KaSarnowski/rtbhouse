import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsUrl } from 'class-validator';

export class RandomUserDataDto {
  @ApiProperty()
  @IsString()
  readonly first_name: string;

  @ApiProperty()
  @IsString()
  readonly last_name: string;

  @ApiProperty()
  @IsString()
  readonly username: string;

  @ApiProperty()
  @IsString()
  @IsUrl()
  readonly avatar: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  readonly email: string;
}
