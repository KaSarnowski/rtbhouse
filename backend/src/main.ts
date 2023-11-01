import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: (requestOrigin: string, callback): void => {
      if (requestOrigin === process.env.FRONTEND_URL) {
        return callback(null, true);
      }
      console.log('requestOrigin', requestOrigin);
      return callback(new Error('CORS not allowed'));
    },
    credentials: true,
  });
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
