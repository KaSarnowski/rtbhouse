import { Test, TestingModule } from '@nestjs/testing';
import { ILoremIpsumService } from './ILoremIpsumService';
import { HttpClientMock } from '../../../common/httpClient/HttpClient.mock';
import { LoremIpsumService } from './LoremIpsum.service';
import { IHttpClient } from '../../../common/httpClient/IHttpClient';
import { RedisClientMock } from '../../../common/redis/RedisClient.mock';

describe('LoremIpsumService', () => {
  let mockedModule: TestingModule;
  let loremIpsumService: ILoremIpsumService;
  let httpClient: IHttpClient;
  process.env = {
    BASE_LOREM_IPSUM_API_URL: 'http://test.test/api',
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
          provide: 'RedisClient',
          useValue: { ...RedisClientMock },
        },
        {
          provide: 'LoremIpsumService',
          useClass: LoremIpsumService,
        },
      ],
    }).compile();

    loremIpsumService = mockedModule.get('LoremIpsumService');
    httpClient = mockedModule.get('HttpClient');
  });

  describe('getLoremIpsum()', () => {
    it('should attempt getting the data from cache', async () => {
      await loremIpsumService.getLoremIpsum(1, 1);
      expect(RedisClientMock.getValue).toBeCalledWith('loremIpsum_1_1');
    });

    it("should call http client with correct method and API url if cache doesn't exist", async () => {
      await loremIpsumService.getLoremIpsum(1, 1);
      expect(httpClient.get).toBeCalledWith(
        `${process.env.BASE_LOREM_IPSUM_API_URL}/1/short/prude/plaintext`,
      );
    });

    it('should return empty array if cache and http client return nothing', async () => {
      const result = await loremIpsumService.getLoremIpsum(1, 1);
      expect(result).toStrictEqual([]);
    });

    it('should return cached data if present', async () => {
      jest.spyOn(RedisClientMock, 'getValue').mockResolvedValueOnce(['test']);
      const result = await loremIpsumService.getLoremIpsum(1, 1);
      expect(result).toStrictEqual(['test']);
    });

    it('should not call http client if cache is present', async () => {
      jest.spyOn(RedisClientMock, 'getValue').mockResolvedValueOnce(['test']);
      await loremIpsumService.getLoremIpsum(1, 1);
      expect(httpClient.get).not.toBeCalled();
    });

    it('should cache data if cache is not present', async () => {
      jest.spyOn(RedisClientMock, 'getValue').mockResolvedValueOnce([]);
      jest
        .spyOn(httpClient, 'get')
        .mockResolvedValueOnce({ status: 200, data: 'test' });
      await loremIpsumService.getLoremIpsum(1, 1);
      expect(RedisClientMock.setValue).toBeCalledWith('loremIpsum_1_1', [
        'test',
      ]);
    });

    it('should return API response if cache is not present', async () => {
      jest.spyOn(RedisClientMock, 'getValue').mockResolvedValueOnce([]);
      jest
        .spyOn(httpClient, 'get')
        .mockResolvedValueOnce({ status: 200, data: 'test' });
      const result = await loremIpsumService.getLoremIpsum(1, 1);
      expect(result).toStrictEqual(['test']);
    });
  });
});
