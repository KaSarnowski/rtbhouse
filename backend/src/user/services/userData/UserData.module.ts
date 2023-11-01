import { Module } from '@nestjs/common';
import { UserDataService } from './UserData.service';
import { RandomDataModule } from '../../../externalData/services/randomData/RandomData.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../common/entities/User';

@Module({
  imports: [RandomDataModule, TypeOrmModule.forFeature([User])],
  providers: [
    {
      provide: 'UserDataService',
      useClass: UserDataService,
    },
  ],
  exports: ['UserDataService'],
})
export class UserDataModule {}
