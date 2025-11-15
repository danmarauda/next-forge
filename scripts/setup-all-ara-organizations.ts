#!/usr/bin/env tsx

/**
 * ARA Group Platform - Setup All Organizations in WorkOS
 *
 * Creates all 11 ARA Group organizations in WorkOS with proper domains,
 * branding, and Super Admin assignments.
 */

import { WorkOS } from '@workos-inc/node';
import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables
config({ path: join(process.cwd(), 'apps/app/.env.local') });
config({ path: join(process.cwd(), 'packages/database/.env.local') });

// All ARA Group Organizations
const ARA_ORGANIZATIONS = [
  {
    name: 'ARA Group Platform',
    demoDomain: 'ara.aliaslabs.ai',
    productionDomains: [
      'aragroup.com.au',
      'arapropertyservices.com.au',
      'araproperty.com',
      'aragroup.com',
    ],
    description: 'Main platform organization for ARA Group Limited',
    isPrimary: true,
  },
  {
    name: 'ARA Fire & Security',
    demoDomain: 'fire.ara.aliaslabs.ai',
    productionDomains: ['fire.aragroup.com.au', 'arafireandsecurity.com'],
    description: 'Fire protection, security, and marine safety services',
  },
  {
    name: 'ARA Electrical',
    demoDomain: 'electrical.ara.aliaslabs.ai',
    productionDomains: ['electrical.aragroup.com.au'],
    description: 'Industrial electrical installation and service',
  },
  {
    name: 'ARA Building Services',
    demoDomain: 'buildingservices.ara.aliaslabs.ai',
    productionDomains: ['buildingservices.aragroup.com.au'],
    description: 'Building maintenance and repair services',
  },
  {
    name: 'ARA Mechanical Services',
    demoDomain: 'mechanical.ara.aliaslabs.ai',
    productionDomains: ['mechanical.aragroup.com.au'],
    description: 'HVAC and mechanical services',
  },
  {
    name: 'ARA Property Services',
    demoDomain: 'propertyservices.ara.aliaslabs.ai',
    productionDomains: ['propertyservices.aragroup.com.au'],
    description: 'Cleaning and property maintenance services',
  },
  {
    name: 'ARA Products',
    demoDomain: 'products.ara.aliaslabs.ai',
    productionDomains: ['manufacture.aragroup.com.au'],
    description: 'Product distribution of electronic security products',
  },
  {
    name: 'ARA Manufacturing',
    demoDomain: 'manufacturing.ara.aliaslabs.ai',
    productionDomains: ['manufacture.aragroup.com.au'],
    description: 'Manufacturing of high-security products and commercial doors',
  },
  {
    name: 'ARA Marine',
    demoDomain: 'marine.ara.aliaslabs.ai',
    productionDomains: ['aramarine.com.au', 'aramarine.co.nz'],
    description: 'Specialty marine safety services and technical services',
  },
  {
    name: 'ARA Security Solutions',
    demoDomain: 'security.ara.aliaslabs.ai',
    productionDomains: ['arasecuritysolutions.com.au'],
    description: 'Security solutions',
  },
  {
    name: 'ARA Indigenous Services',
    demoDomain: 'indigenous.ara.aliaslabs.ai',
    productionDomains: ['indigenous.aragroup.com.au'],
    description: 'Majority Indigenous-owned business partnership',
  },
];

// Super Admin Users
const SUPER_ADMINS = [
  {
    firstName: 'Ed',
    lastName: 'Federman',
    email: 'ed.federman@aragroup.com.au',
    title: 'Co-founder, ARA Group',
    type: 'ARA Group Super Admin',
  },
  {
    firstName: 'Mark',
    lastName: 'Brady',
    email: 'mark.brady@aliaslabs.ai',
    title: 'Executive',
    type: 'ALIAS Super Admin',
  },
  {
    firstName: 'Dan',
    lastName: 'Humphreys',
    email: 'dan.humphreys@aliaslabs.ai',
    title: 'Executive',
    type: 'ALIAS Super Admin',
  },
];

interface CreatedOrganization {
  id: string;
  name: string;
  domain: string;
}

async function main() {
  const apiKey = process.env.WORKOS_API_KEY;

  if (!apiKey) {
    console.error('❌ WORKOS_API_KEY not set in environment variables');
    console.log('\n📝 Please set WORKOS_API_KEY in apps/app/.env.local');
    process.exit(1);
  }

  const workos = new WorkOS(apiKey);

  console.log(
    '🚀 ARA Group Platform - Setting Up All Organizations in WorkOS\n',
  );
  console.log('='.repeat(80));

  const createdOrgs: CreatedOrganization[] = [];

  // Step 1: Create all organizations
  console.log('\n📦 Step 1: Creating Organizations\n');
  for (const org of ARA_ORGANIZATIONS) {
    try {
      // Check if organization already exists
      const existingOrgs = await workos.organizations.listOrganizations({
        limit: 100,
      });

      const existingOrg = existingOrgs.data.find((o) => o.name === org.name);

      if (existingOrg) {
        console.log(`  ✅ Found existing: ${org.name} (${existingOrg.id})`);
        createdOrgs.push({
          id: existingOrg.id,
          name: org.name,
          domain: org.demoDomain,
        });
        continue;
      }

      // Create organization with demo domain
      const organization = await workos.organizations.createOrganization({
        name: org.name,
        domains: [{ domain: org.demoDomain }],
        allowProfilesOutsideOrganization: false,
      });

      console.log(`  ✅ Created: ${org.name}`);
      console.log(`     Domain: ${org.demoDomain}`);
      console.log(`     ID: ${organization.id}`);

      createdOrgs.push({
        id: organization.id,
        name: org.name,
        domain: org.demoDomain,
      });
    } catch (error) {
      console.error(`  ❌ Failed to create ${org.name}:`, error);
    }
  }

  // Step 2: Assign Super Admins to all organizations
  console.log('\n👑 Step 2: Assigning Super Admins\n');
  for (const org of createdOrgs) {
    for (const admin of SUPER_ADMINS) {
      try {
        // Get or create user
        let user;
        const existingUsers = await workos.userManagement.listUsers({
          email: admin.email,
        });

        if (existingUsers.data.length > 0) {
          user = existingUsers.data[0];
          console.log(`  ✅ Found user: ${admin.firstName} ${admin.lastName}`);
        } else {
          user = await workos.userManagement.createUser({
            email: admin.email,
            firstName: admin.firstName,
            lastName: admin.lastName,
            emailVerified: true,
          });
          console.log(
            `  ✅ Created user: ${admin.firstName} ${admin.lastName}`,
          );
        }

        // Create organization membership with Super Admin role
        try {
          await workos.organizations.createOrganizationMembership({
            organizationId: org.id,
            userId: user.id,
            roleSlug: 'super_admin',
          });
          console.log(
            `  ✅ Assigned ${admin.firstName} ${admin.lastName} to ${org.name}`,
          );
        } catch (membershipError: any) {
          if (membershipError.message?.includes('already exists')) {
            console.log(
              `  ⚠️  ${admin.firstName} ${admin.lastName} already in ${org.name}`,
            );
          } else {
            throw membershipError;
          }
        }
      } catch (error) {
        console.error(
          `  ❌ Failed to assign ${admin.firstName} ${admin.lastName} to ${org.name}:`,
          error,
        );
      }
    }
  }

  // Step 3: Summary
  console.log('\n' + '='.repeat(80));
  console.log('📊 Setup Summary\n');
  console.log(`Total Organizations: ${createdOrgs.length}`);
  console.log(`Super Admins: ${SUPER_ADMINS.length}`);
  console.log(`Total Memberships: ${createdOrgs.length * SUPER_ADMINS.length}`);

  console.log('\n✅ Organizations Created:');
  createdOrgs.forEach((org, index) => {
    console.log(`  ${index + 1}. ${org.name} (${org.domain})`);
  });

  console.log('\n✅ Super Admins:');
  SUPER_ADMINS.forEach((admin) => {
    console.log(`  - ${admin.firstName} ${admin.lastName} (${admin.email})`);
  });

  console.log('\n🎉 Setup Complete!\n');
  console.log('Next Steps:');
  console.log('  1. Configure roles and permissions in WorkOS Dashboard');
  console.log('  2. Set up branding for each organization');
  console.log('  3. Configure SSO if needed');
  console.log('  4. Set up webhooks for organization sync');
  console.log('\n');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
