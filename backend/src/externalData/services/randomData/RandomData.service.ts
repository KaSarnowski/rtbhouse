import { IRandomDataService, IRandomUserData } from './IRandomDataService';
import { Inject, ServiceUnavailableException } from '@nestjs/common';
import {
  IHttpClient,
  IHttpClientResponse,
} from '../../../common/httpClient/IHttpClient';
import { RandomUserDataDto } from './dto/RandomUserData.dto';

export class RandomDataService implements IRandomDataService {
  public constructor(
    @Inject('HttpClient')
    private readonly _httpClient: IHttpClient,
  ) {}
  public async getRandomUserData(): Promise<IRandomUserData> {
    const rawRandomUserData: IHttpClientResponse<RandomUserDataDto> =
      await this._httpClient.get<RandomUserDataDto>(
        process.env.RANDOM_USERS_API_URL,
      );
    if (!rawRandomUserData) {
      throw new ServiceUnavailableException('Random User API is unavailable');
    }
    return this.mapRandomUserDataDtoToRandomUserData(rawRandomUserData.data);
  }

  private mapRandomUserDataDtoToRandomUserData(
    randomUserDataDto: RandomUserDataDto,
  ): IRandomUserData {
    return {
      firstName: randomUserDataDto.first_name,
      lastName: randomUserDataDto.last_name,
      username: randomUserDataDto.username,
      email: randomUserDataDto.email,
      avatarUrl: randomUserDataDto.avatar,
    };
  }
}
