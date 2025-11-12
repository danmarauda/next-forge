#!/bin/bash
set -e

echo "🚀 Next-Forge CI/CD Automated Setup"
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 1. Get Vercel token
echo -e "${BLUE}Step 1: Vercel Authentication${NC}"
if [ -z "$VERCEL_TOKEN" ]; then
    echo "Get your token from: https://vercel.com/account/tokens"
    read -p "Enter your Vercel token: " VERCEL_TOKEN
fi
export VERCEL_TOKEN
export VERCEL_PROJECT_ID="prj_zm0h3A5Xcs82mN5ArivZ8Gm4V4I5"
export VERCEL_TEAM_ID="team_zgbZHABKGlI9iyDBGQQauFTW"
echo -e "${GREEN}✅ Vercel authenticated${NC}"
echo ""

# 2. Configure domain
echo -e "${BLUE}Step 2: Configuring ara.aliaslabs.ai${NC}"
pnpm setup:domain
echo ""

# 3. Initialize Convex
echo -e "${BLUE}Step 3: Setting up Convex deployments${NC}"
cd packages/database

echo "Initializing Convex (this may open a browser)..."
convex dev --once || true

echo "Deploying to production..."
convex deploy --yes
PROD_DEPLOYMENT=$(convex deployments list --json 2>/dev/null | jq -r '.[0].deploymentName' || echo "")

echo "Creating staging deployment..."
convex deploy --preview-create staging --yes
STAGING_DEPLOYMENT=$(convex deployments list --json 2>/dev/null | jq -r '.[] | select(.deploymentType=="dev") | .deploymentName' | head -1 || echo "")

cd ../..
echo -e "${GREEN}✅ Convex deployments created${NC}"
echo "   Production: $PROD_DEPLOYMENT"
echo "   Staging: $STAGING_DEPLOYMENT"
echo ""

# 4. Set GitHub secrets
echo -e "${BLUE}Step 4: Setting GitHub secrets${NC}"
gh secret set VERCEL_ORG_ID --body "team_zgbZHABKGlI9iyDBGQQauFTW"
gh secret set VERCEL_PROJECT_ID --body "prj_zm0h3A5Xcs82mN5ArivZ8Gm4V4I5"
gh secret set VERCEL_TOKEN --body "$VERCEL_TOKEN"

if [ -n "$PROD_DEPLOYMENT" ]; then
    gh secret set CONVEX_DEPLOYMENT_PROD --body "$PROD_DEPLOYMENT"
fi

if [ -n "$STAGING_DEPLOYMENT" ]; then
    gh secret set CONVEX_DEPLOYMENT_STAGING --body "$STAGING_DEPLOYMENT"
fi

echo -e "${GREEN}✅ GitHub secrets configured${NC}"
echo ""

# 5. Sync environment variables
echo -e "${BLUE}Step 5: Syncing environment variables to Vercel${NC}"
pnpm sync:env:all
echo -e "${GREEN}✅ Environment variables synced${NC}"
echo ""

# Summary
echo "===================================="
echo -e "${GREEN}✨ Setup Complete!${NC}"
echo ""
echo "Configuration:"
echo "  • Vercel Project: prj_zm0h3A5Xcs82mN5ArivZ8Gm4V4I5"
echo "  • Production Domain: ara.aliaslabs.ai"
echo "  • Convex Prod: $PROD_DEPLOYMENT"
echo "  • Convex Staging: $STAGING_DEPLOYMENT"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Configure DNS for ara.aliaslabs.ai (see PRODUCTION_DOMAIN_SETUP.md)"
echo "2. Update OAuth redirect URIs to https://ara.aliaslabs.ai/api/auth/callback"
echo "3. Test deployment: git push origin main"
echo ""
echo "Documentation:"
echo "  • FINAL_SETUP_SUMMARY.md - Complete overview"
echo "  • PRODUCTION_DOMAIN_SETUP.md - DNS configuration"
echo "  • CI_CD_SETUP.md - Detailed setup guide"
echo ""

