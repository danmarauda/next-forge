#!/usr/bin/env tsx
/**
 * Automated CI/CD Setup Script
 * 
 * This script automates the entire CI/CD setup process:
 * 1. Links Vercel project
 * 2. Creates Convex deployments
 * 3. Syncs environment variables to Vercel
 * 4. Sets up GitHub secrets
 * 
 * Usage:
 *   pnpm setup:cicd
 */

import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { config } from 'dotenv';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

function log(message: string, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function success(message: string) {
  log(`✅ ${message}`, colors.green);
}

function info(message: string) {
  log(`ℹ️  ${message}`, colors.blue);
}

function warn(message: string) {
  log(`⚠️  ${message}`, colors.yellow);
}

function error(message: string) {
  log(`❌ ${message}`, colors.red);
}

function exec(command: string, silent = false): string {
  try {
    return execSync(command, {
      encoding: 'utf-8',
      stdio: silent ? 'pipe' : 'inherit',
    }).trim();
  } catch (err: any) {
    if (!silent) {
      error(`Command failed: ${command}`);
      error(err.message);
    }
    throw err;
  }
}

function execSilent(command: string): string | null {
  try {
    return exec(command, true);
  } catch {
    return null;
  }
}

/**
 * Check if required CLI tools are installed
 */
function checkPrerequisites() {
  info('Checking prerequisites...');

  const tools = [
    { name: 'vercel', command: 'vercel --version', install: 'pnpm add -g vercel' },
    { name: 'gh', command: 'gh --version', install: 'brew install gh' },
    { name: 'convex', command: 'convex --version', install: 'pnpm add -g convex' },
  ];

  const missing: string[] = [];

  for (const tool of tools) {
    const result = execSilent(tool.command);
    if (result) {
      success(`${tool.name} is installed`);
    } else {
      error(`${tool.name} is not installed`);
      warn(`Install with: ${tool.install}`);
      missing.push(tool.name);
    }
  }

  if (missing.length > 0) {
    error('Missing required tools. Please install them and try again.');
    process.exit(1);
  }

  success('All prerequisites met!');
}

/**
 * Link Vercel project
 */
function setupVercel() {
  info('Setting up Vercel project...');

  const vercelDir = resolve(process.cwd(), '.vercel');
  const projectJsonPath = resolve(vercelDir, 'project.json');

  if (existsSync(projectJsonPath)) {
    success('Vercel project already linked');
    const projectJson = JSON.parse(readFileSync(projectJsonPath, 'utf-8'));
    return {
      orgId: projectJson.orgId,
      projectId: projectJson.projectId,
    };
  }

  info('Linking Vercel project...');
  exec('vercel link');

  if (!existsSync(projectJsonPath)) {
    error('Failed to link Vercel project');
    process.exit(1);
  }

  const projectJson = JSON.parse(readFileSync(projectJsonPath, 'utf-8'));
  success('Vercel project linked successfully!');

  return {
    orgId: projectJson.orgId,
    projectId: projectJson.projectId,
  };
}

/**
 * Create Convex deployments
 */
function setupConvex() {
  info('Setting up Convex deployments...');

  const convexDir = resolve(process.cwd(), 'packages/database');
  process.chdir(convexDir);

  // Check if already deployed
  const deployments = execSilent('convex deployments list');
  
  if (deployments && deployments.includes('prod')) {
    success('Convex production deployment already exists');
  } else {
    info('Creating production deployment...');
    exec('convex deploy --prod --yes');
    success('Production deployment created!');
  }

  if (deployments && deployments.includes('staging')) {
    success('Convex staging deployment already exists');
  } else {
    info('Creating staging deployment...');
    exec('convex deploy --preview --yes');
    success('Staging deployment created!');
  }

  // Get deployment names
  const prodDeployment = exec('convex deployments list --json', true);
  const deploymentData = JSON.parse(prodDeployment);
  
  const prod = deploymentData.find((d: any) => d.deploymentType === 'prod');
  const staging = deploymentData.find((d: any) => d.deploymentType === 'dev');

  process.chdir(resolve(process.cwd(), '../..'));

  return {
    prod: prod?.deploymentName || '',
    staging: staging?.deploymentName || '',
  };
}

/**
 * Set up GitHub secrets
 */
function setupGitHubSecrets(vercelConfig: any, convexConfig: any) {
  info('Setting up GitHub secrets...');

  // Check if gh is authenticated
  const authStatus = execSilent('gh auth status');
  if (!authStatus) {
    warn('GitHub CLI not authenticated. Run: gh auth login');
    return;
  }

  const secrets = [
    { name: 'VERCEL_TOKEN', value: process.env.VERCEL_TOKEN || '', required: true },
    { name: 'VERCEL_ORG_ID', value: vercelConfig.orgId, required: true },
    { name: 'VERCEL_PROJECT_ID', value: vercelConfig.projectId, required: true },
    { name: 'CONVEX_DEPLOYMENT_PROD', value: convexConfig.prod, required: true },
    { name: 'CONVEX_DEPLOYMENT_STAGING', value: convexConfig.staging, required: true },
    { name: 'TURBO_TOKEN', value: process.env.TURBO_TOKEN || '', required: false },
    { name: 'TURBO_TEAM', value: process.env.TURBO_TEAM || '', required: false },
  ];

  for (const secret of secrets) {
    if (!secret.value && secret.required) {
      error(`Missing required value for ${secret.name}`);
      if (secret.name === 'VERCEL_TOKEN') {
        warn('Set VERCEL_TOKEN environment variable or get it from: https://vercel.com/account/tokens');
      }
      continue;
    }

    if (!secret.value) {
      warn(`Skipping optional secret: ${secret.name}`);
      continue;
    }

    try {
      exec(`gh secret set ${secret.name} --body "${secret.value}"`, true);
      success(`Set GitHub secret: ${secret.name}`);
    } catch (err) {
      error(`Failed to set secret: ${secret.name}`);
    }
  }
}

/**
 * Sync environment variables to Vercel
 */
async function syncEnvToVercel() {
  info('Syncing environment variables to Vercel...');

  if (!process.env.VERCEL_TOKEN) {
    error('VERCEL_TOKEN not set. Skipping Vercel env sync.');
    warn('Set VERCEL_TOKEN and run: pnpm sync:env:all');
    return;
  }

  try {
    exec('pnpm sync:env:all');
    success('Environment variables synced to Vercel!');
  } catch (err) {
    error('Failed to sync environment variables');
    warn('Run manually: pnpm sync:env:all');
  }
}

/**
 * Create summary file
 */
function createSummary(vercelConfig: any, convexConfig: any) {
  const summary = `# CI/CD Setup Complete

**Date**: ${new Date().toISOString().split('T')[0]}

## Vercel Configuration

- **Organization ID**: ${vercelConfig.orgId}
- **Project ID**: ${vercelConfig.projectId}

## Convex Deployments

- **Production**: ${convexConfig.prod}
- **Staging**: ${convexConfig.staging}

## Next Steps

1. ✅ Vercel project linked
2. ✅ Convex deployments created
3. ✅ GitHub secrets configured
4. ${process.env.VERCEL_TOKEN ? '✅' : '⚠️'} Environment variables synced

${!process.env.VERCEL_TOKEN ? `
### Manual Steps Required

Set VERCEL_TOKEN and sync environment variables:

\`\`\`bash
export VERCEL_TOKEN="your-token"
pnpm sync:env:all
\`\`\`
` : ''}

## Test Deployment

\`\`\`bash
git checkout -b test/ci-cd
git push origin test/ci-cd
\`\`\`

Check GitHub Actions to verify CI runs successfully.
`;

  writeFileSync('CICD_SETUP_COMPLETE.md', summary);
  success('Summary written to CICD_SETUP_COMPLETE.md');
}

/**
 * Main setup function
 */
async function main() {
  log('\n🚀 Automated CI/CD Setup\n', colors.bright);

  try {
    // Step 1: Check prerequisites
    checkPrerequisites();

    // Step 2: Set up Vercel
    const vercelConfig = setupVercel();

    // Step 3: Set up Convex
    const convexConfig = setupConvex();

    // Step 4: Set up GitHub secrets
    setupGitHubSecrets(vercelConfig, convexConfig);

    // Step 5: Sync environment variables
    await syncEnvToVercel();

    // Step 6: Create summary
    createSummary(vercelConfig, convexConfig);

    log('\n✨ CI/CD setup complete!\n', colors.green);
    info('Check CICD_SETUP_COMPLETE.md for details');

  } catch (err: any) {
    error(`Setup failed: ${err.message}`);
    process.exit(1);
  }
}

main();

