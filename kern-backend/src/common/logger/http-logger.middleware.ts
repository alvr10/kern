import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { PinoLoggerService } from "./logger.service";

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: PinoLoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    const { method, originalUrl, ip } = req;

    // Log request
    this.logger.log(`Incoming ${method} ${originalUrl}`, "HTTP");

    // Log response when finished
    res.on("finish", () => {
      const duration = Date.now() - startTime;
      const { statusCode } = res;

      const logLevel =
        statusCode >= 500 ? "error" : statusCode >= 400 ? "warn" : "log";

      const message = `${method} ${originalUrl} ${statusCode} - ${duration}ms`;

      if (logLevel === "error") {
        this.logger.error(message, undefined, "HTTP");
      } else if (logLevel === "warn") {
        this.logger.warn(message, "HTTP");
      } else {
        this.logger.log(message, "HTTP");
      }
    });

    next();
  }
}
