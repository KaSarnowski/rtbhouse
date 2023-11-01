import { Global, Module, Scope } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RedisInterceptor } from './Redis.interceptor';
import { RedisConnectionPool } from './RedisConnectionPool';
import { RedisClientFactory } from './RedisClientFactory';
import { IRedisClient } from './IRedisClient';

@Global()
@Module({
  providers: [
    {
      provide: `IRedisClientFactory`,
      useClass: RedisClientFactory,
    },
    {
      provide: `IRedisConnectionPool`,
      useClass: RedisConnectionPool,
    },
    {
      scope: Scope.REQUEST,
      provide: `IRedisClient`,
      useFactory: (redisConnectionPool: RedisConnectionPool): IRedisClient =>
        redisConnectionPool.get(),
      inject: [`IRedisConnectionPool`],
    },
    {
      scope: Scope.REQUEST,
      provide: APP_INTERCEPTOR,
      useClass: RedisInterceptor,
    },
  ],
  exports: [`IRedisClient`],
})
export class RedisClientModule {}
