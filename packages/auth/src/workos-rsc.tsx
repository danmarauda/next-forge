import { api } from '@convex/_generated/api';
import { fetchQuery } from 'convex/nextjs';
import type { Route } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type * as React from 'react';

/**
 * WorkOS RSC Helpers
 * Server-side authentication helpers for React Server Components
 */

export const getWorkOSSessionToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get('workos_session')?.value;
  return token || null;
};

export const isWorkOSAuth = async () => {
  const token = await getWorkOSSessionToken();

  if (!token) return false;

  try {
    const user = await fetchQuery(
      api.workosAuth.getCurrentUserFromToken,
      { token },
      { token },
    );
    return !!user;
  } catch {
    return false;
  }
};

export const isWorkOSUnauth = async () => !(await isWorkOSAuth());

export const getWorkOSSessionUser = async () => {
  const token = await getWorkOSSessionToken();

  if (!token) return null;

  return await fetchQuery(
    api.workosAuth.getCurrentUserFromToken,
    { token },
    { token },
  );
};

export const workosAuthGuard = async () => {
  if (await isWorkOSUnauth()) {
    redirect('/login');
  }
};

export const workosAuthRedirect = async ({
  pathname,
  searchParams,
}: {
  pathname?: string;
  searchParams?: Record<string, string>;
}) => {
  if (await isWorkOSUnauth()) {
    let callbackUrl = '/login';

    if (pathname) {
      if (searchParams) {
        const params = new URLSearchParams(searchParams);
        callbackUrl += `?callbackUrl=${encodeURIComponent(pathname + params.toString())}`;
      } else {
        callbackUrl += `?callbackUrl=${pathname}`;
      }
    }

    redirect(callbackUrl as Route);
  }
};

export async function WorkOSAuthRedirect({
  children,
  pathname,
  searchParams,
}: {
  children: React.ReactNode;
  pathname?: string;
  searchParams?: Record<string, string>;
}) {
  await workosAuthRedirect({ pathname, searchParams });

  return <>{children}</>;
}
