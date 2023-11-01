import {
  CallHandler,
  ExecutionContext,
  Inject,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { IRedisClient } from './IRedisClient';
import { IRedisConnectionPool } from './IRedisConnectionPool';

export class RedisInterceptor implements NestInterceptor {
  constructor(
    @Inject(`IRedisClient`)
    private readonly _redisClient: IRedisClient,

    @Inject(`IRedisConnectionPool`)
    private readonly _redisConnectionPool: IRedisConnectionPool,
  ) {}

  public intercept(
    _ctx: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    return next.handle().pipe(
      catchError((err) => {
        this.releaseConnection();
        return throwError(err);
      }),
      tap(() => this.releaseConnection()),
      map((data) => data),
    );
  }

  private releaseConnection(): void {
    this._redisConnectionPool.dispose(this._redisClient);
  }
}
