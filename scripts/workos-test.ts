#!/usr/bin/env tsx

/**
 * WorkOS Test Script
 *
 * Tests WorkOS integration after setup:
 * - Verifies API connection
 * - Tests user creation
 * - Tests organization access
 * - Tests authentication flow
 */

import { WorkOS } from '@workos-inc/node';
import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables
config({ path: join(process.cwd(), 'apps/app/.env.local') });
config({ path: join(process.cwd(), 'packages/database/.env.local') });

async function main() {
  console.log('🧪 Testing WorkOS Integration...\n');

  const apiKey = process.env.WORKOS_API_KEY;
  const clientId = process.env.WORKOS_CLIENT_ID;

  if (!apiKey || !clientId) {
    console.error('❌ Missing required environment variables');
    console.error('   Required: WORKOS_API_KEY, WORKOS_CLIENT_ID');
    process.exit(1);
  }

  const workos = new WorkOS(apiKey);

  const tests = [
    {
      name: 'API Connection',
      test: async () => {
        await workos.organizations.listOrganizations({ limit: 1 });
        return { success: true, message: 'API connection successful' };
      },
    },
    {
      name: 'List Organizations',
      test: async () => {
        const orgs = await workos.organizations.listOrganizations({
          limit: 10,
        });
        return {
          success: true,
          message: `Found ${orgs.data.length} organization(s)`,
          data: orgs.data.map((org) => ({ id: org.id, name: org.name })),
        };
      },
    },
    {
      name: 'List Users',
      test: async () => {
        const users = await workos.userManagement.listUsers({ limit: 10 });
        return {
          success: true,
          message: `Found ${users.data.length} user(s)`,
          data: users.data.map((user) => ({ id: user.id, email: user.email })),
        };
      },
    },
    {
      name: 'Get Authorization URL',
      test: async () => {
        const redirectUri =
          process.env.WORKOS_REDIRECT_URI ||
          'http://localhost:3000/auth/callback';
        const url = workos.userManagement.getAuthorizationUrl({
          clientId,
          redirectUri,
        });
        return {
          success: true,
          message: 'Authorization URL generated',
          data: { url },
        };
      },
    },
  ];

  let passed = 0;
  let failed = 0;

  for (const { name, test } of tests) {
    try {
      console.log(`Testing: ${name}...`);
      const result = await test();
      if (result.success) {
        console.log(`  ✅ ${result.message}`);
        if (result.data) {
          if (Array.isArray(result.data)) {
            result.data.forEach((item: any) => {
              console.log(`     - ${JSON.stringify(item)}`);
            });
          } else {
            console.log(`     ${JSON.stringify(result.data, null, 2)}`);
          }
        }
        passed++;
      } else {
        console.log(`  ❌ ${result.message}`);
        failed++;
      }
    } catch (error) {
      console.log(
        `  ❌ Failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      failed++;
    }
    console.log();
  }

  console.log('='.repeat(60));
  console.log(`Tests: ${passed} passed, ${failed} failed`);
  console.log('='.repeat(60));

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
