#!/usr/bin/env tsx
/**
 * Configure Production Domain for Next-Forge
 *
 * This script:
 * 1. Finds which project ara.aliaslabs.ai is assigned to
 * 2. Removes it from that project
 * 3. Adds it to the next-forge project
 * 4. Verifies DNS configuration
 */

const VERCEL_API = 'https://api.vercel.com';
const DOMAIN = 'ara.aliaslabs.ai';

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const TEAM_ID = process.env.VERCEL_TEAM_ID || 'team_zgbZHABKGlI9iyDBGQQauFTW';
const PROJECT_ID =
  process.env.VERCEL_PROJECT_ID || 'prj_zm0h3A5Xcs82mN5ArivZ8Gm4V4I5';

if (!VERCEL_TOKEN) {
  console.error('❌ VERCEL_TOKEN environment variable is required');
  process.exit(1);
}

interface Project {
  id: string;
  name: string;
}

interface Domain {
  name: string;
  projectId?: string;
}

async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${VERCEL_API}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${VERCEL_TOKEN}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API call failed (${response.status}): ${error}`);
  }

  return response.json();
}

async function findProjectWithDomain(): Promise<string | null> {
  console.log(`🔍 Finding which project has ${DOMAIN}...`);

  try {
    // Get all projects
    const { projects } = await apiCall(`/v9/projects?teamId=${TEAM_ID}`);

    // Check each project for the domain
    for (const project of projects) {
      try {
        const domains = await apiCall(
          `/v9/projects/${project.id}/domains?teamId=${TEAM_ID}`,
        );
        const hasDomain = domains.domains?.some(
          (d: Domain) => d.name === DOMAIN,
        );

        if (hasDomain) {
          console.log(
            `✓ Found ${DOMAIN} in project: ${project.name} (${project.id})`,
          );
          return project.id;
        }
      } catch (err) {}
    }

    console.log(`ℹ️  ${DOMAIN} is not assigned to any project`);
    return null;
  } catch (error) {
    console.error('❌ Error finding project:', error);
    throw error;
  }
}

async function removeDomainFromProject(projectId: string): Promise<void> {
  console.log(`🗑️  Removing ${DOMAIN} from project ${projectId}...`);

  try {
    await apiCall(
      `/v9/projects/${projectId}/domains/${DOMAIN}?teamId=${TEAM_ID}`,
      { method: 'DELETE' },
    );
    console.log(`✓ Successfully removed ${DOMAIN}`);
  } catch (error) {
    console.error('❌ Error removing domain:', error);
    throw error;
  }
}

async function addDomainToProject(): Promise<void> {
  console.log(`➕ Adding ${DOMAIN} to next-forge project...`);

  try {
    const result = await apiCall(
      `/v10/projects/${PROJECT_ID}/domains?teamId=${TEAM_ID}`,
      {
        method: 'POST',
        body: JSON.stringify({ name: DOMAIN }),
      },
    );

    console.log(`✓ Successfully added ${DOMAIN} to next-forge`);
    console.log(`   Domain ID: ${result.uid || result.id}`);

    return result;
  } catch (error) {
    console.error('❌ Error adding domain:', error);
    throw error;
  }
}

async function verifyDomainConfiguration(): Promise<void> {
  console.log(`\n🔍 Verifying domain configuration...`);

  try {
    const domain = await apiCall(`/v6/domains/${DOMAIN}?teamId=${TEAM_ID}`);

    console.log(`\n📋 Domain Status:`);
    console.log(`   Name: ${domain.name}`);
    console.log(`   Verified: ${domain.verified ? '✓' : '✗'}`);
    console.log(`   Configured: ${domain.configured ? '✓' : '✗'}`);

    if (!domain.configured) {
      console.log(`\n⚠️  DNS Configuration Required:`);
      console.log(`   Add this A record to your DNS provider:`);
      console.log(`   Type: A`);
      console.log(`   Name: ara`);
      console.log(`   Value: 76.76.21.21`);
      console.log(`   TTL: Auto`);
      console.log(`\n   Or use CNAME:`);
      console.log(`   Type: CNAME`);
      console.log(`   Name: ara`);
      console.log(`   Value: cname.vercel-dns.com`);
    } else {
      console.log(`\n✅ Domain is properly configured!`);
    }
  } catch (error) {
    console.error('❌ Error verifying domain:', error);
  }
}

async function main() {
  console.log('🚀 Configuring Production Domain for Next-Forge\n');
  console.log(`   Domain: ${DOMAIN}`);
  console.log(`   Project: next-forge (${PROJECT_ID})`);
  console.log(`   Team: ${TEAM_ID}\n`);

  try {
    // Step 1: Find current project
    const currentProjectId = await findProjectWithDomain();

    // Step 2: Remove from current project if needed
    if (currentProjectId && currentProjectId !== PROJECT_ID) {
      await removeDomainFromProject(currentProjectId);
      console.log('⏳ Waiting 2 seconds for propagation...\n');
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } else if (currentProjectId === PROJECT_ID) {
      console.log(`✓ ${DOMAIN} is already assigned to next-forge\n`);
    }

    // Step 3: Add to next-forge project
    if (!currentProjectId || currentProjectId !== PROJECT_ID) {
      await addDomainToProject();
    }

    // Step 4: Verify configuration
    await verifyDomainConfiguration();

    console.log(`\n✅ Domain configuration complete!`);
    console.log(`\n🌐 Your production URL will be: https://${DOMAIN}`);
  } catch (error) {
    console.error('\n❌ Configuration failed:', error);
    process.exit(1);
  }
}

main();
