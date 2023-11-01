import { Module } from '@nestjs/common';
import { RandomDataService } from './RandomData.service';

@Module({
  imports: [],
  providers: [
    {
      provide: 'RandomDataService',
      useClass: RandomDataService,
    },
  ],
  exports: ['RandomDataService'],
})
export class RandomDataModule {}
