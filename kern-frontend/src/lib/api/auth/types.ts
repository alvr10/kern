/**
 * Auth Types
 * TypeScript types for authentication
 */

import type { User as AuthUser, Session } from "@supabase/supabase-js";

/**
 * Re-export Supabase types
 */
export type { AuthUser, Session };

/**
 * Sign in credentials
 */
export interface SignInCredentials {
  email: string;
  password: string;
}

/**
 * Sign up credentials
 */
export interface SignUpCredentials {
  email: string;
  password: string;
  metadata?: {
    name?: string;
    username?: string;
  };
}

/**
 * Auth state
 */
export interface AuthState {
  session: Session | null;
  user: AuthUser | null;
  isLoading: boolean;
}

/**
 * Update password request
 */
export interface UpdatePasswordRequest {
  password: string;
}

/**
 * Auth error
 */
export interface AuthError {
  message: string;
  status?: number;
}
