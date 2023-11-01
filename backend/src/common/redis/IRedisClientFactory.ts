import { IRedisClient } from './IRedisClient';

export interface IRedisClientFactory {
  create(): IRedisClient;
}
