import { Test, TestingModule } from '@nestjs/testing';
import { HttpClientMock } from '../../../common/httpClient/HttpClient.mock';
import { IHttpClient } from '../../../common/httpClient/IHttpClient';
import { IRandomDataService } from './IRandomDataService';
import { RandomDataService } from './RandomData.service';
import { RandomUserDataDto } from './dto/RandomUserData.dto';
import { ServiceUnavailableException } from '@nestjs/common';

describe('RandomDataService', () => {
  let mockedModule: TestingModule;
  let randomDataService: IRandomDataService;
  let httpClient: IHttpClient;
  process.env = {
    RANDOM_USERS_API_URL: 'http://test.test/api',
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    mockedModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'HttpClient',
          useValue: { ...HttpClientMock },
        },
        {
          provide: 'RandomDataService',
          useClass: RandomDataService,
        },
      ],
    }).compile();

    randomDataService = mockedModule.get('RandomDataService');
    httpClient = mockedModule.get('HttpClient');
  });

  describe('getRandomUserData()', () => {
    const exampleResponse: RandomUserDataDto = {
      first_name: 'Test First Name',
      last_name: 'Test Last Name',
      username: 'Test Username',
      avatar: 'https://test.test/test.png',
      email: 'example@email.com',
    };

    it("should call http client with correct method and API url if cache doesn't exist", async () => {
      jest
        .spyOn(httpClient, 'get')
        .mockResolvedValueOnce({ status: 200, data: exampleResponse });
      await randomDataService.getRandomUserData();
      expect(httpClient.get).toBeCalledWith(process.env.RANDOM_USERS_API_URL);
    });

    it('should properly map the API response', async () => {
      jest
        .spyOn(httpClient, 'get')
        .mockResolvedValueOnce({ status: 200, data: exampleResponse });
      const result = await randomDataService.getRandomUserData();
      expect(result).toStrictEqual({
        firstName: exampleResponse.first_name,
        lastName: exampleResponse.last_name,
        username: exampleResponse.username,
        avatarUrl: exampleResponse.avatar,
        email: exampleResponse.email,
      });
    });

    it('should throw ServiceUnavailableException if http client returns invalid response', async () => {
      jest.spyOn(httpClient, 'get').mockResolvedValueOnce({
        status: 200,
        data: { ...exampleResponse, avatar: 'invalid url' },
      });
      await expect(randomDataService.getRandomUserData()).rejects.toThrow(
        ServiceUnavailableException,
      );
    });

    it('should throw ServiceUnavailableException if http client returns invalid response', async () => {
      jest.spyOn(httpClient, 'get').mockResolvedValueOnce(undefined);
      await expect(randomDataService.getRandomUserData()).rejects.toThrow(
        ServiceUnavailableException,
      );
    });
  });
});
