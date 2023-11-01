export interface IRedisClient {
  getValue<ValueType>(key: string): Promise<ValueType | undefined>;
  getValues<ValueType>(keys: string[]): Promise<Array<ValueType | undefined>>;
  setValue<ValueType>(
    key: string,
    value: ValueType,
    expirationInSecs?: number,
  ): Promise<boolean>;
  deleteValue(key: string): Promise<boolean>;
  getHashCode(): string;
  init(): Promise<void>;
}
