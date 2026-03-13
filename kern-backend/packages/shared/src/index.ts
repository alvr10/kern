// ── Types & Interfaces ────────────────────────────────────────────────────────
export interface JwtPayload {
  sub: string; // Supabase user UUID
  email: string;
  role?: string;
  iat?: number;
  exp?: number;
}

export interface ServiceResponse<T = unknown> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T = unknown> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// ── Enums ─────────────────────────────────────────────────────────────────────
export * from './enums';

// ── NestJS Common Utilities ───────────────────────────────────────────────────
export { AllExceptionsFilter } from './filters/all-exceptions.filter';
export { TransformInterceptor } from './interceptors/transform.interceptor';
export { PinoLoggerService } from './logger/logger.service';
export { HttpLoggerMiddleware } from './logger/http-logger.middleware';
export { LoggerModule } from './logger/logger.module';
