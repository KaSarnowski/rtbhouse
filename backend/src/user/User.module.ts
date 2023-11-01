import { Module } from '@nestjs/common';
import { UserDataController } from './controllers/UserData.controller';
import { UserDataModule } from './services/userData/UserData.module';

@Module({
  imports: [UserDataModule],
  controllers: [UserDataController],
  providers: [],
})
export class UserModule {}
