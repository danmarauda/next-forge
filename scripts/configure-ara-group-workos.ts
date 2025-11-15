#!/usr/bin/env tsx

/**
 * ARA Group Platform - WorkOS Configuration Script
 *
 * Configures WorkOS features specifically for ARA Group Platform
 * using branding, roles, and organizational structure from research.
 */

import { WorkOS } from '@workos-inc/node';
import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables
config({ path: join(process.cwd(), 'apps/app/.env.local') });
config({ path: join(process.cwd(), 'packages/database/.env.local') });

// ARA Group Platform Configuration
const ARA_GROUP_CONFIG = {
  organizationName: 'ARA Group Platform',
  mainDomain: 'ara.aliaslabs.ai', // Demo domain
  organizationDomains: [
    'ara.aliaslabs.ai', // Primary demo domain
    'aragroup.com.au', // Production (future)
    'arapropertyservices.com.au', // Production (future)
    'araproperty.com', // Production (future)
    'aragroup.com', // Production (future)
  ],
  branding: {
    primaryColor: '#AFCC37', // Lime Green
    secondaryColor: '#435464', // Navy Blue
    logoUrl:
      'https://propertyservices.aragroup.com.au/wp-content/uploads/2022/02/ARA-Property-Services-Stacked-Logo-Mono-White.svg',
    tagline: 'ARA. Here for you. Here for good.',
  },
  roles: [
    {
      slug: 'super_admin',
      name: 'Super Administrator',
      description: 'Full system access across all ARA Group divisions',
      permissions: ['*'],
    },
    {
      slug: 'admin',
      name: 'Administrator',
      description: 'Organization administration within assigned division',
      permissions: [
        'users.read',
        'users.write',
        'users.delete',
        'organizations.read',
        'organizations.write',
        'organizations.delete',
        'settings.read',
        'settings.write',
        'credentials.read',
        'credentials.write',
        'workflows.*',
        'agents.*',
        'mcp.*',
        'chat.*',
      ],
    },
    {
      slug: 'credential_manager',
      name: 'Credential Manager',
      description: 'Manage credentials and access controls',
      permissions: [
        'users.read',
        'credentials.read',
        'credentials.write',
        'credentials.delete',
        'workflows.view',
        'workflows.use',
        'agents.view',
        'agents.use',
        'mcp.view',
        'mcp.use',
        'chat.*',
      ],
    },
    {
      slug: 'credential_viewer',
      name: 'Credential Viewer',
      description: 'View-only access to credentials',
      permissions: [
        'users.read',
        'credentials.read',
        'workflows.view',
        'workflows.use',
        'agents.view',
        'agents.use',
        'mcp.view',
        'mcp.use',
        'chat.*',
      ],
    },
    {
      slug: 'manager',
      name: 'Manager',
      description: 'Team management within facility/division',
      permissions: [
        'users.read',
        'users.write',
        'organizations.read',
        'reports.read',
        'workflows.view',
        'workflows.use',
        'workflows.list',
        'agents.view',
        'agents.use',
        'agents.list',
        'chat.*',
      ],
    },
    {
      slug: 'supervisor',
      name: 'Supervisor',
      description: 'Operational supervision',
      permissions: [
        'users.read',
        'organizations.read',
        'reports.read',
        'workflows.view',
        'workflows.use',
        'agents.view',
        'agents.use',
        'chat.*',
      ],
    },
    {
      slug: 'operator',
      name: 'Operator',
      description: 'Basic operational access',
      permissions: [
        'users.read',
        'organizations.read',
        'workflows.view',
        'workflows.use',
        'agents.view',
        'agents.use',
        'chat.*',
      ],
    },
    {
      slug: 'viewer',
      name: 'Viewer',
      description: 'Read-only access',
      permissions: [
        'users.read',
        'organizations.read',
        'workflows.view',
        'agents.view',
        'chat.read',
      ],
    },
    {
      slug: 'user',
      name: 'User',
      description: 'Basic user access',
      permissions: [
        'users.read',
        'organizations.read',
        'workflows.view',
        'workflows.use',
        'workflows.list',
        'agents.view',
        'agents.use',
        'agents.list',
        'mcp.view',
        'mcp.use',
        'mcp.list',
        'chat.*',
        'temporaryChat.*',
      ],
    },
  ],
  divisions: [
    {
      name: 'ARA Fire & Security',
      demoDomain: 'fire.ara.aliaslabs.ai',
      productionDomain: 'fire.aragroup.com.au',
      additionalDomains: ['arafireandsecurity.com'],
      description: 'Fire protection, security, and marine safety services',
    },
    {
      name: 'ARA Electrical',
      demoDomain: 'electrical.ara.aliaslabs.ai',
      productionDomain: 'electrical.aragroup.com.au',
      description: 'Industrial electrical installation and service',
    },
    {
      name: 'ARA Building Services',
      demoDomain: 'buildingservices.ara.aliaslabs.ai',
      productionDomain: 'buildingservices.aragroup.com.au',
      description: 'Building maintenance and repair services',
    },
    {
      name: 'ARA Mechanical Services',
      demoDomain: 'mechanical.ara.aliaslabs.ai',
      productionDomain: 'mechanical.aragroup.com.au',
      description: 'HVAC and mechanical services',
      note: 'Part of Building Services but operates as standalone brand',
    },
    {
      name: 'ARA Property Services',
      demoDomain: 'propertyservices.ara.aliaslabs.ai',
      productionDomain: 'propertyservices.aragroup.com.au',
      description: 'Cleaning and property maintenance services',
      note: 'Acquired CMC Property Services in 2017',
    },
    {
      name: 'ARA Products',
      demoDomain: 'products.ara.aliaslabs.ai',
      productionDomain: 'manufacture.aragroup.com.au',
      description: 'Product distribution of electronic security products',
    },
    {
      name: 'ARA Manufacturing',
      demoDomain: 'manufacturing.ara.aliaslabs.ai',
      productionDomain: 'manufacture.aragroup.com.au',
      description:
        'Manufacturing of high-security products and commercial doors',
      note: 'Part of Products capability area but operates as standalone brand',
    },
    {
      name: 'ARA Marine',
      demoDomain: 'marine.ara.aliaslabs.ai',
      productionDomain: 'aramarine.com.au',
      additionalDomains: ['aramarine.co.nz'],
      description: 'Specialty marine safety services and technical services',
      note: 'Formed in 2021 when ARA Group acquired two companies',
    },
    {
      name: 'ARA Security Solutions',
      demoDomain: 'security.ara.aliaslabs.ai',
      productionDomain: 'arasecuritysolutions.com.au',
      description: 'Security solutions',
    },
    {
      name: 'ARA Indigenous Services',
      demoDomain: 'indigenous.ara.aliaslabs.ai',
      productionDomain: 'indigenous.aragroup.com.au',
      description: 'Majority Indigenous-owned business partnership',
      note: "Established 2017, Managing Director: Michael O'Loughlin",
    },
  ],
  superAdmins: [
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
  ],
  organizationStructure: 'equal', // All organizations treated equally
};

interface ConfigurationResult {
  feature: string;
  status: 'configured' | 'manual' | 'ready';
  message: string;
  dashboardUrl?: string;
  details?: any;
}

const results: ConfigurationResult[] = [];

async function main() {
  console.log('🏢 ARA Group Platform - WorkOS Configuration\n');
  console.log('='.repeat(80));
  console.log(`Organization: ${ARA_GROUP_CONFIG.organizationName}`);
  console.log(`Tagline: ${ARA_GROUP_CONFIG.branding.tagline}`);
  console.log(`Primary Color: ${ARA_GROUP_CONFIG.branding.primaryColor}`);
  console.log('='.repeat(80));

  const apiKey = process.env.WORKOS_API_KEY;
  if (!apiKey) {
    console.log(
      '\n⚠️  WORKOS_API_KEY not set - showing configuration guide only',
    );
    printConfigurationGuide();
    return;
  }

  const workos = new WorkOS(apiKey);

  try {
    // Verify organization
    console.log('\n📋 Step 1: Verifying Organization');
    await verifyOrganization(workos);

    // Document roles
    console.log('\n🎭 Step 2: Roles & Permissions');
    documentRoles();

    // Document branding
    console.log('\n🎨 Step 3: Branding Configuration');
    documentBranding();

    // Document organizations
    console.log('\n🏢 Step 4: Organizations');
    documentOrganizations(workos);

    // Print Summary
    printSummary();
  } catch (error) {
    console.error(
      '\n❌ Configuration failed:',
      error instanceof Error ? error.message : error,
    );
    process.exit(1);
  }
}

function recordResult(
  feature: string,
  status: 'configured' | 'manual' | 'ready',
  message: string,
  dashboardUrl?: string,
  details?: any,
) {
  results.push({ feature, status, message, dashboardUrl, details });
  const icon =
    status === 'configured' ? '✅' : status === 'manual' ? '📝' : '✅';
  console.log(`  ${icon} ${message}`);
}

async function verifyOrganization(workos: WorkOS) {
  try {
    const orgs = await workos.organizations.listOrganizations({ limit: 10 });
    const araOrg = orgs.data.find(
      (org) => org.name === ARA_GROUP_CONFIG.organizationName,
    );

    if (araOrg) {
      recordResult(
        'Organization',
        'configured',
        `Found: ${araOrg.name} (${araOrg.id})`,
        `https://dashboard.workos.com/environment_01K5K3Y79TXRCBAA52TCYZ5CCA/organizations/${araOrg.id}`,
        { id: araOrg.id, name: araOrg.name },
      );
    } else {
      recordResult(
        'Organization',
        'ready',
        'Organization ready to create',
        'https://dashboard.workos.com/environment_01K5K3Y79TXRCBAA52TCYZ5CCA/organizations',
        { name: ARA_GROUP_CONFIG.organizationName },
      );
    }
  } catch (error) {
    recordResult(
      'Organization',
      'manual',
      `Check organization: ${error instanceof Error ? error.message : 'Unknown'}`,
    );
  }
}

function documentRoles() {
  console.log(`\n  📋 ${ARA_GROUP_CONFIG.roles.length} roles defined:`);
  ARA_GROUP_CONFIG.roles.forEach((role, index) => {
    console.log(`    ${index + 1}. ${role.name} (${role.slug})`);
    console.log(`       └─ ${role.description}`);
    console.log(
      `       └─ Permissions: ${role.permissions.length} permission(s)`,
    );
  });

  recordResult(
    'Roles & Permissions',
    'manual',
    `Configure ${ARA_GROUP_CONFIG.roles.length} roles in dashboard`,
    'https://dashboard.workos.com/environment_01K5K3Y79TXRCBAA52TCYZ5CCA/roles-and-permissions',
    { roles: ARA_GROUP_CONFIG.roles },
  );
}

function documentBranding() {
  console.log(`\n  🎨 Branding Configuration:`);
  console.log(
    `    Primary Color: ${ARA_GROUP_CONFIG.branding.primaryColor} (Lime Green)`,
  );
  console.log(
    `    Secondary Color: ${ARA_GROUP_CONFIG.branding.secondaryColor} (Navy Blue)`,
  );
  console.log(`    Logo URL: ${ARA_GROUP_CONFIG.branding.logoUrl}`);
  console.log(`    Tagline: ${ARA_GROUP_CONFIG.branding.tagline}`);

  recordResult(
    'Branding',
    'manual',
    'Configure branding in dashboard',
    'https://dashboard.workos.com/branding',
    ARA_GROUP_CONFIG.branding,
  );
}

async function documentOrganizations(workos: WorkOS) {
  console.log(`\n  🏢 Organization Structure:`);
  console.log(`    Primary: ${ARA_GROUP_CONFIG.organizationName}`);
  console.log(`    Main Domain: ${ARA_GROUP_CONFIG.mainDomain} (Demo)`);
  console.log(
    `    Structure: ${ARA_GROUP_CONFIG.organizationStructure === 'equal' ? 'All organizations treated equally' : 'Hierarchical'}`,
  );
  console.log(`    Divisions: ${ARA_GROUP_CONFIG.divisions.length}`);

  ARA_GROUP_CONFIG.divisions.forEach((div) => {
    console.log(`      - ${div.name}`);
    console.log(`        Demo: ${div.demoDomain}`);
    console.log(`        Production: ${div.productionDomain} (future)`);
  });

  console.log(`\n  👑 Super Admins:`);
  ARA_GROUP_CONFIG.superAdmins.forEach((admin) => {
    console.log(
      `      - ${admin.firstName} ${admin.lastName} (${admin.email})`,
    );
    console.log(`        ${admin.title} - ${admin.type}`);
  });

  recordResult(
    'Organizations',
    'manual',
    'Configure organization domains and divisions (all equal status)',
    'https://dashboard.workos.com/environment_01K5K3Y79TXRCBAA52TCYZ5CCA/organizations',
    {
      divisions: ARA_GROUP_CONFIG.divisions,
      structure: ARA_GROUP_CONFIG.organizationStructure,
      superAdmins: ARA_GROUP_CONFIG.superAdmins,
    },
  );
}

function printConfigurationGuide() {
  console.log('\n📚 Configuration Guide:');
  console.log('\n1. Branding:');
  console.log(`   - Primary Color: ${ARA_GROUP_CONFIG.branding.primaryColor}`);
  console.log(
    `   - Secondary Color: ${ARA_GROUP_CONFIG.branding.secondaryColor}`,
  );
  console.log(`   - Logo: ${ARA_GROUP_CONFIG.branding.logoUrl}`);
  console.log(`   - Dashboard: https://dashboard.workos.com/branding`);

  console.log('\n2. Roles & Permissions:');
  console.log(`   - ${ARA_GROUP_CONFIG.roles.length} roles to configure`);
  console.log(
    `   - Dashboard: https://dashboard.workos.com/environment_01K5K3Y79TXRCBAA52TCYZ5CCA/roles-and-permissions`,
  );

  console.log('\n3. Organizations:');
  console.log(`   - Primary: ${ARA_GROUP_CONFIG.organizationName}`);
  console.log(
    `   - Domains: ${ARA_GROUP_CONFIG.organizationDomains.join(', ')}`,
  );
  console.log(
    `   - Dashboard: https://dashboard.workos.com/environment_01K5K3Y79TXRCBAA52TCYZ5CCA/organizations`,
  );

  console.log(
    '\n📖 See WORKOS_ARA_GROUP_CONFIGURATION.md for complete details',
  );
}

function printSummary() {
  console.log('\n' + '='.repeat(80));
  console.log('📊 Configuration Summary');
  console.log('='.repeat(80));

  const configured = results.filter((r) => r.status === 'configured').length;
  const manual = results.filter((r) => r.status === 'manual').length;
  const ready = results.filter((r) => r.status === 'ready').length;

  console.log(`\n✅ Configured: ${configured}`);
  console.log(`📝 Manual Configuration: ${manual}`);
  console.log(`✅ Ready: ${ready}`);

  if (manual > 0) {
    console.log('\n📝 Manual Configuration Required:');
    results
      .filter((r) => r.status === 'manual')
      .forEach((r) => {
        console.log(`  - ${r.feature}: ${r.message}`);
        if (r.dashboardUrl) {
          console.log(`    Dashboard: ${r.dashboardUrl}`);
        }
      });
  }

  console.log('\n📚 Next Steps:');
  console.log('  1. Follow WORKOS_ARA_GROUP_CONFIGURATION.md');
  console.log('  2. Configure branding in dashboard');
  console.log('  3. Create roles and permissions');
  console.log('  4. Configure organization domains');
  console.log('  5. Set up IdP attribute mappings');
  console.log('  6. Configure Radar security policies');
  console.log('\n');
}

// Run the script
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
