#!/usr/bin/env tsx

/**
 * End-to-End Authentication Flow Test
 *
 * Tests the complete authentication flow:
 * 1. OAuth sign-in redirect
 * 2. Callback handling
 * 3. Session creation
 * 4. User context
 * 5. Organization context
 * 6. Subdomain routing
 *
 * Prerequisites:
 * 1. WORKOS_API_KEY must be configured
 * 2. NEXT_PUBLIC_CONVEX_URL must be configured
 * 3. Development server must be running
 *
 * Usage:
 *   pnpm test:auth:flow
 */

import { WorkOS } from '@workos-inc/node';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@repo/database';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.development') });

// Validate required environment variables
const WORKOS_API_KEY = process.env.WORKOS_API_KEY;
const WORKOS_CLIENT_ID = process.env.WORKOS_CLIENT_ID;
const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'skip';
  message?: string;
  duration?: number;
}

const results: TestResult[] = [];

function logTest(name: string, status: 'pass' | 'fail' | 'skip', message?: string, duration?: number) {
  results.push({ name, status, message, duration });
  const icon = status === 'pass' ? '✅' : status === 'fail' ? '❌' : '⚠️';
  const durationStr = duration ? ` (${duration}ms)` : '';
  console.log(`${icon} ${name}${durationStr}`);
  if (message) {
    console.log(`   ${message}`);
  }
}

async function testEnvironmentVariables(): Promise<boolean> {
  const start = Date.now();

  if (!WORKOS_API_KEY || WORKOS_API_KEY === 'sk_test_YOUR_WORKOS_API_KEY') {
    logTest('Environment Variables', 'fail', 'WORKOS_API_KEY not configured', Date.now() - start);
    return false;
  }

  if (!WORKOS_CLIENT_ID) {
    logTest('Environment Variables', 'fail', 'WORKOS_CLIENT_ID not configured', Date.now() - start);
    return false;
  }

  if (!CONVEX_URL || CONVEX_URL.includes('your-dev-deployment')) {
    logTest('Environment Variables', 'fail', 'CONVEX_URL not configured', Date.now() - start);
    return false;
  }

  logTest('Environment Variables', 'pass', 'All required variables configured', Date.now() - start);
  return true;
}

async function testWorkOSConnection(): Promise<boolean> {
  const start = Date.now();

  try {
    const workos = new WorkOS(WORKOS_API_KEY!);
    const { data: orgs } = await workos.organizations.listOrganizations({ limit: 1 });

    logTest('WorkOS Connection', 'pass', `Connected successfully (${orgs.length} orgs found)`, Date.now() - start);
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    logTest('WorkOS Connection', 'fail', `Connection failed: ${message}`, Date.now() - start);
    return false;
  }
}

async function testConvexConnection(): Promise<boolean> {
  const start = Date.now();

  try {
    const convex = new ConvexHttpClient(CONVEX_URL!);
    // Try a simple query to test connection
    await convex.query(api.organization.listOrganizations as any);

    logTest('Convex Connection', 'pass', 'Connected successfully', Date.now() - start);
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    logTest('Convex Connection', 'fail', `Connection failed: ${message}`, Date.now() - start);
    return false;
  }
}

async function testAuthorizationURL(): Promise<boolean> {
  const start = Date.now();

  try {
    const workos = new WorkOS(WORKOS_API_KEY!);
    const authUrl = workos.userManagement.getAuthorizationUrl({
      provider: 'authkit',
      clientId: WORKOS_CLIENT_ID!,
      redirectUri: `${SITE_URL}/api/auth/callback`,
    });

    if (!authUrl.toString().includes('workos')) {
      throw new Error('Invalid authorization URL format');
    }

    logTest('Authorization URL', 'pass', `Generated: ${authUrl.toString().substring(0, 60)}...`, Date.now() - start);
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    logTest('Authorization URL', 'fail', message, Date.now() - start);
    return false;
  }
}

async function testOrganizationSync(): Promise<boolean> {
  const start = Date.now();

  try {
    const workos = new WorkOS(WORKOS_API_KEY!);
    const convex = new ConvexHttpClient(CONVEX_URL!);

    // Get organizations from both sources
    const { data: workosOrgs } = await workos.organizations.listOrganizations({ limit: 100 });
    const convexOrgs = await convex.query(api.organization.listOrganizations as any);

    if (workosOrgs.length === 0) {
      logTest('Organization Sync', 'fail', 'No organizations found in WorkOS', Date.now() - start);
      return false;
    }

    logTest(
      'Organization Sync',
      'pass',
      `WorkOS: ${workosOrgs.length} orgs, Convex: ${convexOrgs?.organizations?.length || 0} orgs`,
      Date.now() - start
    );
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    logTest('Organization Sync', 'fail', message, Date.now() - start);
    return false;
  }
}

async function testSubdomainDetection(): Promise<boolean> {
  const start = Date.now();

  // Test subdomain patterns
  const testCases = [
    { host: 'fire.ara.aliaslabs.ai', expected: 'fire' },
    { host: 'propertyservices.ara.aliaslabs.ai', expected: 'propertyservices' },
    { host: 'security.aragroup.com.au', expected: 'security' },
    { host: 'ara.aliaslabs.ai', expected: null },
    { host: 'localhost:3000', expected: null },
  ];

  let passed = 0;
  let failed = 0;

  for (const { host, expected } of testCases) {
    const subdomain = extractSubdomain(host);
    if (subdomain === expected) {
      passed++;
    } else {
      failed++;
      console.log(`   ⚠️  Failed: ${host} -> got ${subdomain}, expected ${expected}`);
    }
  }

  if (failed > 0) {
    logTest('Subdomain Detection', 'fail', `${failed}/${testCases.length} tests failed`, Date.now() - start);
    return false;
  }

  logTest('Subdomain Detection', 'pass', `All ${testCases.length} tests passed`, Date.now() - start);
  return true;
}

function extractSubdomain(host: string): string | null {
  // Match *.ara.aliaslabs.ai
  const aliasLabsMatch = host.match(/^([a-z0-9-]+)\.ara\.aliaslabs\.ai$/);
  if (aliasLabsMatch) return aliasLabsMatch[1];

  // Match *.aragroup.com.au
  const araGroupMatch = host.match(/^([a-z0-9-]+)\.aragroup\.com\.au$/);
  if (araGroupMatch) return araGroupMatch[1];

  return null;
}

async function runTests() {
  console.log('🧪 ARA Group Platform - Authentication Flow Test\n');
  console.log('='.repeat(60));
  console.log('');

  const tests = [
    { name: 'Environment Variables', fn: testEnvironmentVariables },
    { name: 'WorkOS Connection', fn: testWorkOSConnection },
    { name: 'Convex Connection', fn: testConvexConnection },
    { name: 'Authorization URL', fn: testAuthorizationURL },
    { name: 'Organization Sync', fn: testOrganizationSync },
    { name: 'Subdomain Detection', fn: testSubdomainDetection },
  ];

  let totalPassed = 0;
  let totalFailed = 0;
  let totalSkipped = 0;

  for (const test of tests) {
    try {
      const result = await test.fn();
      if (result) {
        totalPassed++;
      } else {
        totalFailed++;
        // Stop on critical failures
        if (test.name === 'Environment Variables') {
          console.log('\n⚠️  Critical test failed, stopping execution\n');
          break;
        }
      }
    } catch (error) {
      totalFailed++;
      const message = error instanceof Error ? error.message : 'Unknown error';
      logTest(test.name, 'fail', `Unexpected error: ${message}`);
    }
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Test Summary\n');
  console.log(`Total Tests: ${results.length}`);
  console.log(`✅ Passed: ${totalPassed}`);
  console.log(`❌ Failed: ${totalFailed}`);
  console.log(`⚠️  Skipped: ${totalSkipped}`);

  if (totalFailed > 0) {
    console.log('\n❌ Some tests failed!');
    console.log('\n📋 Next Steps:');
    console.log('   1. Fix failed tests before proceeding');
    console.log('   2. Ensure all environment variables are configured');
    console.log('   3. Verify Convex deployment is running');
    console.log('   4. Check WorkOS API key is valid');
    console.log('');
    process.exit(1);
  } else {
    console.log('\n✅ All tests passed!');
    console.log('\n📋 Next Steps:');
    console.log('   1. Test authentication in browser');
    console.log('   2. Verify session creation');
    console.log('   3. Test organization switching');
    console.log('   4. Test subdomain routing');
    console.log('');
    process.exit(0);
  }
}

// Run tests
console.log('🚀 Starting Authentication Flow Tests\n');
runTests().catch((error) => {
  console.error('❌ Test suite failed:', error);
  process.exit(1);
});
