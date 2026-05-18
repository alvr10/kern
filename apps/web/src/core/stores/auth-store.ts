import { supabase } from '@/lib/api/auth/client';
import type { User, AuthChangeEvent, Session } from '@supabase/supabase-js';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  setAuth: (token: string | null, user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      token: null,
      user: null,
      isLoading: true,
      setAuth: (token, user) => set({ token, user, isLoading: false }),
      setLoading: loading => set({ isLoading: loading }),
      logout: () => {
        set({ token: null, user: null, isLoading: false });
        supabase.auth.signOut();
      },
    }),
    {
      name: 'auth-storage',
    },
  ),
);

/**
 * Global Supabase auth subscription
 * Syncs Supabase session state with the Zustand store
 */
if (typeof window !== 'undefined') {
  supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
    const { setAuth, setLoading, logout } = useAuthStore.getState();

    console.log('[Auth] Event:', event, session?.user?.id);

    if (session) {
      setAuth(session.access_token, session.user);
    } else {
      if (event === 'SIGNED_OUT') {
        logout();
      } else {
        setAuth(null, null);
      }
    }
    setLoading(false);
  });
}
