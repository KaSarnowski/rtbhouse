import { ILoremIpsumService } from './ILoremIpsumService';
import { Inject } from '@nestjs/common';
import { IHttpClient } from '../../../common/httpClient/IHttpClient';
import { IRedisClient } from '../../../common/redis/IRedisClient';

export class LoremIpsumService implements ILoremIpsumService {
  public constructor(
    @Inject('HttpClient')
    private readonly _httpClient: IHttpClient,

    @Inject('RedisClient')
    private readonly _redisClient: IRedisClient,
  ) {}

  public async getLoremIpsum(lines: number, userId: number): Promise<any> {
    const cachedLoremIpsum: string[] = await this.getCachedLoremIpsum(
      userId,
      lines,
    );

    const loremIpsum: string[] =
      cachedLoremIpsum.length > 0
        ? cachedLoremIpsum
        : await this.getNewLoremIpsum(lines);

    if (cachedLoremIpsum.length === 0 && loremIpsum.length > 0) {
      await this.cacheLoremIpsum(userId, lines, loremIpsum);
    }
    return loremIpsum;
  }

  private async getNewLoremIpsum(lines: number): Promise<string[]> {
    try {
      const rawLoremIpsum: string | undefined = (
        await this._httpClient.get<string>(
          `${process.env.BASE_LOREM_IPSUM_API_URL}/${lines}/short/prude/plaintext`,
        )
      )?.data;
      if (!rawLoremIpsum) {
        return [];
      }

      return rawLoremIpsum.split('\n').filter((line) => line.length > 0);
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  private async getCachedLoremIpsum(
    userId: number,
    lines: number,
  ): Promise<string[]> {
    return (
      (await this._redisClient.getValue<string[]>(
        `loremIpsum_${userId}_${lines}`,
      )) || []
    );
  }

  private async cacheLoremIpsum(
    userId: number,
    lines: number,
    loremIpsum: string[],
  ): Promise<void> {
    await this._redisClient.setValue(
      `loremIpsum_${userId}_${lines}`,
      loremIpsum,
    );
  }
}
