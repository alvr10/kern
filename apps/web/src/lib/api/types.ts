/**
 * Shared API Types
 * Common types used across all API modules
 */

/**
 * Supported social platforms
 */
export enum SocialPlatform {
  TWITTER = 'TWITTER',
  LINKEDIN = 'LINKEDIN',
  INSTAGRAM = 'INSTAGRAM',
  FACEBOOK = 'FACEBOOK',
  TIKTOK = 'TIKTOK',
  THREADS = 'THREADS',
}

/**
 * Standard API error response
 */
export interface ApiError {
  message: string;
  statusCode: number;
  details?: unknown;
}

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  error?: ApiError;
}

/**
 * Pagination parameters for list endpoints
 */
export interface PaginationParams {
  limit?: number;
  offset?: number;
}

/**
 * HTTP methods supported by the API client
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

/**
 * Request configuration options
 */
export interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined>;
  signal?: AbortSignal;
  body?: unknown;
}

/**
 * API client error class
 */
export class ApiClientError extends Error {
  constructor(
    message: string,
    public statusCode: number | undefined,
    public details?: unknown,
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}
