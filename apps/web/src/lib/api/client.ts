/**
 * HTTP Client
 * Type-safe wrapper around fetch API with error handling and interceptors
 */

import { useAuthStore } from '../../core/stores/auth-store';
import { getEndpointUrl } from './config';
import { ApiClientError, type HttpMethod, type RequestConfig } from './types';

/**
 * Get auth token from store
 */
const getAuthToken = (): string | null => {
  return useAuthStore.getState().token;
};

/**
 * Build headers with auth token
 */
const buildHeaders = (customHeaders?: Record<string, string>): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  // Add auth token if available
  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Merge custom headers
  return { ...headers, ...customHeaders };
};

/**
 * Builds query string from params object
 */
const buildQueryString = (params?: Record<string, string | number | boolean | undefined>): string => {
  if (!params) return '';

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

/**
 * Makes an HTTP request to the API
 */
async function request<T>(method: HttpMethod, endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> {
  const url = getEndpointUrl(endpoint) + buildQueryString(config?.params);

  const headers = buildHeaders(config?.headers);

  if (process.env.NODE_ENV === 'development') {
    console.log(`[API Request] ${method} ${url}`, body);
  }

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: config?.signal,
    });

    // Parse response body
    let data: unknown;
    const contentType = response.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Handle error responses
    if (!response.ok) {
      const errorData = data as { message?: string; statusCode?: number } | string;
      const errorObj = typeof errorData === 'object' ? errorData : undefined;

      let message = `HTTP ${response.status}`;
      if (response.statusText) {
        message += `: ${response.statusText}`;
      }

      if (typeof errorData === 'string' && errorData.length > 0) {
        message = errorData;
      } else if (errorObj?.message) {
        message = errorObj.message;
      }

      throw new ApiClientError(message, errorObj?.statusCode || response.status, data);
    }

    // Unwrap API response data if wrapped
    // The API returns { data: T, message: string, statusCode: number, ... }
    const responseData = data as { data?: unknown };
    const unwrappedData =
      responseData && typeof responseData === 'object' && 'data' in responseData ? responseData.data : data;

    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Response] ${method} ${url}`, unwrappedData);
    }

    return unwrappedData as T;
  } catch (error) {
    // Re-throw ApiClientError as-is
    if (error instanceof ApiClientError) {
      throw error;
    }

    // Handle network errors
    if (error instanceof Error) {
      throw new ApiClientError(`Network error: ${error.message}`, 0, error);
    }

    // Handle unknown errors
    throw new ApiClientError('An unknown error occurred', 0, error);
  }
}

/**
 * HTTP Client API
 */
export const apiClient = {
  /**
   * GET request
   */
  get: <T>(endpoint: string, config?: RequestConfig): Promise<T> => {
    return request<T>('GET', endpoint, undefined, config);
  },

  /**
   * POST request
   */
  post: <T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> => {
    return request<T>('POST', endpoint, body, config);
  },

  /**
   * PUT request
   */
  put: <T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> => {
    return request<T>('PUT', endpoint, body, config);
  },

  /**
   * DELETE request
   */
  delete: <T>(endpoint: string, config?: RequestConfig): Promise<T> => {
    return request<T>('DELETE', endpoint, config?.body, config);
  },

  /**
   * PATCH request
   */
  patch: <T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> => {
    return request<T>('PATCH', endpoint, body, config);
  },
};
