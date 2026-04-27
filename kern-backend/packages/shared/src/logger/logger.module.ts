import { Global, Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { HttpLoggerMiddleware } from './http-logger.middleware';
import { PinoLoggerService } from './logger.service';

@Global()
@Module({
  providers: [PinoLoggerService, HttpLoggerMiddleware],
  exports: [PinoLoggerService, HttpLoggerMiddleware],
})
export class LoggerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
