import { IRedisClient } from './IRedisClient';

export class RedisClientPool {
  private _currentConsumption: number = 0;

  constructor(
    public readonly hashCode: string,
    public readonly redisClient: IRedisClient,
  ) {}

  public increaseConsumption(): void {
    if (this._currentConsumption === Number.MAX_SAFE_INTEGER) {
      this.resetConsumption();
    }
    this._currentConsumption += 1;
  }

  public resetConsumption(): void {
    this._currentConsumption = 0;
  }
}
