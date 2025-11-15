#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Missing variables to add
const missingVariables = [
  // Stripe Payments (2)
  {
    name: 'STRIPE_SECRET_KEY',
    value: 'sk_test_placeholder',
    environments: ['development', 'preview', 'production'],
  },
  {
    name: 'STRIPE_WEBHOOK_SECRET',
    value: 'whsec_placeholder',
    environments: ['development', 'preview', 'production'],
  },

  // BetterStack Monitoring (2)
  {
    name: 'BETTERSTACK_API_KEY',
    value: 'bs_api_placeholder',
    environments: ['development', 'preview', 'production'],
  },
  {
    name: 'BETTERSTACK_URL',
    value: 'https://betterstack.com',
    environments: ['development', 'preview', 'production'],
  },

  // Liveblocks Collaboration (2)
  {
    name: 'LIVEBLOCKS_SECRET_KEY',
    value: 'sk_lb_placeholder',
    environments: ['development', 'preview', 'production'],
  },
  {
    name: 'NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY',
    value: 'pk_lb_placeholder',
    environments: ['development', 'preview', 'production'],
  },

  // ElevenLabs AI (1)
  {
    name: 'ELEVENLABS_API_KEY',
    value: 'elevenlabs_api_placeholder',
    environments: ['development', 'preview', 'production'],
  },

  // Svix Webhooks (1)
  {
    name: 'SVIX_TOKEN',
    value: 'svix_token_placeholder',
    environments: ['development', 'preview', 'production'],
  },

  // BaseHub CMS (1)
  {
    name: 'BASEHUB_TOKEN',
    value: 'basehub_token_placeholder',
    environments: ['development', 'preview', 'production'],
  },

  // Knock Notifications (5)
  {
    name: 'KNOCK_API_KEY',
    value: 'knock_api_placeholder',
    environments: ['development', 'preview', 'production'],
  },
  {
    name: 'KNOCK_SECRET_API_KEY',
    value: 'knock_secret_placeholder',
    environments: ['development', 'preview', 'production'],
  },
  {
    name: 'NEXT_PUBLIC_KNOCK_API_KEY',
    value: 'pk_knock_placeholder',
    environments: ['development', 'preview', 'production'],
  },
  {
    name: 'KNOCK_FEED_CHANNEL_ID',
    value: 'knock_feed_placeholder',
    environments: ['development', 'preview', 'production'],
  },
  {
    name: 'NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID',
    value: 'pk_knock_feed_placeholder',
    environments: ['development', 'preview', 'production'],
  },
];

console.log('🚀 Adding missing environment variables for 100% completion...');
console.log('=============================================================');

// Change to app directory
process.chdir(path.join(__dirname, '..', 'apps', 'app'));

// Function to add environment variable
function addVariable(name, value, environment) {
  try {
    console.log(`📝 Adding ${name} to ${environment}...`);

    // Create a temporary file with the value
    const tempFile = `/tmp/${name}_${Date.now()}.txt`;
    fs.writeFileSync(tempFile, value);

    // Use vercel env add with the value from file
    const command = `cat "${tempFile}" | vercel env add "${name}" "${environment}"`;
    execSync(command, { stdio: 'pipe', timeout: 10000 });

    // Clean up temp file
    fs.unlinkSync(tempFile);

    console.log(`✅ Added ${name} to ${environment}`);
    return true;
  } catch (error) {
    console.log(`⚠️  Failed to add ${name} to ${environment}: ${error.message}`);
    return false;
  }
}

// Add all missing variables
let successCount = 0;
let totalCount = 0;

for (const variable of missingVariables) {
  console.log(`\n🔧 Setting up ${variable.name}...`);

  for (const environment of variable.environments) {
    totalCount++;
    if (addVariable(variable.name, variable.value, environment)) {
      successCount++;
    }
  }
}

console.log('\n✅ Missing Variables Setup Complete!');
console.log('===================================');
console.log(
  `📊 Summary: ${successCount}/${totalCount} variables added successfully`,
);
console.log('');
console.log('🧪 Next Steps:');
console.log('1. Run verification: ./scripts/verify-vercel-integrations.sh');
console.log('2. Update placeholder values with real credentials');
console.log('3. Test deployment: vercel --prod');
console.log('');
console.log(
  '📖 For detailed instructions, see: VERCEL_INTEGRATIONS_SETUP_GUIDE.md',
);
