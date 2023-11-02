import { IRedisClient } from './IRedisClient';

export const RedisClientMock: IRedisClient = {
  getValue: jest.fn(),
  getValues: jest.fn(),
  setValue: jest.fn(),
  deleteValue: jest.fn(),
  getHashCode: jest.fn(),
  init: jest.fn(),
};
