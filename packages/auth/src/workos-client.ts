'use client';

import { api } from '@convex/_generated/api';
import { fetchAction } from 'convex/nextjs';
import { env } from '@/env';

/**
 * WorkOS Auth Client
 * Replaces Better Auth client with WorkOS AuthKit
 */

export const workosAuth = {
  /**
   * Redirect to WorkOS login
   */
  signIn: async (options?: { redirectUri?: string; state?: string }) => {
    const { authorizationUrl } = await fetchAction(
      api.workosAuth.getAuthorizationUrl,
      {
        redirectUri:
          options?.redirectUri || `${env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        state: options?.state,
      },
    );

    window.location.href = authorizationUrl;
  },

  /**
   * Sign out user
   */
  signOut: async () => {
    // Get token from cookie
    const token = getCookie('workos_session');

    if (token) {
      await fetchAction(api.workosAuth.signOut, { token });
    }

    // Clear cookie
    document.cookie =
      'workos_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

    // Redirect to login
    window.location.href = '/login';
  },

  /**
   * Get current session token
   */
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return getCookie('workos_session');
  },
};

/**
 * Helper to get cookie value
 */
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }

  return null;
}
