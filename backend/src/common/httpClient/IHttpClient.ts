export interface IHttpClientResponse<ResponseData> {
  status: number;
  data: ResponseData;
}

export interface IHttpClient {
  get<ResponseData>(
    url: string,
    options?: IHttpClientRequestOptions,
  ): Promise<IHttpClientResponse<ResponseData>>;
}

export interface IHttpClientRequestOptions {
  headers?: {
    [header: string]: string;
  };
  params?: URLSearchParams | IHttpClientCustomParams;
  timeout?: number;
  responseType?: ResponseType;
}

export interface IHttpClientCustomParams {
  [param: string]: string | number | boolean | number[];
}

export type ResponseType =
  | 'arraybuffer'
  | 'blob'
  | 'document'
  | 'json'
  | 'text'
  | 'stream';
