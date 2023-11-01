import { RedisClient } from './RedisClient';
import { IRedisClient } from './IRedisClient';
import { IRedisClientFactory } from './IRedisClientFactory';

export class RedisClientFactory implements IRedisClientFactory {
  constructor() {}

  public create(): IRedisClient {
    return new RedisClient();
  }
}
