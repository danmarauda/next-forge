import { api } from '@repo/database';
import { fetchQuery } from 'convex/nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * WorkOS Authentication Middleware
 * 
 * Validates WorkOS session tokens and adds user context to requests
 */
export async function authMiddleware(request: NextRequest) {
  const sessionToken = request.cookies.get('workos_session')?.value;

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/sign-in',
    '/sign-up',
    '/api/auth/callback',
    '/api/webhooks',
  ];

  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  // Allow public routes without authentication
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Redirect to sign-in if no session token
  if (!sessionToken) {
    const signInUrl = new URL('/sign-in', request.url);
    signInUrl.searchParams.set('returnTo', request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  try {
    // Validate session token via Convex
    const user = await fetchQuery(api.workosAuth.getCurrentUserFromToken, {
      token: sessionToken,
    });

    if (!user) {
      // Invalid or expired session
      const response = NextResponse.redirect(new URL('/sign-in', request.url));
      response.cookies.delete('workos_session');
      return response;
    }

    // Add user context to request headers
    const response = NextResponse.next();
    response.headers.set('x-user-id', user._id);
    response.headers.set('x-user-email', user.email);
    
    if (user.activeOrganization) {
      response.headers.set('x-organization-id', user.activeOrganization.id);
      response.headers.set('x-organization-slug', user.activeOrganization.slug);
    }

    return response;
  } catch (error) {
    console.error('Auth middleware error:', error);
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }
}

/**
 * Get current user from request headers
 * Use this in server components after middleware has run
 */
export function getUserFromHeaders(headers: Headers) {
  const userId = headers.get('x-user-id');
  const userEmail = headers.get('x-user-email');
  const organizationId = headers.get('x-organization-id');
  const organizationSlug = headers.get('x-organization-slug');

  if (!userId || !userEmail) {
    return null;
  }

  return {
    id: userId,
    email: userEmail,
    organization: organizationId && organizationSlug ? {
      id: organizationId,
      slug: organizationSlug,
    } : null,
  };
}