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
      provide: `RedisClientFactory`,
      useClass: RedisClientFactory,
    },
    {
      provide: `RedisConnectionPool`,
      useClass: RedisConnectionPool,
    },
    {
      scope: Scope.REQUEST,
      provide: `RedisClient`,
      useFactory: (redisConnectionPool: RedisConnectionPool): IRedisClient =>
        redisConnectionPool.get(),
      inject: [`RedisConnectionPool`],
    },
    {
      scope: Scope.REQUEST,
      provide: APP_INTERCEPTOR,
      useClass: RedisInterceptor,
    },
  ],
  exports: [`RedisClient`],
})
export class RedisClientModule {}
