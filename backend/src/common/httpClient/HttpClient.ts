import Axios, { AxiosResponse } from 'axios';
import {
  IHttpClient,
  IHttpClientRequestOptions,
  IHttpClientResponse,
} from './IHttpClient';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HttpClient implements IHttpClient {
  private readonly _defaultTimeout: number;

  constructor() {
    this._defaultTimeout = 120000;
  }

  public async get<ResponseData>(
    url: string,
    options?: IHttpClientRequestOptions,
  ): Promise<IHttpClientResponse<ResponseData>> {
    const response: AxiosResponse<ResponseData> = await Axios.get<ResponseData>(
      url,
      {
        headers: options ? options.headers : {},
        params: options ? options.params : {},
        timeout: options ? options.timeout : this._defaultTimeout,
        responseType: options ? options.responseType : 'json',
      },
    ).catch((error) => {
      throw error;
    });

    const { status, data } = response;

    return {
      status,
      data,
    };
  }
}
