import { Module } from '@nestjs/common';
import { LoremIpsumService } from './LoremIpsum.service';

@Module({
  imports: [],
  providers: [
    {
      provide: 'LoremIpsumService',
      useClass: LoremIpsumService,
    },
  ],
  exports: ['LoremIpsumService'],
})
export class LoremIpsumModule {}
