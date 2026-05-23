/**
 * API Configuration
 * Manages base URL and versioning for the HopeCore backend API
 */

export const API_CONFIG = {
  /**
   * Base URL for the API
   * Override with environment variable in production
   */
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',

  /**
   * Current API version
   * Can be changed to 'v2', 'v3', etc. for future versions
   */
  version: 'v1' as const,

  /**
   * API prefix (e.g., /api)
   */
  prefix: 'api' as const,
} as const;

/**
 * Constructs the full API base URL with version
 * @returns Full API base URL (e.g., http://localhost:8000/api/v1)
 */
export const getApiBaseUrl = (): string => {
  return `${API_CONFIG.baseUrl}/${API_CONFIG.prefix}/${API_CONFIG.version}`;
};

/**
 * Constructs a versioned endpoint URL
 * @param endpoint - The endpoint path (e.g., '/users/123')
 * @returns Full URL with version (e.g., http://localhost:8000/api/v1/users/123)
 */
export const getEndpointUrl = (endpoint: string): string => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${getApiBaseUrl()}${cleanEndpoint}`;
};

/**
 * API version type for future extensibility
 */
export type ApiVersion = 'v1' | 'v2' | 'v3';

/**
 * Creates a versioned API configuration
 * @param version - API version to use
 * @returns Configuration object with the specified version
 */
export const createVersionedConfig = (version: ApiVersion) => ({
  ...API_CONFIG,
  version,
});
