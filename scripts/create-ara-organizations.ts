#!/usr/bin/env tsx

/**
 * Create ARA Group Organizations in WorkOS
 * 
 * This script creates all ARA Group subsidiary organizations in WorkOS
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

// ARA Group Organizations
const ARA_ORGANIZATIONS = [
  {
    name: 'ARA Property Services',
    slug: 'ara-property-services',
    domains: ['arapropertyservices.com.au'],
    description: 'Main property services division',
  },
  {
    name: 'ARA Fire Protection',
    slug: 'ara-fire',
    domains: ['arafire.com.au'],
    description: 'Fire protection and safety services',
  },
  {
    name: 'ARA Electrical',
    slug: 'ara-electrical',
    domains: ['araelectrical.com.au'],
    description: 'Electrical services and installations',
  },
  {
    name: 'ARA Building Services',
    slug: 'ara-buildingservices',
    domains: ['arabuildingservices.com.au'],
    description: 'Building maintenance and services',
  },
  {
    name: 'ARA Mechanical',
    slug: 'ara-mechanical',
    domains: ['aramechanical.com.au'],
    description: 'Mechanical services and HVAC',
  },
  {
    name: 'ARA Products',
    slug: 'ara-products',
    domains: ['araproducts.com.au'],
    description: 'Product sales and distribution',
  },
  {
    name: 'ARA Manufacturing',
    slug: 'ara-manufacturing',
    domains: ['aramanufacturing.com.au'],
    description: 'Manufacturing division',
  },
  {
    name: 'ARA Marine',
    slug: 'ara-marine',
    domains: ['aramarine.com.au'],
    description: 'Marine services',
  },
  {
    name: 'ARA Security',
    slug: 'ara-security',
    domains: ['arasecurity.com.au'],
    description: 'Security services',
  },
  {
    name: 'ARA Indigenous',
    slug: 'ara-indigenous',
    domains: ['araindigenous.com.au'],
    description: 'Indigenous services and partnerships',
  },
  {
    name: 'ARA Strategic',
    slug: 'ara-strategic',
    domains: ['arastrategic.com.au'],
    description: 'Strategic consulting',
  },
  {
    name: 'ARA Funds Management',
    slug: 'ara-funds',
    domains: ['arafunds.com.au'],
    description: 'Funds management division',
  },
];

async function main() {
  log('\n🏢 Creating ARA Group Organizations in WorkOS\n', colors.cyan + colors.bright);

  // Check environment variables
  const apiKey = process.env.WORKOS_API_KEY;

  if (!apiKey) {
    log('❌ Missing WORKOS_API_KEY environment variable!', colors.red);
    process.exit(1);
  }

  // Initialize WorkOS client
  const workos = new WorkOS(apiKey);

  log('✅ WorkOS client initialized', colors.green);
  log(`\n📋 Creating ${ARA_ORGANIZATIONS.length} organizations...\n`, colors.bright);

  const results = [];

  for (const org of ARA_ORGANIZATIONS) {
    try {
      log(`\n🔄 Creating: ${org.name}`, colors.cyan);
      log(`   Slug: ${org.slug}`, colors.cyan);
      log(`   Domains: ${org.domains.join(', ')}`, colors.cyan);

      // Create organization in WorkOS
      const createdOrg = await workos.organizations.createOrganization({
        name: org.name,
        domainData: org.domains.map(domain => ({
          domain,
          state: 'verified' as const,
        })),
        allowProfilesOutsideOrganization: false,
      });

      log(`   ✅ Created with ID: ${createdOrg.id}`, colors.green);

      results.push({
        name: org.name,
        slug: org.slug,
        workosId: createdOrg.id,
        domains: org.domains,
        success: true,
      });

    } catch (error) {
      log(`   ❌ Failed to create ${org.name}`, colors.red);
      if (error instanceof Error) {
        log(`   Error: ${error.message}`, colors.red);
      }

      results.push({
        name: org.name,
        slug: org.slug,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Summary
  log('\n' + '='.repeat(60), colors.cyan);
  log('📊 Summary', colors.bright + colors.cyan);
  log('='.repeat(60), colors.cyan);

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  log(`\n✅ Successfully created: ${successful.length}`, colors.green);
  log(`❌ Failed: ${failed.length}`, colors.red);

  if (successful.length > 0) {
    log('\n✅ Successful Organizations:', colors.green + colors.bright);
    for (const org of successful) {
      log(`   • ${org.name} (${org.workosId})`, colors.green);
    }
  }

  if (failed.length > 0) {
    log('\n❌ Failed Organizations:', colors.red + colors.bright);
    for (const org of failed) {
      log(`   • ${org.name}: ${org.error}`, colors.red);
    }
  }

  // Export organization IDs
  log('\n📝 Organization IDs for Convex:', colors.bright);
  log('\nAdd these to your Convex database:\n', colors.cyan);
  
  for (const org of successful) {
    log(`// ${org.name}`, colors.cyan);
    log(`workosOrgId: "${org.workosId}",`, colors.cyan);
    log(`slug: "${org.slug}",`, colors.cyan);
    log(`domains: ${JSON.stringify(org.domains)},\n`, colors.cyan);
  }

  log('\n✨ Organization creation complete!\n', colors.green + colors.bright);
}

main().catch((error) => {
  log('\n❌ Error:', colors.red);
  console.error(error);
  process.exit(1);
});