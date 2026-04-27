import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../../../core/stores/auth-store";
import { supabase } from "./client";
import type {
  AuthError,
  SignInCredentials,
  SignUpCredentials,
  UpdatePasswordRequest,
} from "./types";

/**
 * useAuth — reads auth state from the singleton store.
 * The Supabase listener lives in auth-store.ts and syncs with Zustand.
 */
export const useAuth = () => {
  const { token, user, isLoading } = useAuthStore();
  return {
    session: token,
    user,
    isAuthenticated: !!token,
    isLoading,
  };
};

/**
 * useSignIn — email/password
 */
export const useSignIn = () =>
  useMutation<void, AuthError, SignInCredentials>({
    mutationFn: async ({ email, password }) => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        throw { message: error.message, status: error.status } as AuthError;
      }
    },
  });

/**
 * useSignUp — email/password
 */
export const useSignUp = () =>
  useMutation<void, AuthError, SignUpCredentials>({
    mutationFn: async ({ email, password, metadata }) => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error)
        throw { message: error.message, status: error.status } as AuthError;
    },
  });

/**
 * useSignOut
 */
export const useSignOut = () =>
  useMutation<void, AuthError>({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw { message: error.message, status: error.status } as AuthError;
      }
    },
  });

/**
 * useResetPassword
 */
export const useResetPassword = () =>
  useMutation<void, AuthError, { email: string }>({
    mutationFn: async ({ email }) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error)
        throw { message: error.message, status: error.status } as AuthError;
    },
  });

/**
 * useUpdatePassword
 */
export const useUpdatePassword = () =>
  useMutation<void, AuthError, UpdatePasswordRequest>({
    mutationFn: async ({ password }) => {
      const { error } = await supabase.auth.updateUser({ password });
      if (error)
        throw { message: error.message, status: error.status } as AuthError;
    },
  });
