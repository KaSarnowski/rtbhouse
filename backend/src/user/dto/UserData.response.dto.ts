import { ApiProperty } from '@nestjs/swagger';
export class UserDataResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  avatarUrl: string;

  @ApiProperty()
  token: string;
}
