import { api } from '@repo/database';
import { fetchQuery } from 'convex/nextjs';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * Server-side helper to get current user
 * Use this in Server Components and Server Actions
 */
export async function currentUser() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('workos_session')?.value;

  if (!sessionToken) {
    return null;
  }

  try {
    const user = await fetchQuery(api.workosAuth.getCurrentUserFromToken, {
      token: sessionToken,
    });

    if (!user) {
      return null;
    }

    return {
      id: user._id,
      email: user.email,
      name: user.name,
      image: user.image,
      role: user.role,
      activeOrganization: user.activeOrganization,
      isAdmin: user.isAdmin,
    };
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
}

/**
 * Auth utilities for server-side
 */
export async function auth() {
  return {
    redirectToSignIn: () => {
      redirect('/sign-in');
    },
  };
}

/**
 * Require authentication in Server Components
 * Redirects to sign-in if not authenticated
 */
export async function requireAuth() {
  const user = await currentUser();
  
  if (!user) {
    redirect('/sign-in');
  }

  return user;
}