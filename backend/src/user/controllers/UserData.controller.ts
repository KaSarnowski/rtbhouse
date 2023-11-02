import { Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { JwtService } from '../../common/auth/Jwt.service';
import { UserDataResponseDto } from '../dto/UserData.response.dto';
import {
  IUserData,
  IUserDataService,
} from '../services/userData/IUserDataService';
import { AuthGuard } from '../../common/auth/Auth.guard';
import { AuthData } from '../../common/auth/AuthData.decorator';
import { IUserRequestData } from '../../common/models/IUserRequestData';

@Controller('userData')
export class UserDataController {
  constructor(
    @Inject('JwtService')
    private readonly _jwtService: JwtService,

    @Inject('UserDataService')
    private readonly _userDataService: IUserDataService,
  ) {}

  @Get()
  public async getUserData(): Promise<UserDataResponseDto> {
    const userData: IUserData = await this._userDataService.getNewUserData();
    return {
      ...userData,
      token: this._jwtService.generateToken<IUserRequestData>({
        id: userData.id,
      }),
    };
  }

  @Post('/avatar/seen')
  @UseGuards(AuthGuard)
  public async setAvatarSeen(
    @AuthData() authData: IUserRequestData,
  ): Promise<void> {
    await this._userDataService.setAvatarSeen(authData.id);
  }

  @Get('/stats')
  public async getUserStats(): Promise<any> {
    return await this._userDataService.getUserStats();
  }
}
