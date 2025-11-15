#!/usr/bin/env tsx

/**
 * Set Convex Environment Variables for ARA Group Platform
 *
 * This script sets all required environment variables in Convex
 */

import { execSync } from 'child_process';
import { config } from 'dotenv';
import { join } from 'path';
import * as readline from 'readline';

// Load environment variables
config({ path: join(process.cwd(), 'apps/app/.env.local') });
config({ path: join(process.cwd(), 'packages/database/.env.local') });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

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
  console.log('💾 ARA Group Platform - Convex Environment Setup\n');
  console.log('='.repeat(80));

  const convexPath = join(process.cwd(), 'packages/database');

  // Check if Convex is initialized
  try {
    runCommand('convex --version', convexPath);
  } catch (error) {
    console.error('❌ Convex CLI not found');
    console.log('\nInstall Convex CLI:');
    console.log('  npm install -g convex');
    console.log('  convex login');
    process.exit(1);
  }

  // Get WorkOS credentials
  let workosApiKey = process.env.WORKOS_API_KEY;
  let workosClientId = process.env.WORKOS_CLIENT_ID;

  if (!workosApiKey) {
    console.log('\n📝 WorkOS API Key not found in environment');
    workosApiKey = await question('Enter WorkOS API Key (sk_...): ');
  }

  if (!workosClientId) {
    console.log('\n📝 WorkOS Client ID not found in environment');
    workosClientId = await question('Enter WorkOS Client ID (client_...): ');
  }

  // Admin emails
  const adminEmails = [
    'ed.federman@aragroup.com.au',
    'mark.brady@aliaslabs.ai',
    'dan.humphreys@aliaslabs.ai',
  ].join(',');

  console.log('\n🔧 Setting Convex Environment Variables...\n');

  const envVars = [
    { name: 'WORKOS_API_KEY', value: workosApiKey },
    { name: 'WORKOS_CLIENT_ID', value: workosClientId },
    { name: 'ADMIN', value: adminEmails },
  ];

  for (const envVar of envVars) {
    try {
      console.log(`Setting ${envVar.name}...`);
      runCommand(`convex env set ${envVar.name} "${envVar.value}"`, convexPath);
      console.log(`  ✅ ${envVar.name} set`);
    } catch (error: any) {
      console.log(`  ⚠️  ${envVar.name}: ${error.message}`);
    }
  }

  console.log('\n✅ Environment variables set!');
  console.log(
    "\nNext: Run 'pnpm run setup:ara-organizations' to create WorkOS organizations\n",
  );

  rl.close();
}

main().catch((error) => {
  console.error('Fatal error:', error);
  rl.close();
  process.exit(1);
});
