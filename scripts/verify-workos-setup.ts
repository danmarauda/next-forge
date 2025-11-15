#!/usr/bin/env tsx

/**
 * WorkOS Setup Verification Script
 * 
 * Verifies that WorkOS credentials are correctly configured
 */

import { WorkOS } from '@workos-inc/node';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

async function main() {
  log('\n🔐 WorkOS Configuration Verification\n', colors.cyan + colors.bright);

  // Check environment variables
  const apiKey = process.env.WORKOS_API_KEY;
  const clientId = process.env.WORKOS_CLIENT_ID;

  if (!apiKey || !clientId) {
    log('❌ Missing WorkOS credentials!', colors.red);
    log('\nPlease set the following environment variables:', colors.yellow);
    log('  WORKOS_API_KEY', colors.yellow);
    log('  WORKOS_CLIENT_ID', colors.yellow);
    process.exit(1);
  }

  log('✅ Environment variables found', colors.green);
  log(`   API Key: ${apiKey.substring(0, 20)}...`, colors.cyan);
  log(`   Client ID: ${clientId}`, colors.cyan);

  // Initialize WorkOS client
  const workos = new WorkOS(apiKey);

  try {
    // Test API connection by listing organizations
    log('\n🔍 Testing WorkOS API connection...', colors.cyan);
    
    const organizations = await workos.organizations.listOrganizations({
      limit: 5,
    });

    log('✅ Successfully connected to WorkOS API!', colors.green);
    log(`\n📊 Found ${organizations.data.length} organization(s):`, colors.bright);
    
    for (const org of organizations.data) {
      log(`\n  • ${org.name}`, colors.cyan);
      log(`    ID: ${org.id}`, colors.cyan);
      log(`    Domains: ${org.domains.map(d => d.domain).join(', ') || 'None'}`, colors.cyan);
    }

    // Get redirect URI configuration
    log('\n🔗 Redirect URI Configuration:', colors.bright);
    const redirectUri = process.env.WORKOS_REDIRECT_URI || process.env.NEXT_PUBLIC_SITE_URL + '/api/auth/callback';
    log(`   ${redirectUri}`, colors.cyan);
    log('\n⚠️  Make sure this is configured in WorkOS Dashboard:', colors.yellow);
    log('   https://dashboard.workos.com/configuration/redirects', colors.yellow);

    log('\n✨ WorkOS setup verification complete!\n', colors.green + colors.bright);
    
  } catch (error) {
    log('\n❌ Failed to connect to WorkOS API', colors.red);
    if (error instanceof Error) {
      log(`   Error: ${error.message}`, colors.red);
    }
    log('\nPlease verify your credentials at:', colors.yellow);
    log('   https://dashboard.workos.com/api-keys', colors.yellow);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});