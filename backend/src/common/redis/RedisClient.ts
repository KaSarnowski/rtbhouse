import * as Redis from 'redis';
import { IRedisClient } from './IRedisClient';
import { v4 } from 'uuid';

export class RedisClient implements IRedisClient {
  private readonly _redisClient: Redis.RedisClientType;
  private readonly _hashCode: string;
  private _initialized: boolean;

  constructor() {
    this._hashCode = v4();
    this._initialized = false;
    this._redisClient = Redis.createClient({
      url: this.getRedisConnectionUrl(),
    });
  }
  public async init(): Promise<void> {
    await this._redisClient.connect();
    await this._redisClient.CLIENT_SETNAME(`api_${this._hashCode}`);
    this._initialized = true;
  }
  public getHashCode(): string {
    return this._hashCode;
  }
  public async getValue<ValueType>(
    key: string,
  ): Promise<ValueType | undefined> {
    if (!this._initialized) {
      await this.init();
    }
    const jsonValue: string | undefined = await this._redisClient.get(key);

    if (!jsonValue) {
      return undefined;
    }

    return JSON.parse(jsonValue);
  }

  public async getValues<ValueType>(
    keys: string[],
  ): Promise<Array<ValueType | undefined>> {
    if (!this._initialized) {
      await this.init();
    }
    const jsonValues: string[] = await this._redisClient.mGet(keys);

    return jsonValues.map((jsonValue: string | null) => {
      if (!jsonValue) {
        return undefined;
      }

      return JSON.parse(jsonValue);
    });
  }

  public async setValue<ValueType>(
    key: string,
    value: ValueType,
    expirationInSecs: number,
  ): Promise<boolean> {
    if (!this._initialized) {
      await this.init();
    }
    const jsonValue: string = JSON.stringify(value);

    return !!(await this._redisClient.setEx(
      key,
      expirationInSecs ?? 3600,
      jsonValue,
    ));
  }

  public async deleteValue(key: string): Promise<boolean> {
    if (!this._initialized) {
      await this.init();
    }
    return !!(await this._redisClient.del(key));
  }

  private getRedisConnectionUrl(): string {
    return `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;
  }
}
