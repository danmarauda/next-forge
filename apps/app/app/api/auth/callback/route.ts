import { api } from '@repo/database';
import { fetchAction } from 'convex/nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * WorkOS OAuth Callback Handler
 *
 * Handles the OAuth callback from WorkOS after user authentication.
 * Exchanges authorization code for user session and sets session cookie.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const state = searchParams.get('state');

  // Handle error from WorkOS
  if (error) {
    console.error('WorkOS authentication error:', error);
    redirect(`/sign-in?error=${encodeURIComponent(error)}`);
  }

  // Validate authorization code
  if (!code) {
    console.error('No authorization code provided');
    redirect('/sign-in?error=no_code');
  }

  try {
    // Exchange code for user session via Convex action
    const result = await fetchAction(api.workosAuth.authenticateUser, {
      code,
    });

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set('workos_session', result.session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    // Parse state to get return URL
    let returnTo = '/';
    if (state) {
      try {
        const stateData = JSON.parse(state);
        returnTo = stateData.returnTo || '/';
      } catch {
        // Invalid state, use default
      }
    }

    console.log(`User ${result.user.email} authenticated successfully`);

    // Redirect to return URL or dashboard
    redirect(returnTo);
  } catch (error) {
    console.error('Error in WorkOS callback:', error);
    redirect('/sign-in?error=auth_failed');
  }
}
