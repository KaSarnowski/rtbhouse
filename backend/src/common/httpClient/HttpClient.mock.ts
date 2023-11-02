import { IHttpClient } from './IHttpClient';

export const HttpClientMock: IHttpClient = {
  get: jest.fn(),
};
