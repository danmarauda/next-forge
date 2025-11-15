import { api } from '@repo/database';
import { fetchAction } from 'convex/nextjs';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

/**
 * WorkOS Webhook Handler
 *
 * Handles webhook events from WorkOS:
 * - user.created
 * - user.updated
 * - user.deleted
 * - organization.created
 * - organization.updated
 * - organization.deleted
 * - organization_membership.*
 * - dsync.* events (Directory Sync)
 *
 * Monitoring: All events are logged with timestamp, event type, and status
 */
export async function POST(request: Request) {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();

  try {
    const headersList = await headers();
    const signature = headersList.get('workos-signature');
    const body = await request.json();

    // TODO: Verify webhook signature
    // const isValid = verifyWebhookSignature(body, signature);
    // if (!isValid) {
    //   console.error(`[${timestamp}] Webhook signature verification failed`);
    //   return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    // }

    const { event, data } = body;
    const organizationId = data?.organization_id || data?.id || 'unknown';
    const userId = data?.user_id || data?.id || 'unknown';

    // Enhanced logging with structured data
    console.log(`[${timestamp}] WorkOS Webhook Received:`, {
      event,
      organizationId: organizationId !== 'unknown' ? organizationId : undefined,
      userId: userId !== 'unknown' ? userId : undefined,
      timestamp,
    });

    // Handle webhook event via Convex action
    const result = await fetchAction(api.workosAuth.handleWebhook, {
      event,
      data,
    });

    const duration = Date.now() - startTime;

    // Success logging
    console.log(`[${timestamp}] WorkOS Webhook Processed Successfully:`, {
      event,
      organizationId: organizationId !== 'unknown' ? organizationId : undefined,
      userId: userId !== 'unknown' ? userId : undefined,
      duration: `${duration}ms`,
      timestamp,
    });

    return NextResponse.json({
      received: true,
      event,
      processed: true,
      timestamp,
      duration: `${duration}ms`,
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';

    // Error logging with full context
    console.error(`[${timestamp}] WorkOS Webhook Error:`, {
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      duration: `${duration}ms`,
      timestamp,
    });

    return NextResponse.json(
      {
        error: 'Webhook processing failed',
        message: errorMessage,
        timestamp,
      },
      { status: 500 },
    );
  }
}

// Only allow POST requests
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
