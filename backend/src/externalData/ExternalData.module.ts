import { Module } from '@nestjs/common';
import { LoremIpsumController } from './controllers/LoremIpsum.controller';
import { LoremIpsumModule } from './services/loremIpsum/LoremIpsum.module';
import { RandomDataModule } from './services/randomData/RandomData.module';

@Module({
  imports: [LoremIpsumModule, RandomDataModule],
  controllers: [LoremIpsumController],
  providers: [],
})
export class ExternalDataModule {}
