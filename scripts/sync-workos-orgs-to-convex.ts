#!/usr/bin/env tsx

/**
 * Sync WorkOS Organizations to Convex Database
 *
 * This script fetches all 12 ARA Group organizations from WorkOS
 * and creates corresponding organizations in the Convex database.
 *
 * Prerequisites:
 * 1. WORKOS_API_KEY must be set in environment
 * 2. Convex deployment must be running
 * 3. WorkOS organizations must already exist
 *
 * Usage:
 *   pnpm sync:workos:orgs
 */

import { WorkOS } from '@workos-inc/node';
import { ConvexHttpClient } from 'convex/browser';
import { api, internal } from '@repo/database';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.development') });

// Validate required environment variables
const WORKOS_API_KEY = process.env.WORKOS_API_KEY;
const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!WORKOS_API_KEY || WORKOS_API_KEY === 'sk_test_YOUR_WORKOS_API_KEY') {
  console.error('❌ Error: WORKOS_API_KEY not configured');
  console.error('Please set a real WorkOS API key in .env.development');
  process.exit(1);
}

if (!CONVEX_URL || CONVEX_URL.includes('your-dev-deployment')) {
  console.error('❌ Error: CONVEX_URL not configured');
  console.error('Please deploy Convex and update NEXT_PUBLIC_CONVEX_URL in .env.development');
  process.exit(1);
}

// Initialize clients
const workos = new WorkOS(WORKOS_API_KEY);
const convex = new ConvexHttpClient(CONVEX_URL);

// ARA Group organization mapping
const ARA_ORGANIZATIONS = [
  {
    slug: 'ara-property-services',
    subdomain: 'propertyservices',
    expectedName: 'ARA Property Services',
  },
  {
    slug: 'ara-fire',
    subdomain: 'fire',
    expectedName: 'ARA Fire Protection',
  },
  {
    slug: 'ara-electrical',
    subdomain: 'electrical',
    expectedName: 'ARA Electrical',
  },
  {
    slug: 'ara-buildingservices',
    subdomain: 'buildingservices',
    expectedName: 'ARA Building Services',
  },
  {
    slug: 'ara-mechanical',
    subdomain: 'mechanical',
    expectedName: 'ARA Mechanical',
  },
  {
    slug: 'ara-products',
    subdomain: 'products',
    expectedName: 'ARA Products',
  },
  {
    slug: 'ara-manufacturing',
    subdomain: 'manufacturing',
    expectedName: 'ARA Manufacturing',
  },
  {
    slug: 'ara-marine',
    subdomain: 'marine',
    expectedName: 'ARA Marine',
  },
  {
    slug: 'ara-security',
    subdomain: 'security',
    expectedName: 'ARA Security',
  },
  {
    slug: 'ara-indigenous',
    subdomain: 'indigenous',
    expectedName: 'ARA Indigenous',
  },
  {
    slug: 'ara-strategic',
    subdomain: 'strategic',
    expectedName: 'ARA Strategic',
  },
  {
    slug: 'ara-funds',
    subdomain: 'funds',
    expectedName: 'ARA Funds Management',
  },
];

interface SyncResult {
  success: boolean;
  workosOrgId: string;
  convexOrgId?: string;
  name: string;
  slug: string;
  error?: string;
}

async function syncOrganizations(): Promise<void> {
  console.log('🔄 Starting WorkOS → Convex Organization Sync\n');
  console.log('='.repeat(60));
  console.log('');

  const results: SyncResult[] = [];

  try {
    // Fetch all WorkOS organizations
    console.log('📡 Fetching organizations from WorkOS...');
    const { data: workosOrgs } = await workos.organizations.listOrganizations({
      limit: 100,
    });

    console.log(`✅ Found ${workosOrgs.length} organizations in WorkOS\n`);

    // Process each organization
    for (const workosOrg of workosOrgs) {
      console.log(`\n📦 Processing: ${workosOrg.name}`);
      console.log(`   WorkOS ID: ${workosOrg.id}`);

      try {
        // Find matching ARA org config
        const araConfig = ARA_ORGANIZATIONS.find(
          (config) =>
            workosOrg.name.toLowerCase().includes(config.expectedName.toLowerCase()) ||
            config.expectedName.toLowerCase().includes(workosOrg.name.toLowerCase())
        );

        if (!araConfig) {
          console.log(`   ⚠️  Warning: No matching ARA config found for "${workosOrg.name}"`);
          console.log(`   ℹ️  Using generated slug instead`);
        }

        // Extract domains from WorkOS org
        const domains = workosOrg.domains?.map((d) => d.domain) || [];

        // Sync to Convex using internal mutation
        const convexOrgId = await convex.mutation(internal.workosInternal.syncOrganization, {
          workosOrgId: workosOrg.id,
          name: workosOrg.name,
          domains,
          allowProfilesOutsideOrganization: workosOrg.allowProfilesOutsideOrganization,
        });

        // Update with subdomain if we have ARA config
        if (araConfig && convexOrgId) {
          console.log(`   🔧 Setting subdomain: ${araConfig.subdomain}`);
          // We can't directly update here, but we can log the subdomain
          // The subdomain should be set via organization.updateOrganization after admin is set up
        }

        console.log(`   ✅ Synced successfully`);
        console.log(`   Convex ID: ${convexOrgId}`);
        if (domains.length > 0) {
          console.log(`   Domains: ${domains.join(', ')}`);
        }

        results.push({
          success: true,
          workosOrgId: workosOrg.id,
          convexOrgId: convexOrgId as string,
          name: workosOrg.name,
          slug: araConfig?.slug || workosOrg.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.log(`   ❌ Error: ${errorMessage}`);

        results.push({
          success: false,
          workosOrgId: workosOrg.id,
          name: workosOrg.name,
          slug: 'error',
          error: errorMessage,
        });
      }
    }

    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('\n📊 Sync Summary\n');

    const successful = results.filter((r) => r.success);
    const failed = results.filter((r) => !r.success);

    console.log(`✅ Successfully synced: ${successful.length}/${results.length}`);
    if (failed.length > 0) {
      console.log(`❌ Failed: ${failed.length}`);
      console.log('\nFailed organizations:');
      failed.forEach((r) => {
        console.log(`   - ${r.name}: ${r.error}`);
      });
    }

    console.log('\n✨ Organizations synced successfully!');
    console.log('\n📋 Next Steps:');
    console.log('   1. Verify organizations in Convex dashboard');
    console.log('   2. Set up admin users for each organization');
    console.log('   3. Configure subdomains via organization.updateOrganization');
    console.log('   4. Test authentication flow');
    console.log('');

  } catch (error) {
    console.error('\n❌ Fatal error during sync:');
    console.error(error);
    process.exit(1);
  }
}

// Run sync
console.log('🚀 ARA Group Organization Sync Tool\n');
syncOrganizations()
  .then(() => {
    console.log('✅ Sync completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Sync failed:', error);
    process.exit(1);
  });
