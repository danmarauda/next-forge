#!/usr/bin/env tsx

/**
 * WorkOS Best Practices Configuration Script
 *
 * This script guides you through configuring WorkOS features with best practices.
 * It validates configurations and provides recommendations.
 */

import { WorkOS } from '@workos-inc/node';
import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables
config({ path: join(process.cwd(), 'apps/app/.env.local') });
config({ path: join(process.cwd(), 'packages/database/.env.local') });

interface BestPracticeCheck {
  feature: string;
  check: string;
  status: 'pass' | 'fail' | 'warning' | 'info';
  message: string;
  recommendation?: string;
}

const checks: BestPracticeCheck[] = [];

async function main() {
  console.log('🎓 WorkOS Best Practices Configuration Guide\n');
  console.log('='.repeat(80));
  console.log(
    'This script validates your WorkOS configuration against best practices.\n',
  );

  const apiKey = process.env.WORKOS_API_KEY;
  if (!apiKey) {
    console.error('❌ WORKOS_API_KEY is not set');
    console.log(
      '\n💡 Recommendation: Set WORKOS_API_KEY in apps/app/.env.local',
    );
    process.exit(1);
  }

  const workos = new WorkOS(apiKey);

  try {
    // Check 1: API Connection
    await checkAPIConnection(workos);

    // Check 2: Redirect URI Configuration
    checkRedirectURI();

    // Check 3: Webhook Configuration
    checkWebhookConfiguration();

    // Check 4: Environment Variables
    checkEnvironmentVariables();

    // Check 5: Security Best Practices
    checkSecurityBestPractices();

    // Print Summary
    printSummary();
  } catch (error) {
    console.error(
      '\n❌ Error:',
      error instanceof Error ? error.message : error,
    );
    process.exit(1);
  }
}

function recordCheck(
  feature: string,
  check: string,
  status: 'pass' | 'fail' | 'warning' | 'info',
  message: string,
  recommendation?: string,
) {
  checks.push({ feature, check, status, message, recommendation });
}

async function checkAPIConnection(workos: WorkOS) {
  console.log('\n📡 Checking API Connection...');
  try {
    await workos.organizations.listOrganizations({ limit: 1 });
    recordCheck(
      'API Connection',
      'Connection Test',
      'pass',
      'Successfully connected to WorkOS API',
    );
    console.log('  ✅ API connection successful');
  } catch (error) {
    recordCheck(
      'API Connection',
      'Connection Test',
      'fail',
      'Failed to connect to WorkOS API',
      'Verify WORKOS_API_KEY is correct',
    );
    console.log('  ❌ API connection failed');
    throw error;
  }
}

function checkRedirectURI() {
  console.log('\n🔗 Checking Redirect URI Configuration...');
  const redirectUri = process.env.WORKOS_REDIRECT_URI;

  if (!redirectUri) {
    recordCheck(
      'Redirect URI',
      'Configuration',
      'fail',
      'WORKOS_REDIRECT_URI not set',
      'Set WORKOS_REDIRECT_URI in environment variables',
    );
    console.log('  ❌ Redirect URI not configured');
    return;
  }

  // Check if using HTTPS in production
  if (redirectUri.startsWith('http://') && !redirectUri.includes('localhost')) {
    recordCheck(
      'Redirect URI',
      'HTTPS Usage',
      'warning',
      'Using HTTP instead of HTTPS',
      'Use HTTPS in production for security',
    );
    console.log('  ⚠️  Using HTTP (should use HTTPS in production)');
  } else {
    recordCheck(
      'Redirect URI',
      'HTTPS Usage',
      'pass',
      'Using HTTPS or localhost',
    );
    console.log('  ✅ Redirect URI configured: ' + redirectUri);
  }

  // Check redirect URI matches expected format
  if (redirectUri.includes('/auth/callback')) {
    recordCheck(
      'Redirect URI',
      'Format',
      'pass',
      'Redirect URI follows best practices',
    );
  } else {
    recordCheck(
      'Redirect URI',
      'Format',
      'info',
      'Consider using /auth/callback endpoint',
      'Standard endpoint pattern improves maintainability',
    );
  }
}

function checkWebhookConfiguration() {
  console.log('\n🔔 Checking Webhook Configuration...');
  const webhookUrl = process.env.WORKOS_WEBHOOK_URL;

  if (!webhookUrl) {
    recordCheck(
      'Webhooks',
      'Configuration',
      'warning',
      'WORKOS_WEBHOOK_URL not set',
      'Configure webhook URL for production',
    );
    console.log('  ⚠️  Webhook URL not configured');
    return;
  }

  // Check HTTPS usage
  if (webhookUrl.startsWith('https://')) {
    recordCheck(
      'Webhooks',
      'HTTPS Usage',
      'pass',
      'Using HTTPS for webhook endpoint',
    );
    console.log('  ✅ Webhook URL uses HTTPS: ' + webhookUrl);
  } else if (
    webhookUrl.includes('localhost') ||
    webhookUrl.includes('127.0.0.1')
  ) {
    recordCheck(
      'Webhooks',
      'HTTPS Usage',
      'info',
      'Using localhost for development',
      'Use HTTPS endpoint in production',
    );
    console.log('  ℹ️  Using localhost (development): ' + webhookUrl);
  } else {
    recordCheck(
      'Webhooks',
      'HTTPS Usage',
      'fail',
      'Webhook URL should use HTTPS',
      'Use HTTPS endpoint for security',
    );
    console.log('  ❌ Webhook URL should use HTTPS');
  }
}

function checkEnvironmentVariables() {
  console.log('\n🔐 Checking Environment Variables...');
  const required = [
    'WORKOS_API_KEY',
    'WORKOS_CLIENT_ID',
    'WORKOS_REDIRECT_URI',
  ];

  const optional = [
    'WORKOS_WEBHOOK_URL',
    'WORKOS_ENVIRONMENT_ID',
    'NEXT_PUBLIC_WORKOS_AUTH_ENABLED',
    'NEXT_PUBLIC_WORKOS_SSO_ENABLED',
  ];

  let allRequired = true;
  required.forEach((varName) => {
    if (!process.env[varName]) {
      recordCheck(
        'Environment Variables',
        varName,
        'fail',
        `${varName} not set`,
        `Set ${varName} in apps/app/.env.local`,
      );
      console.log(`  ❌ ${varName} not set`);
      allRequired = false;
    } else {
      recordCheck(
        'Environment Variables',
        varName,
        'pass',
        `${varName} is set`,
      );
      console.log(`  ✅ ${varName} is set`);
    }
  });

  optional.forEach((varName) => {
    if (process.env[varName]) {
      recordCheck(
        'Environment Variables',
        varName,
        'pass',
        `${varName} is set (optional)`,
      );
      console.log(`  ✅ ${varName} is set (optional)`);
    }
  });

  if (!allRequired) {
    recordCheck(
      'Environment Variables',
      'All Required',
      'fail',
      'Some required environment variables are missing',
      'Set all required environment variables before proceeding',
    );
  }
}

function checkSecurityBestPractices() {
  console.log('\n🛡️  Checking Security Best Practices...');

  // Check API key format
  const apiKey = process.env.WORKOS_API_KEY;
  if (apiKey) {
    if (apiKey.startsWith('sk_')) {
      recordCheck(
        'Security',
        'API Key Format',
        'pass',
        'API key format is correct',
      );
      console.log('  ✅ API key format is correct');
    } else {
      recordCheck(
        'Security',
        'API Key Format',
        'warning',
        'API key format may be incorrect',
        "Verify API key starts with 'sk_'",
      );
      console.log('  ⚠️  API key format may be incorrect');
    }

    // Check if API key is in .gitignore
    recordCheck(
      'Security',
      'API Key Storage',
      'info',
      'Ensure API keys are not committed to git',
      'Add .env.local to .gitignore',
    );
    console.log('  ℹ️  Ensure API keys are not committed to git');
  }

  // Check redirect URI security
  const redirectUri = process.env.WORKOS_REDIRECT_URI;
  if (redirectUri && redirectUri.includes('localhost')) {
    recordCheck(
      'Security',
      'Development vs Production',
      'info',
      'Using localhost (development)',
      'Use production URL in production environment',
    );
    console.log('  ℹ️  Using localhost (development mode)');
  }
}

function printSummary() {
  console.log('\n' + '='.repeat(80));
  console.log('📊 Best Practices Summary');
  console.log('='.repeat(80));

  const passed = checks.filter((c) => c.status === 'pass').length;
  const failed = checks.filter((c) => c.status === 'fail').length;
  const warnings = checks.filter((c) => c.status === 'warning').length;
  const info = checks.filter((c) => c.status === 'info').length;

  console.log(`\n✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⚠️  Warnings: ${warnings}`);
  console.log(`ℹ️  Info: ${info}`);

  if (failed > 0) {
    console.log('\n❌ Failed Checks:');
    checks
      .filter((c) => c.status === 'fail')
      .forEach((c) => {
        console.log(`  - ${c.feature}: ${c.check}`);
        console.log(`    ${c.message}`);
        if (c.recommendation) {
          console.log(`    💡 ${c.recommendation}`);
        }
      });
  }

  if (warnings > 0) {
    console.log('\n⚠️  Warnings:');
    checks
      .filter((c) => c.status === 'warning')
      .forEach((c) => {
        console.log(`  - ${c.feature}: ${c.check}`);
        console.log(`    ${c.message}`);
        if (c.recommendation) {
          console.log(`    💡 ${c.recommendation}`);
        }
      });
  }

  console.log('\n📚 Next Steps:');
  console.log('  1. Review failed checks and fix issues');
  console.log('  2. Review warnings and apply recommendations');
  console.log('  3. Follow step-by-step guide: WORKOS_STEP_BY_STEP_SETUP.md');
  console.log('  4. Configure features in WorkOS dashboard');
  console.log('  5. Test all features');
  console.log('\n');
}

// Run the script
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
