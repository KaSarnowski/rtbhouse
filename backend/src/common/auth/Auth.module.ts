import { Global, Module } from '@nestjs/common';
import { JwtService } from './Jwt.service';

@Global()
@Module({
  providers: [
    {
      provide: `JwtService`,
      useClass: JwtService,
    },
  ],
  exports: [`JwtService`],
})
export class AuthModule {}
