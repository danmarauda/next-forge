#!/usr/bin/env tsx

/**
 * WorkOS Features Implementation Script
 *
 * Implements and tests all WorkOS features programmatically where possible.
 * Features that require manual dashboard configuration are documented.
 */

import { WorkOS } from '@workos-inc/node';
import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables
config({ path: join(process.cwd(), 'apps/app/.env.local') });
config({ path: join(process.cwd(), 'packages/database/.env.local') });

interface ImplementationResult {
  feature: string;
  status: 'completed' | 'partial' | 'manual' | 'failed';
  message: string;
  details?: any;
  dashboardUrl?: string;
}

const results: ImplementationResult[] = [];

async function main() {
  console.log('🚀 Implementing All WorkOS Features\n');
  console.log('='.repeat(80));

  const apiKey = process.env.WORKOS_API_KEY;
  if (!apiKey) {
    console.error('❌ WORKOS_API_KEY is not set');
    process.exit(1);
  }

  const workos = new WorkOS(apiKey);

  try {
    // Feature 1: Verify Core Setup
    console.log('\n📋 Feature 1: Core Setup Verification');
    await verifyCoreSetup(workos);

    // Feature 2: Roles & Permissions (via API where possible)
    console.log('\n🎭 Feature 2: Roles & Permissions');
    await implementRolesAndPermissions(workos);

    // Feature 3: Test Organizations & Users
    console.log('\n👥 Feature 3: Organizations & Users');
    await testOrganizationsAndUsers(workos);

    // Feature 4: Test SSO Configuration
    console.log('\n🌐 Feature 4: SSO Configuration');
    await testSSOConfiguration(workos);

    // Feature 5: Test Directory Sync
    console.log('\n📁 Feature 5: Directory Sync');
    await testDirectorySync(workos);

    // Feature 6: Test Audit Logs
    console.log('\n📝 Feature 6: Audit Logs');
    await testAuditLogs(workos);

    // Feature 7: Test Admin Portal
    console.log('\n👑 Feature 7: Admin Portal');
    await testAdminPortal(workos);

    // Feature 8: Test Webhooks
    console.log('\n🔔 Feature 8: Webhooks');
    await testWebhooks();

    // Print Summary
    printSummary();
  } catch (error) {
    console.error(
      '\n❌ Implementation failed:',
      error instanceof Error ? error.message : error,
    );
    process.exit(1);
  }
}

function recordResult(
  feature: string,
  status: 'completed' | 'partial' | 'manual' | 'failed',
  message: string,
  details?: any,
  dashboardUrl?: string,
) {
  results.push({ feature, status, message, details, dashboardUrl });
  const icon =
    status === 'completed'
      ? '✅'
      : status === 'partial'
        ? '⚠️'
        : status === 'manual'
          ? '📝'
          : '❌';
  console.log(`  ${icon} ${message}`);
}

async function verifyCoreSetup(workos: WorkOS) {
  try {
    // Verify API connection
    await workos.organizations.listOrganizations({ limit: 1 });
    recordResult('Core Setup', 'completed', 'API connection verified');

    // Verify application configuration
    const redirectUri = process.env.WORKOS_REDIRECT_URI;
    if (redirectUri) {
      recordResult(
        'Redirect URI',
        'completed',
        `Redirect URI configured: ${redirectUri}`,
      );
    } else {
      recordResult('Redirect URI', 'failed', 'Redirect URI not configured');
    }

    const webhookUrl = process.env.WORKOS_WEBHOOK_URL;
    if (webhookUrl) {
      recordResult('Webhook', 'completed', `Webhook configured: ${webhookUrl}`);
    } else {
      recordResult('Webhook', 'partial', 'Webhook URL not set in environment');
    }
  } catch (error) {
    recordResult(
      'Core Setup',
      'failed',
      `Failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

async function implementRolesAndPermissions(workos: WorkOS) {
  // Note: WorkOS Roles & Permissions are typically configured via dashboard
  // This function documents the recommended structure

  const recommendedRoles = [
    {
      name: 'Admin',
      permissions: [
        'users.read',
        'users.write',
        'users.delete',
        'organizations.read',
        'organizations.write',
        'organizations.delete',
        'settings.read',
        'settings.write',
      ],
    },
    {
      name: 'Manager',
      permissions: [
        'users.read',
        'users.write',
        'organizations.read',
        'reports.read',
      ],
    },
    {
      name: 'Member',
      permissions: ['users.read', 'organizations.read'],
    },
    {
      name: 'Viewer',
      permissions: ['users.read', 'organizations.read'],
    },
  ];

  recordResult(
    'Roles & Permissions',
    'manual',
    'Configure in dashboard - see WORKOS_STEP_BY_STEP_SETUP.md',
    { recommendedRoles },
    'https://dashboard.workos.com/environment_01K5K3Y79TXRCBAA52TCYZ5CCA/roles-and-permissions',
  );
}

async function testOrganizationsAndUsers(workos: WorkOS) {
  try {
    // List organizations
    const orgs = await workos.organizations.listOrganizations({ limit: 10 });
    recordResult(
      'Organizations',
      'completed',
      `Found ${orgs.data.length} organization(s)`,
      {
        count: orgs.data.length,
        organizations: orgs.data.map((o) => ({ id: o.id, name: o.name })),
      },
    );

    // List users
    const users = await workos.userManagement.listUsers({ limit: 10 });
    recordResult('Users', 'completed', `Found ${users.data.length} user(s)`, {
      count: users.data.length,
    });
  } catch (error) {
    recordResult(
      'Organizations & Users',
      'failed',
      `Failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

async function testSSOConfiguration(workos: WorkOS) {
  try {
    const orgs = await workos.organizations.listOrganizations({ limit: 1 });
    if (orgs.data.length > 0) {
      const org = orgs.data[0];
      recordResult(
        'SSO',
        'manual',
        'SSO ready - configure providers in dashboard',
        { organizationId: org.id },
        `https://dashboard.workos.com/environment_01K5K3Y79TXRCBAA52TCYZ5CCA/organizations/${org.id}/sso`,
      );
    } else {
      recordResult(
        'SSO',
        'partial',
        'No organizations found - create organization first',
      );
    }
  } catch (error) {
    recordResult(
      'SSO',
      'failed',
      `Failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

async function testDirectorySync(workos: WorkOS) {
  try {
    const directories = await workos.directorySync.listDirectories({
      limit: 10,
    });
    if (directories.data.length > 0) {
      recordResult(
        'Directory Sync',
        'completed',
        `Found ${directories.data.length} directory sync connection(s)`,
        { count: directories.data.length },
      );
    } else {
      recordResult(
        'Directory Sync',
        'manual',
        'No directories configured - set up in dashboard',
        {},
        'https://dashboard.workos.com/environment_01K5K3Y79TXRCBAA52TCYZ5CCA/organizations/{org_id}/directory-sync',
      );
    }
  } catch (error) {
    recordResult(
      'Directory Sync',
      'failed',
      `Failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

async function testAuditLogs(workos: WorkOS) {
  try {
    const events = await workos.auditLogs.listEvents({ limit: 10 });
    recordResult(
      'Audit Logs',
      'completed',
      `Audit logs enabled - found ${events.data.length} event(s)`,
      { count: events.data.length },
    );
  } catch (error) {
    recordResult(
      'Audit Logs',
      'failed',
      `Failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
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
        'completed',
        'Admin portal link generated successfully',
        { link: link.substring(0, 80) + '...' },
      );
    } else {
      recordResult('Admin Portal', 'partial', 'No organizations found');
    }
  } catch (error) {
    recordResult(
      'Admin Portal',
      'failed',
      `Failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

async function testWebhooks() {
  const webhookUrl = process.env.WORKOS_WEBHOOK_URL;
  if (webhookUrl) {
    if (webhookUrl.startsWith('https://')) {
      recordResult(
        'Webhooks',
        'completed',
        `Webhook endpoint configured: ${webhookUrl}`,
        { url: webhookUrl },
      );
    } else {
      recordResult(
        'Webhooks',
        'partial',
        `Webhook configured but using HTTP: ${webhookUrl}`,
        { url: webhookUrl, recommendation: 'Use HTTPS in production' },
      );
    }
  } else {
    recordResult('Webhooks', 'partial', 'Webhook URL not configured');
  }
}

function printSummary() {
  console.log('\n' + '='.repeat(80));
  console.log('📊 Implementation Summary');
  console.log('='.repeat(80));

  const completed = results.filter((r) => r.status === 'completed').length;
  const partial = results.filter((r) => r.status === 'partial').length;
  const manual = results.filter((r) => r.status === 'manual').length;
  const failed = results.filter((r) => r.status === 'failed').length;

  console.log(`\n✅ Completed: ${completed}`);
  console.log(`⚠️  Partial: ${partial}`);
  console.log(`📝 Manual: ${manual}`);
  console.log(`❌ Failed: ${failed}`);

  if (manual > 0) {
    console.log('\n📝 Manual Configuration Required:');
    results
      .filter((r) => r.status === 'manual')
      .forEach((r) => {
        console.log(`  - ${r.feature}: ${r.message}`);
        if (r.dashboardUrl) {
          console.log(`    Dashboard: ${r.dashboardUrl}`);
        }
      });
  }

  if (failed > 0) {
    console.log('\n❌ Failed Implementations:');
    results
      .filter((r) => r.status === 'failed')
      .forEach((r) => {
        console.log(`  - ${r.feature}: ${r.message}`);
      });
  }

  console.log('\n📚 Next Steps:');
  console.log('  1. Complete manual configurations in dashboard');
  console.log('  2. Follow WORKOS_STEP_BY_STEP_SETUP.md for detailed guides');
  console.log('  3. Test all features');
  console.log('  4. Run validation: pnpm run check:workos:practices');
  console.log('\n');
}

// Run the script
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
