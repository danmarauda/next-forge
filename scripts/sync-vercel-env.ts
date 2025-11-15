#!/usr/bin/env tsx
/**
 * Sync Environment Variables to Vercel
 *
 * This script reads environment variables from .env files and syncs them to Vercel.
 *
 * Usage:
 *   pnpm sync:env:dev      # Sync development env vars
 *   pnpm sync:env:staging  # Sync staging env vars
 *   pnpm sync:env:prod     # Sync production env vars
 *   pnpm sync:env:all      # Sync all environments
 *
 * Requirements:
 *   - VERCEL_TOKEN environment variable must be set
 *   - VERCEL_PROJECT_ID environment variable must be set
 *   - VERCEL_TEAM_ID environment variable (optional, for team projects)
 */

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface EnvVar {
  key: string;
  value: string;
  target: ('production' | 'preview' | 'development')[];
  type: 'encrypted' | 'plain';
}

const VERCEL_API = 'https://api.vercel.com';

// Get required environment variables
const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID;

if (!VERCEL_TOKEN) {
  console.error('❌ VERCEL_TOKEN environment variable is required');
  console.error('   Get your token from: https://vercel.com/account/tokens');
  process.exit(1);
}

if (!VERCEL_PROJECT_ID) {
  console.error('❌ VERCEL_PROJECT_ID environment variable is required');
  console.error('   Find your project ID in Vercel project settings');
  process.exit(1);
}

/**
 * Parse .env file into key-value pairs
 */
function parseEnvFile(filePath: string): Record<string, string> {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const env: Record<string, string> = {};

    for (const line of content.split('\n')) {
      const trimmed = line.trim();

      // Skip comments and empty lines
      if (!trimmed || trimmed.startsWith('#')) continue;

      // Parse KEY=VALUE
      const match = trimmed.match(/^([^=]+)=(.*)$/);
      if (match) {
        const [, key, value] = match;
        // Remove quotes if present
        const cleanValue = value.replace(/^["']|["']$/g, '');
        env[key.trim()] = cleanValue;
      }
    }

    return env;
  } catch (error) {
    console.error(`❌ Failed to read ${filePath}:`, error);
    return {};
  }
}

/**
 * Get existing environment variables from Vercel
 */
async function getExistingEnvVars(): Promise<Record<string, string>> {
  const url = new URL(`/v9/projects/${VERCEL_PROJECT_ID}/env`, VERCEL_API);
  if (VERCEL_TEAM_ID) {
    url.searchParams.set('teamId', VERCEL_TEAM_ID);
  }

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${VERCEL_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch env vars: ${response.statusText}`);
  }

  const data = await response.json();
  const existing: Record<string, string> = {};

  for (const envVar of data.envs || []) {
    existing[envVar.key] = envVar.id;
  }

  return existing;
}

/**
 * Create or update environment variable in Vercel
 */
async function upsertEnvVar(
  key: string,
  value: string,
  target: ('production' | 'preview' | 'development')[],
  existingId?: string,
): Promise<void> {
  const url = new URL(
    existingId
      ? `/v9/projects/${VERCEL_PROJECT_ID}/env/${existingId}`
      : `/v10/projects/${VERCEL_PROJECT_ID}/env`,
    VERCEL_API,
  );

  if (VERCEL_TEAM_ID) {
    url.searchParams.set('teamId', VERCEL_TEAM_ID);
  }

  const body: any = {
    key,
    value,
    target,
    type: 'encrypted',
  };

  const response = await fetch(url.toString(), {
    method: existingId ? 'PATCH' : 'POST',
    headers: {
      Authorization: `Bearer ${VERCEL_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(
      `Failed to ${existingId ? 'update' : 'create'} ${key}: ${error}`,
    );
  }
}

/**
 * Sync environment variables to Vercel
 */
async function syncEnvVars(
  envFile: string,
  target: ('production' | 'preview' | 'development')[],
): Promise<void> {
  console.log(`\n📦 Syncing ${envFile} to Vercel (${target.join(', ')})...`);

  const envVars = parseEnvFile(envFile);
  const keys = Object.keys(envVars);

  if (keys.length === 0) {
    console.log('⚠️  No environment variables found');
    return;
  }

  console.log(`   Found ${keys.length} environment variables`);

  // Get existing env vars
  const existing = await getExistingEnvVars();

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const key of keys) {
    const value = envVars[key];

    // Skip empty values
    if (!value || value === '""' || value === "''") {
      skipped++;
      continue;
    }

    try {
      const existingId = existing[key];
      await upsertEnvVar(key, value, target, existingId);

      if (existingId) {
        updated++;
        console.log(`   ✓ Updated ${key}`);
      } else {
        created++;
        console.log(`   ✓ Created ${key}`);
      }
    } catch (error) {
      console.error(`   ✗ Failed to sync ${key}:`, error);
    }
  }

  console.log(`\n✅ Sync complete:`);
  console.log(`   Created: ${created}`);
  console.log(`   Updated: ${updated}`);
  console.log(`   Skipped: ${skipped}`);
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  const environment = args[0] || 'development';

  console.log('🚀 Vercel Environment Variable Sync');
  console.log(`   Project ID: ${VERCEL_PROJECT_ID}`);
  if (VERCEL_TEAM_ID) {
    console.log(`   Team ID: ${VERCEL_TEAM_ID}`);
  }

  const rootDir = resolve(__dirname, '..');

  switch (environment) {
    case 'development':
    case 'dev':
      await syncEnvVars(resolve(rootDir, '.env.development'), [
        'development',
        'preview',
      ]);
      break;

    case 'staging':
      await syncEnvVars(resolve(rootDir, '.env.staging'), ['preview']);
      break;

    case 'production':
    case 'prod':
      await syncEnvVars(resolve(rootDir, '.env.production'), ['production']);
      break;

    case 'all':
      await syncEnvVars(resolve(rootDir, '.env.development'), ['development']);
      await syncEnvVars(resolve(rootDir, '.env.staging'), ['preview']);
      await syncEnvVars(resolve(rootDir, '.env.production'), ['production']);
      break;

    default:
      console.error(`❌ Unknown environment: ${environment}`);
      console.error('   Valid options: development, staging, production, all');
      process.exit(1);
  }

  console.log('\n✨ Done!');
}

main().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
