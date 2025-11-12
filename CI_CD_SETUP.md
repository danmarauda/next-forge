# CI/CD Setup Guide

This guide explains how to set up Continuous Integration and Continuous Deployment for the Next-Forge monorepo with Vercel and Convex.

## 📋 Table of Contents

- [Overview](#overview)
- [Environment Structure](#environment-structure)
- [Prerequisites](#prerequisites)
- [Initial Setup](#initial-setup)
- [GitHub Secrets](#github-secrets)
- [Vercel Setup](#vercel-setup)
- [Convex Setup](#convex-setup)
- [Environment Variables](#environment-variables)
- [Deployment Workflow](#deployment-workflow)
- [Troubleshooting](#troubleshooting)

---

## Overview

The project uses a three-environment setup:

1. **Development** - Local development and preview deployments
2. **Staging** - Pre-production testing environment
3. **Production** - Live production environment

### Technology Stack

- **CI/CD**: GitHub Actions
- **Hosting**: Vercel
- **Backend**: Convex
- **Monorepo**: Turborepo with pnpm

---

## Environment Structure

```
.env.development    # Development environment variables
.env.staging        # Staging environment variables
.env.production     # Production environment variables
.env.local          # Local overrides (gitignored)
```

### Branch Strategy

- `main` → Production deployments
- `staging` → Staging deployments
- `dev` → Development/preview deployments
- Feature branches → Preview deployments

---

## Prerequisites

Before setting up CI/CD, ensure you have:

1. **Vercel Account** - [Sign up](https://vercel.com/signup)
2. **Convex Account** - [Sign up](https://convex.dev)
3. **GitHub Repository** - With admin access
4. **Node.js 18+** - For local development
5. **pnpm 10.21.0** - Package manager

---

## Initial Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Update Packages

All packages have been updated to their latest stable versions:

- ✅ ultracite: 6.0.3 → 6.3.2
- ✅ @biomejs/biome: 2.3.1 → 2.3.5
- ✅ turbo: 2.5.8 → 2.6.1
- ✅ pnpm: 10.19.0 → 10.21.0
- ✅ And 100+ other package updates

### 3. Configure Local Environment

```bash
# Copy development env template
cp .env.development .env.local

# Edit .env.local with your local credentials
```

---

## GitHub Secrets

Add these secrets to your GitHub repository:

### Required Secrets

Navigate to: **Settings → Secrets and variables → Actions → New repository secret**

#### Vercel Secrets

```
VERCEL_TOKEN          # Vercel API token
VERCEL_ORG_ID         # Vercel organization ID
VERCEL_PROJECT_ID     # Vercel project ID
```

**How to get these:**

1. **VERCEL_TOKEN**: 
   - Go to https://vercel.com/account/tokens
   - Create a new token with full access
   
2. **VERCEL_ORG_ID** and **VERCEL_PROJECT_ID**:
   - Run `vercel link` in your project
   - Check `.vercel/project.json` for the IDs

#### Convex Secrets

```
CONVEX_DEPLOYMENT_PROD      # Production Convex deployment
CONVEX_DEPLOYMENT_STAGING   # Staging Convex deployment
```

**How to get these:**

```bash
# Production
cd packages/database
convex deploy --prod
# Copy the deployment name

# Staging
convex deploy --preview
# Copy the deployment name
```

#### Turborepo Secrets (Optional)

```
TURBO_TOKEN    # Turborepo Remote Cache token
TURBO_TEAM     # Turborepo team name
```

---

## Vercel Setup

### 1. Create Vercel Project

```bash
# Install Vercel CLI
pnpm add -g vercel

# Link project
vercel link

# This creates .vercel/project.json
```

### 2. Configure Vercel Environments

Vercel has three environments:
- **Production** - Deployments from `main` branch
- **Preview** - Deployments from other branches
- **Development** - Local development

### 3. Set Environment Variables in Vercel

#### Option A: Using the Sync Script (Recommended)

```bash
# Set required env vars first
export VERCEL_TOKEN="your-token"
export VERCEL_PROJECT_ID="your-project-id"
export VERCEL_TEAM_ID="your-team-id"  # Optional

# Sync all environments
pnpm sync:env:all

# Or sync individually
pnpm sync:env:dev
pnpm sync:env:staging
pnpm sync:env:prod
```

#### Option B: Manual Setup

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add variables for each environment (Production, Preview, Development)
3. Use the values from `.env.production`, `.env.staging`, `.env.development`

---

## Convex Setup

### 1. Create Convex Deployments

```bash
cd packages/database

# Production deployment
convex deploy --prod
# Save the deployment name as CONVEX_DEPLOYMENT_PROD

# Staging deployment
convex deploy --preview
# Save the deployment name as CONVEX_DEPLOYMENT_STAGING

# Development (local)
convex dev
```

### 2. Configure Convex Environment Variables

Each Convex deployment needs its own environment variables:

```bash
# Production
convex env set WORKOS_API_KEY "sk_live_..." --prod
convex env set ADMIN "admin@yourdomain.com" --prod

# Staging
convex env set WORKOS_API_KEY "sk_test_..." --preview
convex env set ADMIN "staging@yourdomain.com" --preview
```

---

## Environment Variables

### Required Variables

All environments need these variables:

#### Convex
```bash
CONVEX_DEPLOYMENT=""
NEXT_PUBLIC_CONVEX_URL=""
```

#### WorkOS
```bash
WORKOS_API_KEY=""
WORKOS_CLIENT_ID=""
WORKOS_REDIRECT_URI=""
NEXT_PUBLIC_WORKOS_CLIENT_ID=""
NEXT_PUBLIC_SITE_URL=""
ADMIN=""
```

#### Optional Services
```bash
# Liveblocks
LIVEBLOCKS_SECRET_KEY=""
NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=""

# ElevenLabs
ELEVENLABS_API_KEY=""

# Stripe
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""

# Email
RESEND_FROM=""
RESEND_TOKEN=""

# Analytics
NEXT_PUBLIC_POSTHOG_KEY=""
NEXT_PUBLIC_GA_MEASUREMENT_ID=""

# And more...
```

See `.env.example` files for complete list.

---

## Deployment Workflow

### Automatic Deployments

#### Production (main branch)

```bash
git checkout main
git merge staging
git push origin main
```

This triggers:
1. ✅ Lint, typecheck, test
2. ✅ Build all apps
3. ✅ Deploy to Vercel (production)
4. ✅ Deploy Convex (production)

#### Staging (staging branch)

```bash
git checkout staging
git merge dev
git push origin staging
```

This triggers:
1. ✅ Lint, typecheck, test
2. ✅ Build all apps
3. ✅ Deploy to Vercel (preview)
4. ✅ Deploy Convex (staging)

#### Development (feature branches)

```bash
git checkout -b feature/my-feature
git push origin feature/my-feature
```

This triggers:
1. ✅ Lint, typecheck, test
2. ✅ Build verification
3. ✅ Preview deployment (Vercel)

### Manual Deployments

#### Deploy to Production

```bash
# Via GitHub Actions
gh workflow run deploy-production.yml

# Or via Vercel CLI
vercel --prod
```

#### Deploy to Staging

```bash
# Via GitHub Actions
gh workflow run deploy-staging.yml

# Or via Vercel CLI
vercel
```

---

## Troubleshooting

### Build Failures

**Problem**: Build fails with missing environment variables

**Solution**:
```bash
# Check GitHub secrets are set
gh secret list

# Verify Vercel env vars
vercel env ls

# Test build locally
pnpm build
```

### Deployment Failures

**Problem**: Vercel deployment fails

**Solution**:
```bash
# Check Vercel logs
vercel logs

# Verify project is linked
vercel link

# Check build output
vercel build
```

### Convex Deployment Issues

**Problem**: Convex deployment fails

**Solution**:
```bash
# Check Convex status
cd packages/database
convex dev

# Verify deployment exists
convex deployments list

# Check environment variables
convex env list
```

### Environment Variable Sync Issues

**Problem**: Env vars not syncing to Vercel

**Solution**:
```bash
# Verify tokens are set
echo $VERCEL_TOKEN
echo $VERCEL_PROJECT_ID

# Check script permissions
chmod +x scripts/sync-vercel-env.ts

# Run with verbose output
tsx scripts/sync-vercel-env.ts all
```

---

## Scripts Reference

```bash
# Development
pnpm dev                    # Start all apps in dev mode
pnpm convex:dev            # Start Convex dev server

# Building
pnpm build                 # Build all apps
pnpm typecheck             # Type check all packages

# Testing
pnpm test                  # Run all tests
pnpm check                 # Lint all code

# Deployment
pnpm convex:deploy         # Deploy Convex
pnpm sync:env:dev          # Sync dev env vars to Vercel
pnpm sync:env:staging      # Sync staging env vars to Vercel
pnpm sync:env:prod         # Sync prod env vars to Vercel
pnpm sync:env:all          # Sync all env vars to Vercel

# Maintenance
pnpm bump-deps             # Update all dependencies
pnpm clean                 # Clean node_modules
```

---

## Next Steps

1. ✅ Set up GitHub secrets
2. ✅ Configure Vercel project
3. ✅ Create Convex deployments
4. ✅ Sync environment variables
5. ✅ Test deployment pipeline
6. ✅ Monitor first production deployment

---

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Convex Docs**: https://docs.convex.dev
- **GitHub Actions**: https://docs.github.com/actions
- **Turborepo**: https://turbo.build/repo/docs

---

**Last Updated**: 2025-01-12
**Version**: 1.0.0

