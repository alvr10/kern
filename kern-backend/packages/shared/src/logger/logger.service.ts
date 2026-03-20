import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { Logger, pino } from 'pino';

@Injectable()
export class PinoLoggerService implements NestLoggerService {
  private logger: Logger;

  constructor() {
    this.logger = pino({
      level: process.env.LOG_LEVEL || 'info',
      base: {
        service: process.env.SERVICE_NAME || 'unknown-service',
      },
      transport:
        process.env.NODE_ENV !== 'production'
          ? {
              target: 'pino-pretty',
              options: {
                colorize: true,
                translateTime: 'SYS:standard',
                ignore: 'pid,hostname',
                singleLine: false,
                messageFormat: '{levelLabel} - {msg}',
              },
            }
          : undefined,
      formatters: {
        level: label => ({ level: label.toUpperCase() }),
      },
      timestamp: pino.stdTimeFunctions.isoTime,
    });
  }

  log(message: any, context?: string) { this.logger.info({ context }, message); }
  error(message: any, trace?: string, context?: string) { this.logger.error({ context, trace }, message); }
  warn(message: any, context?: string) { this.logger.warn({ context }, message); }
  debug(message: any, context?: string) { this.logger.debug({ context }, message); }
  verbose(message: any, context?: string) { this.logger.trace({ context }, message); }
  getLogger(): Logger { return this.logger; }
  child(bindings: Record<string, any>): Logger { return this.logger.child(bindings); }
}
