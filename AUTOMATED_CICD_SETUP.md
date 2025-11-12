# Automated CI/CD Setup - Complete Guide

**Status**: ✅ Partially Complete (Vercel linked, scripts ready)

This guide provides the programmatic setup for your CI/CD pipeline.

---

## ✅ What's Already Done

1. **✅ Vercel Project Linked**
   - Organization ID: `team_zgbZHABKGlI9iyDBGQQauFTW`
   - Project ID: `prj_zm0h3A5Xcs82mN5ArivZ8Gm4V4I5`
   - Project Name: `next-forge`
   - Location: `.vercel/project.json`

2. **✅ Package Updates**
   - ultracite: 6.3.2
   - All packages updated to latest stable versions

3. **✅ Environment Files Created**
   - `.env.development`
   - `.env.staging`
   - `.env.production`

4. **✅ GitHub Actions Workflows**
   - `.github/workflows/ci.yml`
   - `.github/workflows/deploy-production.yml`
   - `.github/workflows/deploy-staging.yml`

5. **✅ Automation Scripts**
   - `scripts/sync-vercel-env.ts`
   - `scripts/setup-cicd.ts`
   - `scripts/complete-cicd-setup.ts`

---

## 🚀 Programmatic Setup Steps

### Step 1: Initialize Convex Deployments

Since this is a fork of vercel/next-forge, you need to set up Convex for your own deployments.

```bash
# Navigate to database package
cd packages/database

# Initialize production deployment
convex dev
# This will:
# 1. Ask you to log in to Convex (if not already)
# 2. Create a new project or select existing
# 3. Set up your deployment

# Once initialized, deploy to production
convex deploy --yes

# Get the deployment name
convex deployments list

# Create a preview deployment for staging
convex deploy --preview-create staging --yes

# Save these deployment names - you'll need them for GitHub secrets
```

### Step 2: Fork the Repository (If Not Already Done)

Since you're working with vercel/next-forge, you should fork it to your own account:

```bash
# Fork via GitHub CLI
gh repo fork vercel/next-forge --clone=false

# Or fork via web: https://github.com/vercel/next-forge/fork

# Then update your local remote
git remote set-url origin https://github.com/YOUR_USERNAME/next-forge.git
```

### Step 3: Set GitHub Secrets Programmatically

Once you have your own fork, set the secrets:

```bash
# Set Vercel secrets
gh secret set VERCEL_ORG_ID --body "team_zgbZHABKGlI9iyDBGQQauFTW"
gh secret set VERCEL_PROJECT_ID --body "prj_zm0h3A5Xcs82mN5ArivZ8Gm4V4I5"

# Get your Vercel token from: https://vercel.com/account/tokens
gh secret set VERCEL_TOKEN --body "YOUR_VERCEL_TOKEN"

# Set Convex deployment names (from Step 1)
gh secret set CONVEX_DEPLOYMENT_PROD --body "YOUR_PROD_DEPLOYMENT_NAME"
gh secret set CONVEX_DEPLOYMENT_STAGING --body "YOUR_STAGING_DEPLOYMENT_NAME"

# Optional: Turborepo Remote Cache
gh secret set TURBO_TOKEN --body "YOUR_TURBO_TOKEN"
gh secret set TURBO_TEAM --body "YOUR_TURBO_TEAM"
```

### Step 4: Sync Environment Variables to Vercel

```bash
# Set required environment variables
export VERCEL_TOKEN="your-vercel-token"
export VERCEL_PROJECT_ID="prj_zm0h3A5Xcs82mN5ArivZ8Gm4V4I5"
export VERCEL_TEAM_ID="team_zgbZHABKGlI9iyDBGQQauFTW"

# Sync all environments
pnpm sync:env:all

# Or sync individually
pnpm sync:env:dev
pnpm sync:env:staging
pnpm sync:env:prod
```

### Step 5: Configure Convex Environment Variables

```bash
cd packages/database

# Production environment
convex env set WORKOS_API_KEY "your-prod-key"
convex env set ADMIN "admin@yourdomain.com"
# ... add other env vars from .env.production

# Staging environment (use --preview-name)
convex env set WORKOS_API_KEY "your-staging-key" --preview-name staging
convex env set ADMIN "staging@yourdomain.com" --preview-name staging
# ... add other env vars from .env.staging
```

---

## 🤖 One-Command Setup Script

Create a file `setup-all.sh`:

```bash
#!/bin/bash

set -e

echo "🚀 Starting automated CI/CD setup..."

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# Step 1: Initialize Convex
echo -e "${BLUE}Step 1: Initializing Convex...${NC}"
cd packages/database
convex dev --once || true
PROD_DEPLOYMENT=$(convex deployments list --json | jq -r '.[0].deploymentName')
echo -e "${GREEN}✅ Production deployment: $PROD_DEPLOYMENT${NC}"

# Create staging deployment
convex deploy --preview-create staging --yes
STAGING_DEPLOYMENT=$(convex deployments list --json | jq -r '.[] | select(.deploymentType=="dev") | .deploymentName' | head -1)
echo -e "${GREEN}✅ Staging deployment: $STAGING_DEPLOYMENT${NC}"

cd ../..

# Step 2: Set GitHub Secrets
echo -e "${BLUE}Step 2: Setting GitHub secrets...${NC}"
gh secret set VERCEL_ORG_ID --body "team_zgbZHABKGlI9iyDBGQQauFTW"
gh secret set VERCEL_PROJECT_ID --body "prj_zm0h3A5Xcs82mN5ArivZ8Gm4V4I5"
gh secret set CONVEX_DEPLOYMENT_PROD --body "$PROD_DEPLOYMENT"
gh secret set CONVEX_DEPLOYMENT_STAGING --body "$STAGING_DEPLOYMENT"

echo -e "${GREEN}✅ GitHub secrets set${NC}"

# Step 3: Prompt for VERCEL_TOKEN
echo -e "${BLUE}Step 3: Setting VERCEL_TOKEN...${NC}"
echo "Get your token from: https://vercel.com/account/tokens"
read -p "Enter your Vercel token: " VERCEL_TOKEN
gh secret set VERCEL_TOKEN --body "$VERCEL_TOKEN"

# Step 4: Sync environment variables
echo -e "${BLUE}Step 4: Syncing environment variables to Vercel...${NC}"
export VERCEL_TOKEN="$VERCEL_TOKEN"
export VERCEL_PROJECT_ID="prj_zm0h3A5Xcs82mN5ArivZ8Gm4V4I5"
export VERCEL_TEAM_ID="team_zgbZHABKGlI9iyDBGQQauFTW"

pnpm sync:env:all

echo -e "${GREEN}✅ Environment variables synced${NC}"

# Step 5: Create summary
cat > SETUP_COMPLETE.md << EOF
# CI/CD Setup Complete! 🎉

**Date**: $(date +%Y-%m-%d)

## Configuration

- **Vercel Org**: team_zgbZHABKGlI9iyDBGQQauFTW
- **Vercel Project**: prj_zm0h3A5Xcs82mN5ArivZ8Gm4V4I5
- **Convex Prod**: $PROD_DEPLOYMENT
- **Convex Staging**: $STAGING_DEPLOYMENT

## Test Deployment

\`\`\`bash
git checkout -b test/ci-cd
git commit --allow-empty -m "Test CI/CD"
git push origin test/ci-cd
\`\`\`

Check GitHub Actions: https://github.com/YOUR_USERNAME/next-forge/actions
EOF

echo -e "${GREEN}✨ Setup complete! Check SETUP_COMPLETE.md for details${NC}"
```

Make it executable and run:

```bash
chmod +x setup-all.sh
./setup-all.sh
```

---

## 📋 Manual Checklist

If you prefer to do it step-by-step:

- [ ] Fork vercel/next-forge to your account
- [ ] Update git remote to your fork
- [ ] Initialize Convex: `cd packages/database && convex dev`
- [ ] Deploy Convex production: `convex deploy --yes`
- [ ] Deploy Convex staging: `convex deploy --preview-create staging --yes`
- [ ] Set GitHub secret: `VERCEL_ORG_ID`
- [ ] Set GitHub secret: `VERCEL_PROJECT_ID`
- [ ] Set GitHub secret: `VERCEL_TOKEN`
- [ ] Set GitHub secret: `CONVEX_DEPLOYMENT_PROD`
- [ ] Set GitHub secret: `CONVEX_DEPLOYMENT_STAGING`
- [ ] Sync env vars: `pnpm sync:env:all`
- [ ] Test CI/CD: Create and push a test branch

---

## 🔧 Available Scripts

```bash
# Sync environment variables
pnpm sync:env:dev          # Development
pnpm sync:env:staging      # Staging
pnpm sync:env:prod         # Production
pnpm sync:env:all          # All environments

# Convex
pnpm convex:dev            # Start Convex dev server
pnpm convex:deploy         # Deploy Convex

# Development
pnpm dev                   # Start all apps
pnpm build                 # Build all apps
pnpm test                  # Run tests
pnpm check                 # Lint code
```

---

## 🎯 Current Status

| Task | Status |
|------|--------|
| Vercel Project Linked | ✅ Complete |
| Package Updates | ✅ Complete |
| Environment Files | ✅ Complete |
| GitHub Workflows | ✅ Complete |
| Automation Scripts | ✅ Complete |
| Convex Deployments | ⚠️ Needs Setup |
| GitHub Secrets | ⚠️ Needs Fork |
| Env Var Sync | ⚠️ Needs Token |

---

## 🚨 Important Notes

1. **Repository Fork**: You're working with vercel/next-forge. You need to fork it to set GitHub secrets.

2. **Convex Setup**: Convex needs interactive setup the first time. Run `convex dev` in `packages/database`.

3. **Vercel Token**: Get from https://vercel.com/account/tokens

4. **Environment Variables**: Update the `.env.*` files with your actual API keys before syncing.

---

## 📞 Quick Commands Reference

```bash
# Complete setup in one go (after forking)
./setup-all.sh

# Or step by step:
cd packages/database && convex dev
convex deploy --yes
cd ../..
gh secret set VERCEL_TOKEN --body "your-token"
pnpm sync:env:all
```

---

**Next**: Run the setup script or follow the manual checklist above! 🚀

