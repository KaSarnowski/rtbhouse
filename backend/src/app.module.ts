import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from './common/entities/Entities';
import { RedisClientModule } from './common/redis/RedisClient.module';
import { UserModule } from './user/User.module';
import { ExternalDataModule } from './externalData/ExternalData.module';
import { HttpClientModule } from './common/httpClient/HttpClient.module';
import { AllExceptionsFilter } from './common/exceptions/AllExceptions.filter';
import { APP_FILTER } from '@nestjs/core';
import { AuthModule } from './common/auth/Auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      synchronize: true, // turn this off in PROD and use proper migrations instead
      entities,
    }),
    RedisClientModule,
    UserModule,
    ExternalDataModule,
    HttpClientModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
