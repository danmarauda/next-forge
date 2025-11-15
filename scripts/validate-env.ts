#!/usr/bin/env tsx

/**
 * Environment Validation Script
 *
 * Validates all required environment variables before deployment.
 * Exits with code 1 if validation fails.
 */

import { readFileSync } from 'fs';
import { join } from 'path';

interface EnvVar {
  name: string;
  required: boolean;
  description?: string;
  validate?: (value: string) => boolean;
}

const REQUIRED_ENV_VARS: EnvVar[] = [
  {
    name: 'WORKOS_API_KEY',
    required: true,
    description: 'WorkOS API key',
    validate: (v) => v.startsWith('sk_'),
  },
  {
    name: 'WORKOS_CLIENT_ID',
    required: true,
    description: 'WorkOS Client ID',
    validate: (v) => v.length > 0,
  },
  {
    name: 'WORKOS_REDIRECT_URI',
    required: true,
    description: 'WorkOS redirect URI',
    validate: (v) => v.startsWith('http'),
  },
  {
    name: 'CONVEX_DEPLOYMENT',
    required: true,
    description: 'Convex deployment name',
  },
  {
    name: 'NEXT_PUBLIC_CONVEX_URL',
    required: true,
    description: 'Convex public URL',
    validate: (v) => v.startsWith('https://'),
  },
  {
    name: 'NEXT_PUBLIC_SITE_URL',
    required: false,
    description: 'Public site URL',
  },
  {
    name: 'ADMIN',
    required: false,
    description: 'Admin email addresses (comma-separated)',
  },
];

const CLIENT_ENV_VARS: EnvVar[] = [
  {
    name: 'NEXT_PUBLIC_WORKOS_CLIENT_ID',
    required: true,
    description: 'WorkOS Client ID (public)',
  },
  {
    name: 'NEXT_PUBLIC_SITE_URL',
    required: false,
    description: 'Public site URL',
  },
];

function validateEnvVar(
  envVar: EnvVar,
  value: string | undefined,
): {
  valid: boolean;
  error?: string;
} {
  if (!value) {
    if (envVar.required) {
      return {
        valid: false,
        error: `Missing required environment variable: ${envVar.name}`,
      };
    }
    return { valid: true };
  }

  if (envVar.validate && !envVar.validate(value)) {
    return {
      valid: false,
      error: `Invalid format for ${envVar.name}: ${envVar.description || ''}`,
    };
  }

  return { valid: true };
}

function main() {
  console.log('🔍 Validating environment variables...\n');

  const errors: string[] = [];
  const warnings: string[] = [];

  // Check server-side variables
  console.log('📋 Server-side variables:');
  for (const envVar of REQUIRED_ENV_VARS) {
    const value = process.env[envVar.name];
    const result = validateEnvVar(envVar, value);

    if (!result.valid) {
      errors.push(result.error!);
      console.log(`  ❌ ${envVar.name}: ${result.error}`);
    } else if (value) {
      const masked =
        envVar.name.includes('KEY') || envVar.name.includes('SECRET')
          ? `${value.substring(0, 8)}...`
          : value;
      console.log(`  ✅ ${envVar.name}: ${masked}`);
    } else {
      warnings.push(`Optional variable ${envVar.name} is not set`);
      console.log(`  ⚠️  ${envVar.name}: (optional, not set)`);
    }
  }

  // Check client-side variables
  console.log('\n📋 Client-side variables:');
  for (const envVar of CLIENT_ENV_VARS) {
    const value = process.env[envVar.name];
    const result = validateEnvVar(envVar, value);

    if (!result.valid) {
      errors.push(result.error!);
      console.log(`  ❌ ${envVar.name}: ${result.error}`);
    } else if (value) {
      console.log(`  ✅ ${envVar.name}: ${value}`);
    } else {
      warnings.push(`Optional variable ${envVar.name} is not set`);
      console.log(`  ⚠️  ${envVar.name}: (optional, not set)`);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  if (errors.length > 0) {
    console.log(`❌ Validation failed with ${errors.length} error(s):\n`);
    errors.forEach((error) => console.log(`  • ${error}`));
    process.exit(1);
  }

  if (warnings.length > 0) {
    console.log(`⚠️  Validation passed with ${warnings.length} warning(s):\n`);
    warnings.forEach((warning) => console.log(`  • ${warning}`));
  } else {
    console.log('✅ All environment variables are valid!');
  }
}

main();
