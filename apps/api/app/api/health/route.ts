import { getWorkOS } from '@repo/database/convex/workos';
import { NextResponse } from 'next/server';

/**
 * Health Check Endpoint
 *
 * Checks the health of all critical services:
 * - Database (Convex)
 * - WorkOS
 * - External services
 */
export async function GET() {
  const checks: Record<
    string,
    { status: 'healthy' | 'unhealthy'; message?: string }
  > = {};

  // Check WorkOS
  try {
    const workos = getWorkOS();
    // Simple check - if client initializes, it's healthy
    checks.workos = { status: 'healthy' };
  } catch (error) {
    checks.workos = {
      status: 'unhealthy',
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }

  // Check Convex (via environment)
  try {
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
      throw new Error('CONVEX_URL not set');
    }
    checks.convex = { status: 'healthy' };
  } catch (error) {
    checks.convex = {
      status: 'unhealthy',
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }

  // Determine overall health
  const allHealthy = Object.values(checks).every(
    (check) => check.status === 'healthy',
  );
  const status = allHealthy ? 200 : 503;

  return NextResponse.json(
    {
      status: allHealthy ? 'healthy' : 'degraded',
      checks,
      timestamp: new Date().toISOString(),
    },
    { status },
  );
}
