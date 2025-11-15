'use client';

import { api } from '@repo/database';
import { useAction } from 'convex/react';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const error = searchParams?.get('error');
  const returnTo = searchParams?.get('returnTo') || '/';

  const getAuthUrl = useAction(api.workosAuth.getAuthorizationUrl);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await getAuthUrl({
        redirectUri: `${window.location.origin}/api/auth/callback`,
        state: JSON.stringify({ returnTo }),
      });

      // Redirect to WorkOS authorization URL
      window.location.href = result.authorizationUrl;
    } catch (error) {
      console.error('Error getting authorization URL:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Sign in to ARA Group
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Enterprise authentication powered by WorkOS
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Authentication Error
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  {error === 'no_code' && 'No authorization code provided'}
                  {error === 'auth_failed' && 'Authentication failed. Please try again.'}
                  {!['no_code', 'auth_failed'].includes(error) && error}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleSignIn}
            disabled={isLoading}
            className="w-full rounded-md bg-blue-600 px-4 py-3 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Redirecting...' : 'Sign in with WorkOS'}
          </button>

          <div className="text-center text-sm text-gray-600">
            <p>Supports SSO, Google, GitHub, and Magic Links</p>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-200 pt-6">
          <div className="text-xs text-gray-500 space-y-2">
            <p className="font-semibold">Enterprise Features:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Single Sign-On (SAML, OIDC)</li>
              <li>Directory Sync (SCIM)</li>
              <li>Multi-tenant Organizations</li>
              <li>Audit Logs & Compliance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}