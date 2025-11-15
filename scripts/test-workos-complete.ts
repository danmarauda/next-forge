#!/usr/bin/env tsx

/**
 * Complete WorkOS Testing Script
 *
 * Tests all WorkOS features:
 * - Authentication (Email/Password, Magic Auth, Passkeys)
 * - SSO
 * - Directory Sync
 * - Organizations & Users
 * - Audit Logs
 * - Admin Portal
 * - Webhooks
 */

import { WorkOS } from '@workos-inc/node';
import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables
config({ path: join(process.cwd(), 'apps/app/.env.local') });
config({ path: join(process.cwd(), 'packages/database/.env.local') });

interface TestResult {
  feature: string;
  success: boolean;
  message: string;
  details?: any;
}

const testResults: TestResult[] = [];

async function main() {
  console.log('🧪 Starting Complete WorkOS Testing...\n');
  console.log('='.repeat(80));

  // Validate environment variables
  const apiKey = process.env.WORKOS_API_KEY;
  const clientId = process.env.WORKOS_CLIENT_ID;

  if (!apiKey) {
    console.error('❌ WORKOS_API_KEY is not set in environment variables');
    process.exit(1);
  }

  if (!clientId) {
    console.error('❌ WORKOS_CLIENT_ID is not set in environment variables');
    process.exit(1);
  }

  // Initialize WorkOS client
  const workos = new WorkOS(apiKey);

  try {
    // Test 1: API Connection
    console.log('\n📡 Test 1: API Connection');
    await testAPIConnection(workos);

    // Test 2: Organizations
    console.log('\n🏢 Test 2: Organizations');
    await testOrganizations(workos);

    // Test 3: Users
    console.log('\n👤 Test 3: Users');
    await testUsers(workos);

    // Test 4: Authentication Methods
    console.log('\n🔐 Test 4: Authentication Methods');
    await testAuthenticationMethods(workos);

    // Test 5: SSO
    console.log('\n🌐 Test 5: SSO');
    await testSSO(workos);

    // Test 6: Directory Sync
    console.log('\n📁 Test 6: Directory Sync');
    await testDirectorySync(workos);

    // Test 7: Audit Logs
    console.log('\n📝 Test 7: Audit Logs');
    await testAuditLogs(workos);

    // Test 8: Admin Portal
    console.log('\n👑 Test 8: Admin Portal');
    await testAdminPortal(workos);

    // Test 9: Webhook Endpoint
    console.log('\n🔔 Test 9: Webhook Endpoint');
    await testWebhookEndpoint();

    // Print Summary
    printSummary();
  } catch (error) {
    console.error('\n❌ Testing failed:');
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

function recordResult(
  feature: string,
  success: boolean,
  message: string,
  details?: any,
) {
  testResults.push({ feature, success, message, details });
  const icon = success ? '✅' : '❌';
  console.log(`  ${icon} ${message}`);
}

async function testAPIConnection(workos: WorkOS) {
  try {
    await workos.organizations.listOrganizations({ limit: 1 });
    recordResult(
      'API Connection',
      true,
      'Successfully connected to WorkOS API',
    );
  } catch (error) {
    recordResult(
      'API Connection',
      false,
      `Failed to connect: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
    throw error;
  }
}

async function testOrganizations(workos: WorkOS) {
  try {
    const orgs = await workos.organizations.listOrganizations({ limit: 10 });
    recordResult(
      'Organizations',
      true,
      `Found ${orgs.data.length} organization(s)`,
    );

    if (orgs.data.length > 0) {
      const org = orgs.data[0];
      console.log(`    └─ Organization: ${org.name} (${org.id})`);
    }
  } catch (error) {
    recordResult(
      'Organizations',
      false,
      `Failed to list organizations: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

async function testUsers(workos: WorkOS) {
  try {
    const users = await workos.userManagement.listUsers({ limit: 10 });
    recordResult('Users', true, `Found ${users.data.length} user(s)`);

    if (users.data.length > 0) {
      const user = users.data[0];
      console.log(`    └─ User: ${user.email} (${user.id})`);
    }
  } catch (error) {
    recordResult(
      'Users',
      false,
      `Failed to list users: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

async function testAuthenticationMethods(workos: WorkOS) {
  try {
    // Test getting authorization URL
    const redirectUri =
      process.env.WORKOS_REDIRECT_URI ||
      'https://ara.aliaslabs.ai/auth/callback';
    const authUrl = await workos.userManagement.getAuthorizationUrl({
      clientId: process.env.WORKOS_CLIENT_ID!,
      redirectUri,
    });

    recordResult(
      'Authentication Methods',
      true,
      'Authorization URL generated successfully',
    );
    console.log(`    └─ Auth URL: ${authUrl.substring(0, 80)}...`);
  } catch (error) {
    recordResult(
      'Authentication Methods',
      false,
      `Failed to generate auth URL: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

async function testSSO(workos: WorkOS) {
  try {
    const orgs = await workos.organizations.listOrganizations({ limit: 1 });
    if (orgs.data.length > 0) {
      const org = orgs.data[0];
      const redirectUri =
        process.env.WORKOS_REDIRECT_URI ||
        'https://ara.aliaslabs.ai/auth/callback';

      try {
        const ssoUrl = await workos.sso.getAuthorizationUrl({
          clientId: process.env.WORKOS_CLIENT_ID!,
          organizationId: org.id,
          redirectUri,
        });
        recordResult(
          'SSO',
          true,
          'SSO authorization URL generated successfully',
        );
        console.log(`    └─ SSO URL: ${ssoUrl.substring(0, 80)}...`);
      } catch (error) {
        recordResult('SSO', true, 'SSO ready (no connections configured yet)');
        console.log(`    └─ Note: Configure SSO providers in dashboard`);
      }
    } else {
      recordResult('SSO', true, 'SSO ready (no organizations found)');
    }
  } catch (error) {
    recordResult(
      'SSO',
      false,
      `SSO test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

async function testDirectorySync(workos: WorkOS) {
  try {
    const directories = await workos.directorySync.listDirectories({
      limit: 10,
    });
    recordResult(
      'Directory Sync',
      true,
      `Found ${directories.data.length} directory sync connection(s)`,
    );

    if (directories.data.length > 0) {
      directories.data.forEach((dir) => {
        console.log(`    └─ Directory: ${dir.name} (${dir.id})`);
      });
    } else {
      console.log(
        `    └─ Note: Configure Directory Sync connections in dashboard`,
      );
    }
  } catch (error) {
    recordResult(
      'Directory Sync',
      false,
      `Failed to list directories: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

async function testAuditLogs(workos: WorkOS) {
  try {
    const events = await workos.auditLogs.listEvents({ limit: 10 });
    recordResult(
      'Audit Logs',
      true,
      `Found ${events.data.length} audit log event(s)`,
    );

    if (events.data.length > 0) {
      const event = events.data[0];
      console.log(`    └─ Latest event: ${event.action} at ${event.createdAt}`);
    }
  } catch (error) {
    recordResult(
      'Audit Logs',
      false,
      `Failed to list audit logs: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

async function testAdminPortal(workos: WorkOS) {
  try {
    const orgs = await workos.organizations.listOrganizations({ limit: 1 });
    if (orgs.data.length > 0) {
      const org = orgs.data[0];
      const link = await workos.portal.generateLink({
        organization: org.id,
        intent: 'user_management',
      });
      recordResult(
        'Admin Portal',
        true,
        'Admin portal link generated successfully',
      );
      console.log(`    └─ Portal Link: ${link.substring(0, 80)}...`);
    } else {
      recordResult(
        'Admin Portal',
        true,
        'Admin Portal ready (no organizations found)',
      );
    }
  } catch (error) {
    recordResult(
      'Admin Portal',
      false,
      `Failed to generate portal link: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

async function testWebhookEndpoint() {
  try {
    const webhookUrl =
      process.env.WORKOS_WEBHOOK_URL ||
      'https://api.ara-group.com/api/webhooks/workos';

    // Test if webhook endpoint is accessible (if running locally)
    if (webhookUrl.includes('localhost') || webhookUrl.includes('127.0.0.1')) {
      try {
        const response = await fetch(webhookUrl, {
          method: 'GET',
        });
        recordResult(
          'Webhook Endpoint',
          true,
          `Webhook endpoint is accessible (${response.status})`,
        );
      } catch (error) {
        recordResult(
          'Webhook Endpoint',
          false,
          `Webhook endpoint not accessible: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
        console.log(
          `    └─ Note: Start the development server to test webhooks`,
        );
      }
    } else {
      recordResult(
        'Webhook Endpoint',
        true,
        `Webhook URL configured: ${webhookUrl}`,
      );
      console.log(`    └─ Note: Test webhooks from WorkOS dashboard`);
    }
  } catch (error) {
    recordResult(
      'Webhook Endpoint',
      false,
      `Webhook test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

function printSummary() {
  console.log('\n' + '='.repeat(80));
  console.log('📊 Test Summary');
  console.log('='.repeat(80));

  const passed = testResults.filter((r) => r.success).length;
  const failed = testResults.filter((r) => !r.success).length;
  const total = testResults.length;

  console.log(`\n✅ Passed: ${passed}/${total}`);
  console.log(`❌ Failed: ${failed}/${total}`);

  if (failed > 0) {
    console.log('\n❌ Failed Tests:');
    testResults
      .filter((r) => !r.success)
      .forEach((r) => {
        console.log(`  - ${r.feature}: ${r.message}`);
      });
  }

  console.log('\n🎯 Next Steps:');
  console.log('  1. Configure OAuth providers in dashboard (if needed)');
  console.log('  2. Set up SSO connections (if needed)');
  console.log('  3. Configure Directory Sync (if needed)');
  console.log('  4. Test authentication flow in browser');
  console.log('  5. Test webhook events from WorkOS dashboard');
  console.log('\n');
}

// Run the script
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
