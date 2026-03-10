import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";
import { PinoLoggerService } from "../logger/logger.service";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly pinoLogger: PinoLoggerService) {}

  private getErrorCodeForStatus(status: number): string {
    const errorCodes: Record<number, string> = {
      400: "Bad Request",
      401: "Unauthorized",
      403: "Forbidden",
      404: "Not Found",
      409: "Conflict",
      422: "Unprocessable Entity",
      500: "Internal Server Error",
    };
    return errorCodes[status] || "Internal Server Error";
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Internal server error";
    let error = "Internal Server Error";

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === "string") {
        message = exceptionResponse;
        error = this.getErrorCodeForStatus(status);
      } else if (typeof exceptionResponse === "object") {
        message = (exceptionResponse as any).message || exception.message;
        error =
          (exceptionResponse as any).error ||
          this.getErrorCodeForStatus(status);
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(
        `Unhandled exception: ${exception.message}`,
        exception.stack
      );
    }

    // Log error details for debugging, especially for 4xx errors during load testing
    const logLevel = status >= 500 ? "error" : status >= 400 ? "warn" : "log";
    const errorMessage = `${request.method} ${request.url} ${status} - ${Array.isArray(message) ? message.join(", ") : message}`;

    if (logLevel === "error") {
      this.pinoLogger.error(errorMessage, undefined, "HTTP");
    } else if (logLevel === "warn") {
      this.pinoLogger.warn(errorMessage, "HTTP");
    }

    response.status(status).json({
      success: false,
      error: {
        code: error,
        message: Array.isArray(message) ? message : [message],
        timestamp: new Date().toISOString(),
        path: request.url,
      },
    });
  }
}
