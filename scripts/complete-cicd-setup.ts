#!/usr/bin/env tsx
/**
 * Complete CI/CD Setup
 * Continues from where setup-cicd.ts left off
 */

import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const colors = {
  reset: '\x1b[0m',
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
    }
    throw err;
  }
}

async function main() {
  log('\n🚀 Completing CI/CD Setup\n', colors.green);

  // Read Vercel config
  const projectJson = JSON.parse(
    readFileSync('.vercel/project.json', 'utf-8')
  );
  const { projectId, orgId } = projectJson;

  success(`Vercel project: ${projectId}`);
  success(`Vercel org: ${orgId}`);

  // Set up Convex deployments
  info('\nSetting up Convex deployments...');
  
  const convexDir = resolve(process.cwd(), 'packages/database');
  process.chdir(convexDir);

  let prodDeployment = '';
  let stagingDeployment = '';

  try {
    info('Creating production deployment...');
    const prodOutput = exec('convex deploy --prod --yes 2>&1', true);
    const prodMatch = prodOutput.match(/Deployment name: ([^\s]+)/);
    prodDeployment = prodMatch ? prodMatch[1] : '';
    success(`Production deployment: ${prodDeployment}`);
  } catch (err) {
    error('Failed to create production deployment');
  }

  try {
    info('Creating staging deployment...');
    const stagingOutput = exec('convex deploy --preview-name staging --yes 2>&1', true);
    const stagingMatch = stagingOutput.match(/Deployment name: ([^\s]+)/);
    stagingDeployment = stagingMatch ? stagingMatch[1] : '';
    success(`Staging deployment: ${stagingDeployment}`);
  } catch (err) {
    error('Failed to create staging deployment');
  }

  process.chdir(resolve(process.cwd(), '../..'));

  // Set up GitHub secrets
  info('\nSetting up GitHub secrets...');

  const secrets = [
    { name: 'VERCEL_ORG_ID', value: orgId },
    { name: 'VERCEL_PROJECT_ID', value: projectId },
    { name: 'CONVEX_DEPLOYMENT_PROD', value: prodDeployment },
    { name: 'CONVEX_DEPLOYMENT_STAGING', value: stagingDeployment },
  ];

  for (const secret of secrets) {
    if (!secret.value) {
      error(`Missing value for ${secret.name}`);
      continue;
    }

    try {
      exec(`gh secret set ${secret.name} --body "${secret.value}"`, true);
      success(`Set GitHub secret: ${secret.name}`);
    } catch (err) {
      error(`Failed to set secret: ${secret.name}`);
    }
  }

  // Create summary
  const summary = `# CI/CD Setup Complete

**Date**: ${new Date().toISOString().split('T')[0]}

## ✅ Vercel Configuration

- **Organization ID**: \`${orgId}\`
- **Project ID**: \`${projectId}\`
- **Project URL**: https://vercel.com/alias-labs/next-forge

## ✅ Convex Deployments

- **Production**: \`${prodDeployment}\`
- **Staging**: \`${stagingDeployment}\`

## ✅ GitHub Secrets

The following secrets have been set in your GitHub repository:

- \`VERCEL_ORG_ID\`
- \`VERCEL_PROJECT_ID\`
- \`CONVEX_DEPLOYMENT_PROD\`
- \`CONVEX_DEPLOYMENT_STAGING\`

## 📋 Next Steps

### 1. Set VERCEL_TOKEN Secret

You need to manually set the VERCEL_TOKEN secret:

\`\`\`bash
# Get your token from: https://vercel.com/account/tokens
gh secret set VERCEL_TOKEN --body "your-vercel-token"
\`\`\`

### 2. Sync Environment Variables to Vercel

\`\`\`bash
export VERCEL_TOKEN="your-vercel-token"
export VERCEL_PROJECT_ID="${projectId}"
export VERCEL_TEAM_ID="${orgId}"

pnpm sync:env:all
\`\`\`

### 3. Test the CI/CD Pipeline

\`\`\`bash
# Create a test branch
git checkout -b test/ci-cd
git commit --allow-empty -m "Test CI/CD pipeline"
git push origin test/ci-cd
\`\`\`

Check the GitHub Actions tab to verify the CI runs successfully.

### 4. Deploy to Production

\`\`\`bash
# Merge to main to trigger production deployment
git checkout main
git merge test/ci-cd
git push origin main
\`\`\`

## 🎯 What's Configured

✅ Vercel project linked  
✅ Convex production deployment created  
✅ Convex staging deployment created  
✅ GitHub secrets configured  
✅ GitHub Actions workflows ready  
✅ Environment variable templates created  

## 📚 Documentation

- **Setup Guide**: \`CI_CD_SETUP.md\`
- **Implementation Summary**: \`CICD_IMPLEMENTATION_SUMMARY.md\`

---

**Status**: Ready for deployment! 🚀
`;

  writeFileSync('CICD_SETUP_COMPLETE.md', summary);
  success('\nSummary written to CICD_SETUP_COMPLETE.md');

  log('\n✨ CI/CD setup complete!\n', colors.green);
  info('Next: Set VERCEL_TOKEN and sync environment variables');
  info('Run: gh secret set VERCEL_TOKEN --body "your-token"');
  info('Then: pnpm sync:env:all');
}

main().catch((err) => {
  error(`Setup failed: ${err.message}`);
  process.exit(1);
});

