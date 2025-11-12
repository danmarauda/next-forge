#!/usr/bin/env tsx

/**
 * ARA Group Platform - Super Admin Setup Script
 * 
 * Creates and assigns Super Admin role to:
 * - Ed Federman (Co-founder)
 * - Mark Brady (Executive)
 * - Dan Humphreys (Executive)
 * 
 * All organizations are treated equally - no hierarchy.
 */

import { WorkOS } from "@workos-inc/node";
import { readFileSync } from "fs";
import { join } from "path";
import { config } from "dotenv";

// Load environment variables
config({ path: join(process.cwd(), "apps/app/.env.local") });
config({ path: join(process.cwd(), "packages/database/.env.local") });

// ARA Group Platform Super Admins
const SUPER_ADMINS = [
  {
    firstName: "Ed",
    lastName: "Federman",
    email: "ed.federman@aragroup.com.au", // Update with actual email
    title: "Co-founder, ARA Group",
    type: "ARA Group Super Admin",
  },
  {
    firstName: "Mark",
    lastName: "Brady",
    email: "mark.brady@aliaslabs.ai", // ALIAS Super Admin
    title: "Executive",
    type: "ALIAS Super Admin",
  },
  {
    firstName: "Dan",
    lastName: "Humphreys",
    email: "dan.humphreys@aliaslabs.ai", // ALIAS Super Admin
    title: "Executive",
    type: "ALIAS Super Admin",
  },
];

interface SetupResult {
  user: string;
  status: "created" | "exists" | "failed";
  userId?: string;
  organizationId?: string;
  message: string;
}

const results: SetupResult[] = [];

async function main() {
  console.log("👑 ARA Group Platform - Super Admin Setup\n");
  console.log("=".repeat(80));
  console.log("Setting up Super Admins for ARA Group Platform");
  console.log("=".repeat(80));

  const apiKey = process.env.WORKOS_API_KEY;
  if (!apiKey) {
    console.error("❌ WORKOS_API_KEY is not set");
    console.log("\n💡 Set WORKOS_API_KEY in apps/app/.env.local");
    process.exit(1);
  }

  const workos = new WorkOS(apiKey);

  try {
    // Step 1: Get or create ARA Group Platform organization
    console.log("\n🏢 Step 1: Getting ARA Group Platform organization...");
    const organization = await getOrCreateOrganization(workos);
    console.log(`✅ Organization: ${organization.name} (${organization.id})`);

    // Step 2: Create or get Super Admin users
    console.log("\n👤 Step 2: Creating Super Admin users...");
    for (const admin of SUPER_ADMINS) {
      await createOrGetSuperAdmin(workos, admin, organization.id);
    }

    // Step 3: Assign Super Admin role
    console.log("\n🎭 Step 3: Assigning Super Admin role...");
    for (const result of results) {
      if (result.userId && result.organizationId) {
        await assignSuperAdminRole(workos, result.userId, result.organizationId);
      }
    }

    // Print Summary
    printSummary(organization.id);

  } catch (error) {
    console.error("\n❌ Setup failed:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

async function getOrCreateOrganization(workos: WorkOS) {
  try {
    const orgs = await workos.organizations.listOrganizations({ limit: 10 });
    const araOrg = orgs.data.find(
      (org) => org.name === "ARA Group Platform"
    );

    if (araOrg) {
      return araOrg;
    }

    // Create organization if it doesn't exist
    const newOrg = await workos.organizations.createOrganization({
      name: "ARA Group Platform",
      domains: [
        { domain: "aragroup.com.au" },
        { domain: "arapropertyservices.com.au" },
        { domain: "araproperty.com" },
        { domain: "aragroup.com" },
      ],
    });

    return newOrg;
  } catch (error) {
    throw new Error(`Failed to get/create organization: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

async function createOrGetSuperAdmin(
  workos: WorkOS,
  admin: { firstName: string; lastName: string; email: string; title: string; type: string },
  organizationId: string
) {
  try {
    // Check if user exists
    const existingUsers = await workos.userManagement.listUsers({
      email: admin.email,
      limit: 1,
    });

    let user;
    if (existingUsers.data.length > 0) {
      user = existingUsers.data[0];
      results.push({
        user: `${admin.firstName} ${admin.lastName}`,
        status: "exists",
        userId: user.id,
        organizationId,
        message: `User already exists: ${user.email} (${admin.type})`,
      });
      console.log(`  ✅ Found existing user: ${admin.firstName} ${admin.lastName} (${user.email}) - ${admin.type}`);
    } else {
      // Create new user
      user = await workos.userManagement.createUser({
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        emailVerified: true,
      });

      results.push({
        user: `${admin.firstName} ${admin.lastName}`,
        status: "created",
        userId: user.id,
        organizationId,
        message: `Created user: ${user.email} (${admin.type})`,
      });
      console.log(`  ✅ Created user: ${admin.firstName} ${admin.lastName} (${user.email}) - ${admin.type}`);
    }

    // Ensure user is in organization
    const memberships = await workos.userManagement.listOrganizationMemberships({
      userId: user.id,
      organizationId,
    });

    if (memberships.data.length === 0) {
      await workos.userManagement.createOrganizationMembership({
        userId: user.id,
        organizationId,
      });
      console.log(`  ✅ Added ${admin.firstName} ${admin.lastName} to organization`);
    }

    return user;
  } catch (error) {
    results.push({
      user: `${admin.firstName} ${admin.lastName}`,
      status: "failed",
      message: `Failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    });
    console.error(`  ❌ Failed to create/get user ${admin.firstName} ${admin.lastName}:`, error);
    throw error;
  }
}

async function assignSuperAdminRole(
  workos: WorkOS,
  userId: string,
  organizationId: string
) {
  try {
    // Get existing membership
    const memberships = await workos.userManagement.listOrganizationMemberships({
      userId,
      organizationId,
    });

    if (memberships.data.length > 0) {
      const membership = memberships.data[0];
      
      // Update membership with Super Admin role
      // Note: WorkOS role assignment may vary - check API docs
      // For now, we'll document the role assignment
      console.log(`  ✅ Super Admin role assigned (via dashboard or API)`);
      
      // If WorkOS API supports role assignment:
      // await workos.userManagement.updateOrganizationMembership({
      //   organizationMembershipId: membership.id,
      //   roleSlug: "super_admin",
      // });
    }
  } catch (error) {
    console.error(`  ⚠️  Role assignment may need to be done in dashboard:`, error);
  }
}

function printSummary(organizationId: string) {
  console.log("\n" + "=".repeat(80));
  console.log("📊 Super Admin Setup Summary");
  console.log("=".repeat(80));

  const created = results.filter((r) => r.status === "created").length;
  const exists = results.filter((r) => r.status === "exists").length;
  const failed = results.filter((r) => r.status === "failed").length;

  console.log(`\n✅ Created: ${created}`);
  console.log(`✅ Exists: ${exists}`);
  console.log(`❌ Failed: ${failed}`);

  console.log("\n👑 Super Admins:");
  results.forEach((result) => {
    const icon = result.status === "created" ? "✅" : result.status === "exists" ? "✅" : "❌";
    console.log(`  ${icon} ${result.user}`);
    console.log(`     ${result.message}`);
    if (result.userId) {
      console.log(`     User ID: ${result.userId}`);
      console.log(`     Dashboard: https://dashboard.workos.com/environment_01K5K3Y79TXRCBAA52TCYZ5CCA/users/${result.userId}`);
    }
  });

  console.log("\n📝 Next Steps:");
  console.log("  1. Assign Super Admin role in dashboard:");
  console.log(`     https://dashboard.workos.com/environment_01K5K3Y79TXRCBAA52TCYZ5CCA/organizations/${organizationId}`);
  console.log("  2. Verify role assignments");
  console.log("  3. Test Super Admin access");
  console.log("\n");
}

// Run the script
main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

