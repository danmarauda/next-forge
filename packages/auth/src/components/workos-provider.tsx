'use client';

import type { api } from '@convex/_generated/api';
import { ConvexProviderWithAuth, ConvexReactClient, type Preloaded } from 'convex/react';
import { createAtomStore } from 'jotai-x';
import { type ReactNode, useCallback, useEffect } from 'react';

import { env } from '@/env';
import { AuthErrorBoundary } from '@/lib/convex/components/auth-error-boundary';
import { workosAuth } from '@/lib/convex/workos-client';
import { QueryClientProvider } from '@/lib/react-query/query-client-provider';

const convex = new ConvexReactClient(env.NEXT_PUBLIC_CONVEX_URL, {
  verbose: false,
});

export const { AuthProvider, useAuthStore, useAuthValue } = createAtomStore(
  {
    preloadedUser: null as unknown as Preloaded<typeof api.user.getCurrentUser>,
    token: null as string | null,
  },
  {
    effect: AuthEffect,
    name: 'auth',
  }
);

// Custom useAuth hook for ConvexProviderWithAuth
function useAuth() {
  const token = workosAuth.getToken();
  const hasToken = !!token;

  const fetchAccessToken = useCallback(
    async ({ forceRefreshToken }: { forceRefreshToken?: boolean }) => {
      // Get token from cookie
      const currentToken = workosAuth.getToken();
      return currentToken || null;
    },
    []
  );

  return {
    isLoading: false,
    isAuthenticated: hasToken,
    fetchAccessToken,
  };
}

export function ConvexProvider({
  children,
  preloadedUser,
  token,
}: {
  children: ReactNode;
  preloadedUser?: Preloaded<typeof api.user.getCurrentUser>;
  token?: string;
}) {
  return (
    <ConvexProviderWithAuth client={convex} useAuth={useAuth}>
      <QueryClientProvider convex={convex}>
        <ConvexProviderInner preloadedUser={preloadedUser} token={token}>
          {children}
        </ConvexProviderInner>
      </QueryClientProvider>
    </ConvexProviderWithAuth>
  );
}

function ConvexProviderInner({
  children,
  preloadedUser,
  token,
}: {
  children: ReactNode;
  preloadedUser?: Preloaded<typeof api.user.getCurrentUser>;
  token?: string;
}) {
  return (
    <AuthProvider preloadedUser={preloadedUser} token={token ?? null}>
      <AuthErrorBoundary>{children}</AuthErrorBoundary>
    </AuthProvider>
  );
}

function AuthEffect() {
  const authStore = useAuthStore();

  useEffect(() => {
    // Get token from cookie on mount and updates
    const token = workosAuth.getToken();
    authStore.set('token', token);

    // Listen for storage events (cookie changes)
    const handleStorageChange = () => {
      const newToken = workosAuth.getToken();
      authStore.set('token', newToken);
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [authStore]);

  return null;
}