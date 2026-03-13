import { Global, Module } from '@nestjs/common';
import { HttpLoggerMiddleware } from './http-logger.middleware';
import { PinoLoggerService } from './logger.service';

@Global()
@Module({
  providers: [PinoLoggerService, HttpLoggerMiddleware],
  exports: [PinoLoggerService, HttpLoggerMiddleware],
})
export class LoggerModule {}
