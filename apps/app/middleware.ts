import {
  noseconeOptions,
  noseconeOptionsWithToolbar,
  securityMiddleware,
} from '@repo/security/middleware';
import { createNEMO } from '@rescale/nemo';
import {
  type NextMiddleware,
  type NextRequest,
  NextResponse,
} from 'next/server';
import { env } from './env';

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
  runtime: 'nodejs',
};

// ARA Organization subdomains
const ARA_SUBDOMAINS = [
  'ara',
  'fire',
  'electrical',
  'buildingservices',
  'mechanical',
  'propertyservices',
  'products',
  'manufacturing',
  'marine',
  'security',
  'indigenous',
];

/**
 * Organization subdomain detection middleware
 * Detects org context from subdomain and adds to headers/query params
 */
const orgSubdomainMiddleware = async (request: NextRequest) => {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';
  const hostParts = hostname.split('.');

  // Handle *.ara.aliaslabs.ai pattern (e.g., fire.ara.aliaslabs.ai)
  if (hostname.includes('.ara.aliaslabs.ai')) {
    const subdomain = hostParts[0];

    // If it's an org subdomain (not 'ara' itself and not 'www')
    if (
      subdomain !== 'ara' &&
      subdomain !== 'www' &&
      ARA_SUBDOMAINS.includes(subdomain)
    ) {
      // Create response with org context header
      const response = NextResponse.next();
      response.headers.set('x-org-subdomain', subdomain);

      // Add org parameter to URL for client-side detection
      if (!url.searchParams.has('org')) {
        url.searchParams.set('org', subdomain);
        return NextResponse.rewrite(url, {
          request: {
            headers: response.headers,
          },
        });
      }

      return response;
    }
  }

  // Handle production domains (*.aragroup.com.au pattern)
  if (hostname.includes('.aragroup.com.au')) {
    const subdomain = hostParts[0];

    if (ARA_SUBDOMAINS.includes(subdomain)) {
      const response = NextResponse.next();
      response.headers.set('x-org-subdomain', subdomain);

      if (!url.searchParams.has('org')) {
        url.searchParams.set('org', subdomain);
        return NextResponse.rewrite(url, {
          request: {
            headers: response.headers,
          },
        });
      }

      return response;
    }
  }

  // Return undefined to continue to next middleware
  return undefined;
};

// Security headers middleware
const securityHeaders = env.FLAGS_SECRET
  ? securityMiddleware(noseconeOptionsWithToolbar)
  : securityMiddleware(noseconeOptions);

// Compose middleware using NEMO (for apps without Clerk)
// Org subdomain detection runs first, then security headers
const composedMiddleware = createNEMO(
  {},
  {
    before: [orgSubdomainMiddleware],
  },
);

export default (async (request, event) => {
  // Run security headers first
  const headersResponse = securityHeaders();

  // Then run composed middleware (org subdomain detection)
  const middlewareResponse = await composedMiddleware(
    request as unknown as NextRequest,
    event,
  );

  // Return middleware response if it exists, otherwise headers response
  return middlewareResponse || headersResponse;
}) as unknown as NextMiddleware;
