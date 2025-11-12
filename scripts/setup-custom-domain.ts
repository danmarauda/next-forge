#!/usr/bin/env tsx
/**
 * Setup Custom Domain for Vercel Project
 * 
 * This script configures ara.aliaslabs.ai as the production domain
 * 
 * Usage:
 *   VERCEL_TOKEN=your-token tsx scripts/setup-custom-domain.ts
 */

const VERCEL_API = 'https://api.vercel.com';
const DOMAIN = 'ara.aliaslabs.ai';
const PROJECT_ID = 'prj_zm0h3A5Xcs82mN5ArivZ8Gm4V4I5';
const TEAM_ID = 'team_zgbZHABKGlI9iyDBGQQauFTW';

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;

if (!VERCEL_TOKEN) {
  console.error('❌ VERCEL_TOKEN environment variable is required');
  console.error('   Get your token from: https://vercel.com/account/tokens');
  process.exit(1);
}

async function addDomain() {
  console.log(`\n🌐 Adding custom domain: ${DOMAIN}\n`);

  const url = new URL(`/v10/projects/${PROJECT_ID}/domains`, VERCEL_API);
  url.searchParams.set('teamId', TEAM_ID);

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${VERCEL_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: DOMAIN,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    
    // Domain might already exist
    if (response.status === 409) {
      console.log('✅ Domain already added to project');
      return;
    }
    
    throw new Error(`Failed to add domain: ${error}`);
  }

  const data = await response.json();
  console.log('✅ Domain added successfully!');
  console.log(`   Domain: ${data.name}`);
  
  return data;
}

async function getDomainConfig() {
  console.log('\n📋 Getting DNS configuration...\n');

  const url = new URL(`/v9/projects/${PROJECT_ID}/domains/${DOMAIN}/config`, VERCEL_API);
  url.searchParams.set('teamId', TEAM_ID);

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${VERCEL_TOKEN}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get domain config: ${error}`);
  }

  const data = await response.json();
  
  console.log('DNS Records Required:\n');
  
  if (data.misconfigured) {
    console.log('⚠️  Domain is not configured correctly\n');
  }

  // Show required DNS records
  if (data.configuredBy === 'CNAME') {
    console.log('Add this CNAME record to your DNS:');
    console.log(`   Type: CNAME`);
    console.log(`   Name: ara (or @)`);
    console.log(`   Value: cname.vercel-dns.com`);
  } else if (data.configuredBy === 'A') {
    console.log('Add these A records to your DNS:');
    console.log(`   Type: A`);
    console.log(`   Name: ara (or @)`);
    console.log(`   Value: 76.76.21.21`);
  }

  console.log('\n');
  return data;
}

async function verifyDomain() {
  console.log('🔍 Verifying domain...\n');

  const url = new URL(`/v9/projects/${PROJECT_ID}/domains/${DOMAIN}/verify`, VERCEL_API);
  url.searchParams.set('teamId', TEAM_ID);

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${VERCEL_TOKEN}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    console.log('⚠️  Domain verification pending');
    console.log('   Configure DNS records and run this script again');
    return false;
  }

  const data = await response.json();
  
  if (data.verified) {
    console.log('✅ Domain verified successfully!');
    return true;
  } else {
    console.log('⚠️  Domain not yet verified');
    console.log('   DNS propagation may take up to 48 hours');
    return false;
  }
}

async function main() {
  console.log('🚀 Setting up custom domain for production\n');
  console.log(`   Domain: ${DOMAIN}`);
  console.log(`   Project: ${PROJECT_ID}\n`);

  try {
    // Step 1: Add domain to project
    await addDomain();

    // Step 2: Get DNS configuration
    await getDomainConfig();

    // Step 3: Verify domain
    const verified = await verifyDomain();

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('\n📝 Next Steps:\n');

    if (!verified) {
      console.log('1. Add the DNS records shown above to your domain registrar');
      console.log('2. Wait for DNS propagation (up to 48 hours)');
      console.log('3. Run this script again to verify');
      console.log('\nDNS Setup Guide:');
      console.log('   - Go to your domain registrar (e.g., Cloudflare, Namecheap)');
      console.log('   - Navigate to DNS settings for aliaslabs.ai');
      console.log('   - Add the CNAME or A record as shown above');
      console.log('   - Save changes');
    } else {
      console.log('✅ Domain is configured and verified!');
      console.log('\nYour production app will be available at:');
      console.log(`   https://${DOMAIN}`);
    }

    console.log('\n' + '='.repeat(60) + '\n');

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();

