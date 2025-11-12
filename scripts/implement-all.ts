#!/usr/bin/env tsx

/**
 * ARA Group Platform - Complete Implementation Script
 * 
 * This script:
 * 1. Reads WorkOS credentials from Convex or environment
 * 2. Sets Convex environment variables if needed
 * 3. Creates all WorkOS organizations
 * 4. Verifies the setup
 */

import { execSync } from "child_process";
import { join } from "path";
import { config } from "dotenv";
import { WorkOS } from "@workos-inc/node";

// Load environment variables
config({ path: join(process.cwd(), "apps/app/.env.local") });
config({ path: join(process.cwd(), "packages/database/.env.local") });

const convexPath = join(process.cwd(), "packages/database");

function runCommand(command: string, cwd?: string, silent = false): string {
  try {
    const result = execSync(command, {
      cwd: cwd || process.cwd(),
      encoding: "utf-8",
      stdio: silent ? "pipe" : "inherit",
    });
    return result.trim();
  } catch (error: any) {
    if (!silent) {
      console.error(`Command failed: ${command}`);
      console.error(error.message);
    }
    throw error;
  }
}

async function getConvexEnvVar(varName: string): Promise<string | null> {
  try {
    const result = runCommand(`convex env get ${varName}`, convexPath, true);
    return result || null;
  } catch {
    return null;
  }
}

async function setConvexEnvVar(varName: string, value: string): Promise<void> {
  try {
    runCommand(`convex env set ${varName} "${value}"`, convexPath, true);
    console.log(`  ✅ ${varName} set in Convex`);
  } catch (error: any) {
    console.log(`  ⚠️  ${varName}: ${error.message}`);
  }
}

async function main() {
  console.log("🚀 ARA Group Platform - Complete Implementation\n");
  console.log("=".repeat(80));

  // Step 1: Get WorkOS credentials
  console.log("\n📋 Step 1: Getting WorkOS Credentials\n");

  let workosApiKey = process.env.WORKOS_API_KEY;
  let workosClientId = process.env.WORKOS_CLIENT_ID;

  // Try to get from Convex if not in env
  if (!workosApiKey) {
    console.log("  Checking Convex for WORKOS_API_KEY...");
    workosApiKey = await getConvexEnvVar("WORKOS_API_KEY");
  }

  if (!workosClientId) {
    console.log("  Checking Convex for WORKOS_CLIENT_ID...");
    workosClientId = await getConvexEnvVar("WORKOS_CLIENT_ID");
  }

  if (!workosApiKey) {
    console.error("\n❌ WORKOS_API_KEY not found!");
    console.log("\nPlease set it using one of these methods:");
    console.log("  1. Add to apps/app/.env.local: WORKOS_API_KEY=sk_...");
    console.log("  2. Set in Convex: cd packages/database && convex env set WORKOS_API_KEY sk_...");
    console.log("  3. Run: pnpm run setup:convex-env");
    process.exit(1);
  }

  console.log("  ✅ WorkOS API Key found");
  if (workosClientId) {
    console.log("  ✅ WorkOS Client ID found");
  }

  // Step 2: Ensure Convex env vars are set
  console.log("\n💾 Step 2: Ensuring Convex Environment Variables\n");

  await setConvexEnvVar("WORKOS_API_KEY", workosApiKey);
  if (workosClientId) {
    await setConvexEnvVar("WORKOS_CLIENT_ID", workosClientId);
  }

  const adminEmails = [
    "ed.federman@aragroup.com.au",
    "mark.brady@aliaslabs.ai",
    "dan.humphreys@aliaslabs.ai",
  ].join(",");
  await setConvexEnvVar("ADMIN", adminEmails);

  // Step 3: Create WorkOS organizations
  console.log("\n🏢 Step 3: Creating WorkOS Organizations\n");

  // Set env var for the script
  process.env.WORKOS_API_KEY = workosApiKey;
  if (workosClientId) {
    process.env.WORKOS_CLIENT_ID = workosClientId;
  }

  try {
    runCommand("pnpm run setup:ara-organizations");
    console.log("\n✅ Organizations created successfully");
  } catch (error: any) {
    console.error("\n❌ Failed to create organizations");
    console.error(error.message);
    process.exit(1);
  }

  // Step 4: Verify setup
  console.log("\n✅ Step 4: Verification\n");

  try {
    const workos = new WorkOS(workosApiKey);
    const orgs = await workos.organizations.listOrganizations({ limit: 20 });
    console.log(`  ✅ Found ${orgs.data.length} organizations in WorkOS`);
    
    // List organizations
    orgs.data.forEach((org, index) => {
      console.log(`     ${index + 1}. ${org.name} (${org.id})`);
    });
  } catch (error: any) {
    console.log(`  ⚠️  Could not verify: ${error.message}`);
  }

  // Summary
  console.log("\n" + "=".repeat(80));
  console.log("✅ Implementation Complete!\n");
  console.log("Next Steps:");
  console.log("  1. Configure WorkOS Dashboard:");
  console.log("     - Branding (colors: #AFCC37, #435464)");
  console.log("     - Roles & Permissions");
  console.log("     - Webhooks: https://your-domain.com/api/webhooks/workos");
  console.log("  2. Configure Vercel domains (all 11 demo domains)");
  console.log("  3. Verify Convex sync in dashboard");
  console.log("\n");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

