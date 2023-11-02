import { IRedisClient } from './IRedisClient';
import { Inject } from '@nestjs/common';
import { RedisClientPool } from './RedisClientPool';
import { IRedisClientFactory } from './IRedisClientFactory';
import { IRedisConnectionPool } from './IRedisConnectionPool';

export class RedisConnectionPool implements IRedisConnectionPool {
  private readonly _busyRedisConnections: RedisClientPool[] = [];

  private readonly _freeRedisConnections: RedisClientPool[] = [];

  constructor(
    @Inject('RedisClientFactory')
    private readonly _redisClientFactory: IRedisClientFactory,
  ) {
    const redisMaxConnectionPool: number = parseInt(
      process.env.REDIS_MAX_CONNECTION_POOL || '0',
      10,
    );

    for (let i: number = 0; redisMaxConnectionPool > i; i++) {
      const redisClient: IRedisClient = this._redisClientFactory.create();
      this._freeRedisConnections.push(
        new RedisClientPool(redisClient.getHashCode(), redisClient),
      );
    }
  }

  public get(): IRedisClient {
    const hasAnyFreeRedisClient: boolean =
      this._freeRedisConnections.length > 0;

    const redisClientPool: RedisClientPool = hasAnyFreeRedisClient
      ? this._freeRedisConnections.pop()
      : this._busyRedisConnections.shift();

    redisClientPool.increaseConsumption();
    this._busyRedisConnections.push(redisClientPool);

    return redisClientPool.redisClient;
  }

  public dispose(redisClient: IRedisClient): void {
    const busyRedisClientIndex: number = this._busyRedisConnections.findIndex(
      (rc) => rc.hashCode === redisClient.getHashCode(),
    );

    if (busyRedisClientIndex !== -1) {
      const releasedRedisClient: RedisClientPool =
        this._busyRedisConnections[busyRedisClientIndex];
      releasedRedisClient.resetConsumption();
      this._busyRedisConnections.splice(busyRedisClientIndex, 1);
      this._freeRedisConnections.push(releasedRedisClient);
    }
  }
}
