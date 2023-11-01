import { IRedisClientFactory } from './IRedisClientFactory';

export const RedisClientFactoryMock: IRedisClientFactory = {
    create: jest.fn(),
};
