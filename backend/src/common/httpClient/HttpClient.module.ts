import { Global, Module } from '@nestjs/common';
import { HttpClient } from './HttpClient';

@Global()
@Module({
  providers: [
    {
      provide: 'HttpClient',
      useClass: HttpClient,
    },
  ],
  exports: ['HttpClient'],
})
export class HttpClientModule {}
