'use client';

import { api } from '@repo/database';
import { useQuery, useMutation } from 'convex/react';
import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

type User = {
  _id: string;
  email: string;
  name: string;
  image: string | null;
  role: string | null;
  activeOrganization: {
    id: string;
    name: string;
    slug: string;
    role: string;
  } | null;
  isAdmin: boolean;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signOut: async () => {},
});

/**
 * WorkOS Auth Provider
 * Provides authentication context to the app
 */
export function WorkOSAuthProvider({ children }: { children: ReactNode }) {
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get session token from cookie on mount
  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('workos_session='))
      ?.split('=')[1];
    
    setSessionToken(token || null);
    setIsLoading(false);
  }, []);

  // Fetch user data from Convex
  const user = useQuery(
    api.workosAuth.getCurrentUserFromToken,
    sessionToken ? { token: sessionToken } : 'skip'
  );

  const signOutMutation = useMutation(api.workosAuth.signOut);

  const signOut = async () => {
    if (sessionToken) {
      await signOutMutation({ token: sessionToken });
      
      // Clear cookie
      document.cookie = 'workos_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      
      // Redirect to sign-in
      window.location.href = '/sign-in';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading: isLoading || user === undefined,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within WorkOSAuthProvider');
  }
  return context;
}

/**
 * Hook to require authentication
 * Redirects to sign-in if not authenticated
 */
export function useRequireAuth() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      window.location.href = '/sign-in';
    }
  }, [user, isLoading]);

  return { user, isLoading };
}