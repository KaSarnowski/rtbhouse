import { IRandomDataService, IRandomUserData } from './IRandomDataService';
import { Inject, ServiceUnavailableException } from '@nestjs/common';
import {
  IHttpClient,
  IHttpClientResponse,
} from '../../../common/httpClient/IHttpClient';
import { RandomUserDataDto } from './dto/RandomUserData.dto';
import { validate, ValidationError } from 'class-validator';

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

    await this.validateRandomUserData(rawRandomUserData);

    return this.mapRandomUserDataDtoToRandomUserData(rawRandomUserData.data);
  }

  private async validateRandomUserData(
    httpResponse: IHttpClientResponse<RandomUserDataDto>,
  ): Promise<void> {
    const randomUserDataDto: RandomUserDataDto = new RandomUserDataDto();
    randomUserDataDto.first_name = httpResponse.data.first_name;
    randomUserDataDto.last_name = httpResponse.data.last_name;
    randomUserDataDto.username = httpResponse.data.username;
    randomUserDataDto.avatar = httpResponse.data.avatar;
    randomUserDataDto.email = httpResponse.data.email;

    const errors: ValidationError[] = await validate(randomUserDataDto);
    if (errors.length > 0) {
      throw new ServiceUnavailableException(
        `Random User API returned invalid data: ${JSON.stringify(
          errors.map((error) => error.constraints),
        )}`,
      );
    }
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
