'use client';

import type { LucideProps } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useQueryState } from 'nuqs';
import { Button } from '@/components/ui/button';
import { env } from '@/env';
import { workosAuth } from '@/lib/convex/workos-client';
import { cn } from '@/lib/utils';

const authRoutes = ['/login', '/signup'];

export function WorkOSSignForm() {
  let [callbackUrl] = useQueryState('callbackUrl');
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (!(callbackUrl || authRoutes.includes(pathname))) {
    callbackUrl = encodeURL(pathname, searchParams.toString());
  }

  const handleSignIn = () => {
    const redirectUri = callbackUrl
      ? `${env.NEXT_PUBLIC_SITE_URL}${decodeURIComponent(callbackUrl)}`
      : `${env.NEXT_PUBLIC_SITE_URL}/auth/callback`;

    workosAuth.signIn({ redirectUri });
  };

  return (
    <div className={cn('mx-auto grid max-w-[268px] gap-3')}>
      <Button
        className="w-full"
        onClick={handleSignIn}
        size="lg"
        variant="default"
      >
        <WorkOSIcon />
        Continue with WorkOS
      </Button>

      <div className="my-3 max-w-xs text-balance text-center text-muted-foreground text-xs">
        By continuing, you agree to our{' '}
        <Link className="font-semibold hover:underline" href="#terms">
          Terms of Service
        </Link>{' '}
        and acknowledge you've read our{' '}
        <Link className="font-semibold hover:underline" href="#privacy">
          Privacy Policy
        </Link>
        .
      </div>
    </div>
  );
}

const encodeURL = (pathname: string, search?: string) => {
  let callbackUrl = pathname;

  let adjustedSearch = search;

  if (search) {
    if (!search.startsWith('?')) {
      adjustedSearch = `?${search}`;
    }

    callbackUrl += adjustedSearch;
  }

  return encodeURIComponent(callbackUrl);
};

function WorkOSIcon(props: LucideProps) {
  return (
    <svg
      height="20"
      viewBox="0 0 24 24"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>WorkOS</title>
      <path
        d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}
