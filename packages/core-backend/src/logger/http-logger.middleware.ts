import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PinoLoggerService } from './logger.service';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: PinoLoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    const { method, originalUrl } = req;

    this.logger.log(`→ ${method} ${originalUrl}`, 'HTTP');

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - start;
      const msg = `${method} ${originalUrl} ${statusCode} +${duration}ms`;
      if (statusCode >= 500) this.logger.error(msg, undefined, 'HTTP');
      else if (statusCode >= 400) this.logger.warn(msg, 'HTTP');
      else this.logger.log(msg, 'HTTP');
    });

    next();
  }
}
