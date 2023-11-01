import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    Logger.error(
      `Error: ${exception.message}`,
      exception.stack,
      'ExceptionFilter',
    );

    response.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
    });
  }
}
