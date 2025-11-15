#!/usr/bin/env tsx

/**
 * ARA Group Platform - Complete Setup Script
 *
 * This script:
 * 1. Sets up Convex environment variables
 * 2. Creates all WorkOS organizations
 * 3. Verifies the setup
 */

import { execSync } from 'child_process';
import { config } from 'dotenv';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables
config({ path: join(process.cwd(), 'apps/app/.env.local') });
config({ path: join(process.cwd(), 'packages/database/.env.local') });

const WORKOS_API_KEY = process.env.WORKOS_API_KEY;
const WORKOS_CLIENT_ID = process.env.WORKOS_CLIENT_ID;

function runCommand(command: string, cwd?: string): string {
  try {
    return execSync(command, {
      cwd: cwd || process.cwd(),
      encoding: 'utf-8',
      stdio: 'pipe',
    }).trim();
  } catch (error: any) {
    throw new Error(`Command failed: ${command}\n${error.message}`);
  }
}

async function main() {
  console.log('🚀 ARA Group Platform - Complete Setup\n');
  console.log('='.repeat(80));

  // Step 1: Check WorkOS credentials
  console.log('\n📋 Step 1: Checking WorkOS Credentials\n');

  if (!WORKOS_API_KEY) {
    console.error('❌ WORKOS_API_KEY not found in environment');
    console.log('\n📝 Please set WORKOS_API_KEY:');
    console.log(
      '   1. Get your API key from: https://dashboard.workos.com/api-keys',
    );
    console.log('   2. Add to apps/app/.env.local: WORKOS_API_KEY=sk_...');
    console.log('   3. Or set in Convex: convex env set WORKOS_API_KEY sk_...');
    process.exit(1);
  }

  if (!WORKOS_CLIENT_ID) {
    console.log('⚠️  WORKOS_CLIENT_ID not found (optional for setup)');
  }

  console.log('✅ WorkOS API Key found');

  // Step 2: Set Convex environment variables
  console.log('\n💾 Step 2: Setting Convex Environment Variables\n');

  try {
    const convexPath = join(process.cwd(), 'packages/database');

    // Check if Convex is initialized
    if (!existsSync(join(convexPath, 'convex.json'))) {
      console.log('⚠️  Convex not initialized. Skipping Convex env setup.');
      console.log('   Run: cd packages/database && convex dev');
    } else {
      console.log('📦 Setting Convex environment variables...');

      // Set WorkOS API key
      if (WORKOS_API_KEY) {
        try {
          runCommand(
            `convex env set WORKOS_API_KEY "${WORKOS_API_KEY}"`,
            convexPath,
          );
          console.log('  ✅ WORKOS_API_KEY set in Convex');
        } catch (error) {
          console.log(
            '  ⚠️  Could not set WORKOS_API_KEY in Convex (may already be set)',
          );
        }
      }

      // Set WorkOS Client ID if available
      if (WORKOS_CLIENT_ID) {
        try {
          runCommand(
            `convex env set WORKOS_CLIENT_ID "${WORKOS_CLIENT_ID}"`,
            convexPath,
          );
          console.log('  ✅ WORKOS_CLIENT_ID set in Convex');
        } catch (error) {
          console.log('  ⚠️  Could not set WORKOS_CLIENT_ID in Convex');
        }
      }

      // Set admin emails
      const adminEmails = [
        'ed.federman@aragroup.com.au',
        'mark.brady@aliaslabs.ai',
        'dan.humphreys@aliaslabs.ai',
      ].join(',');

      try {
        runCommand(`convex env set ADMIN "${adminEmails}"`, convexPath);
        console.log('  ✅ ADMIN emails set in Convex');
      } catch (error) {
        console.log('  ⚠️  Could not set ADMIN in Convex');
      }
    }
  } catch (error) {
    console.log('  ⚠️  Convex CLI not available or not logged in');
    console.log('   Install: npm install -g convex');
    console.log('   Login: convex login');
  }

  // Step 3: Create WorkOS organizations
  console.log('\n🏢 Step 3: Creating WorkOS Organizations\n');
  console.log('Running setup script...\n');

  try {
    runCommand('pnpm run setup:ara-organizations');
    console.log('\n✅ Organizations created successfully');
  } catch (error: any) {
    console.error('\n❌ Failed to create organizations:', error.message);
    process.exit(1);
  }

  // Step 4: Summary
  console.log('\n' + '='.repeat(80));
  console.log('✅ Setup Complete!\n');
  console.log('Next Steps:');
  console.log('  1. Configure WorkOS Dashboard:');
  console.log('     - Branding (colors, logo)');
  console.log('     - Roles & Permissions');
  console.log('     - Webhooks: https://your-domain.com/api/webhooks/workos');
  console.log('  2. Verify Convex sync:');
  console.log('     - Check Convex dashboard for organizations');
  console.log('  3. Configure Vercel domains:');
  console.log('     - Add all 11 demo domains');
  console.log('     - Configure DNS CNAME records');
  console.log('\n');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
