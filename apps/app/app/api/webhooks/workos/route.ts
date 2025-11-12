import { headers } from "next/headers";
import { fetchAction } from "convex/nextjs";
import { api } from "@repo/database";
import { NextResponse } from "next/server";

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
 * - dsync.* events (Directory Sync)
 */
export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const signature = headersList.get("workos-signature");
    const body = await request.json();

    // TODO: Verify webhook signature
    // const isValid = verifyWebhookSignature(body, signature);
    // if (!isValid) {
    //   return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    // }

    const { event, data } = body;

    console.log(`Received WorkOS webhook: ${event}`);

    // Handle webhook event via Convex action
    await fetchAction(api.workosAuth.handleWebhook, {
      event,
      data,
    });

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error handling WorkOS webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

// Only allow POST requests
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}

