#!/usr/bin/env tsx

/**
 * WorkOS Authentication Setup Script
 * 
 * This script helps configure WorkOS authentication for the ARA Group Platform.
 * It validates environment variables and provides setup instructions.
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function header(message: string) {
  log(`\n${'='.repeat(60)}`, colors.cyan);
  log(message, colors.bright + colors.cyan);
  log('='.repeat(60), colors.cyan);
}

function checkEnvVar(name: string, required: boolean = true): boolean {
  const value = process.env[name];
  const exists = !!value && value.trim() !== '';
  
  if (exists) {
    log(`✅ ${name}: ${value.substring(0, 20)}...`, colors.green);
    return true;
  } else {
    if (required) {
      log(`❌ ${name}: Missing (required)`, colors.red);
    } else {
      log(`⚠️  ${name}: Missing (optional)`, colors.yellow);
    }
    return false;
  }
}

async function main() {
  header('🔐 WorkOS Authentication Setup');

  log('\nThis script will help you set up WorkOS authentication.\n', colors.cyan);

  // Check environment variables
  header('📋 Environment Variables Check');
  
  const requiredVars = [
    'WORKOS_API_KEY',
    'WORKOS_CLIENT_ID',
    'WORKOS_REDIRECT_URI',
    'CONVEX_DEPLOYMENT',
    'NEXT_PUBLIC_CONVEX_URL',
    'NEXT_PUBLIC_SITE_URL',
  ];

  const optionalVars = [
    'WORKOS_WEBHOOK_SECRET',
    'ADMIN',
  ];

  log('\nRequired Variables:', colors.bright);
  const allRequired = requiredVars.every(v => checkEnvVar(v, true));

  log('\nOptional Variables:', colors.bright);
  optionalVars.forEach(v => checkEnvVar(v, false));

  if (!allRequired) {
    log('\n❌ Missing required environment variables!', colors.red);
    log('\nPlease add them to your .env.local file:', colors.yellow);
    log('\nExample .env.local:', colors.cyan);
    log(`
WORKOS_API_KEY=sk_live_...
WORKOS_CLIENT_ID=client_...
WORKOS_REDIRECT_URI=https://app.aragroup.com.au/api/auth/callback
CONVEX_DEPLOYMENT=prod:your-deployment
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
NEXT_PUBLIC_SITE_URL=https://app.aragroup.com.au
ADMIN=admin@aragroup.com.au
    `.trim());
    process.exit(1);
  }

  log('\n✅ All required environment variables are set!', colors.green);

  // Check if packages are installed
  header('📦 Package Installation Check');
  
  try {
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'packages/database/package.json'), 'utf-8')
    );
    
    if (packageJson.dependencies['@workos-inc/node']) {
      log('✅ @workos-inc/node is installed', colors.green);
    } else {
      log('❌ @workos-inc/node is not installed', colors.red);
      log('Run: cd packages/database && pnpm add @workos-inc/node', colors.yellow);
    }
  } catch (error) {
    log('⚠️  Could not check package.json', colors.yellow);
  }

  // Provide setup instructions
  header('🚀 Next Steps');
  
  log('\n1. Configure WorkOS Dashboard:', colors.bright);
  log('   • Go to https://dashboard.workos.com', colors.cyan);
  log('   • Add redirect URI: ' + process.env.WORKOS_REDIRECT_URI, colors.cyan);
  log('   • Configure webhook endpoint: ' + process.env.NEXT_PUBLIC_SITE_URL + '/api/webhooks/workos', colors.cyan);

  log('\n2. Deploy Convex Functions:', colors.bright);
  log('   • Run: cd packages/database && pnpm convex deploy', colors.cyan);

  log('\n3. Test Authentication:', colors.bright);
  log('   • Start dev server: pnpm dev', colors.cyan);
  log('   • Visit: ' + process.env.NEXT_PUBLIC_SITE_URL + '/sign-in', colors.cyan);
  log('   • Sign in with WorkOS', colors.cyan);

  log('\n4. Configure SSO (Optional):', colors.bright);
  log('   • Go to WorkOS Dashboard > Organizations', colors.cyan);
  log('   • Select an organization', colors.cyan);
  log('   • Configure SSO provider (SAML/OIDC)', colors.cyan);

  log('\n5. Enable Directory Sync (Optional):', colors.bright);
  log('   • Go to WorkOS Dashboard > Directory Sync', colors.cyan);
  log('   • Create a directory connection', colors.cyan);
  log('   • Configure SCIM endpoint', colors.cyan);

  header('📚 Documentation');
  log('\nFor more information, see:', colors.cyan);
  log('• WORKOS_MIGRATION_COMPLETE.md - Full migration guide', colors.cyan);
  log('• https://workos.com/docs - WorkOS documentation', colors.cyan);
  log('• https://docs.convex.dev - Convex documentation', colors.cyan);

  log('\n✨ Setup complete! You\'re ready to use WorkOS authentication.\n', colors.green);
}

main().catch((error) => {
  log('\n❌ Error during setup:', colors.red);
  console.error(error);
  process.exit(1);
});