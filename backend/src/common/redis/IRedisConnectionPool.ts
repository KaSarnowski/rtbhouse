import { IRedisClient } from './IRedisClient';

export interface IRedisConnectionPool {
  get(): IRedisClient;

  dispose(redisClient: IRedisClient): void;
}
