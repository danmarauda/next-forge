# 🚀 Quick Start Guide
## Getting Started with Enhanced next-forge

This guide will help you get started with the enhanced next-forge monorepo, including feature flags, WorkOS services, and CI/CD.

---

## 📋 Prerequisites

- Node.js >= 18
- pnpm 10.19.0
- Convex account
- WorkOS account
- GitHub account (for CI/CD)

---

## 🔧 Setup Steps

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment Variables

Copy the example environment files:

```bash
# App environment
cp apps/app/.env.example apps/app/.env.local

# Database environment
cp packages/database/.env.example packages/database/.env.local
```

Fill in the required values:

```bash
# apps/app/.env.local
WORKOS_API_KEY=sk_...
WORKOS_CLIENT_ID=client_...
WORKOS_REDIRECT_URI=http://localhost:3000/auth/callback
NEXT_PUBLIC_WORKOS_CLIENT_ID=client_...
NEXT_PUBLIC_SITE_URL=http://localhost:3000

CONVEX_DEPLOYMENT=your-deployment-name
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

ADMIN=admin@example.com
```

### 3. Validate Environment

```bash
pnpm validate:env
```

This will check that all required environment variables are set correctly.

### 4. Initialize Convex

```bash
cd packages/database
npx convex dev
```

This will:
- Initialize Convex (if not already done)
- Give you `CONVEX_DEPLOYMENT` and `NEXT_PUBLIC_CONVEX_URL`
- Start the Convex development server

### 5. Start Development Server

```bash
pnpm dev
```

This starts:
- App on `http://localhost:3000`
- API on `http://localhost:3002`
- Convex dev server

---

## 🎯 Using Feature Flags

### Server Components

```typescript
import { workosSSOEnabled } from "@repo/feature-flags";

export default async function Page() {
  const ssoEnabled = await workosSSOEnabled();
  
  return (
    <div>
      {ssoEnabled ? (
        <SSOButton />
      ) : (
        <MagicCodeButton />
      )}
    </div>
  );
}
```

### Client Components

```typescript
"use client";

import { useWorkOSFeature } from "@repo/feature-flags/hooks";

export function SSOButton() {
  const ssoEnabled = useWorkOSFeature("sso");
  
  if (!ssoEnabled) return null;
  
  return <button>Sign in with SSO</button>;
}
```

### Check Multiple Flags

```typescript
import { useWorkOSFeatures } from "@repo/feature-flags/hooks";

export function WorkOSFeatures() {
  const flags = useWorkOSFeatures();
  
  return (
    <div>
      {flags.sso && <SSOButton />}
      {flags.directorySync && <DirectorySyncButton />}
      {flags.auditLogs && <AuditLogsButton />}
    </div>
  );
}
```

---

## 🏢 Using WorkOS Service

### Server-Side

```typescript
import { WorkOSService } from "@repo/workos-service";

const workos = new WorkOSService();

// Check if SSO is enabled
if (workos.sso.isEnabled()) {
  const authUrl = await workos.sso.getAuthorizationUrl({
    organizationId: "org_123",
    redirectUri: "https://app.com/callback",
  });
  
  // Redirect user
  redirect(authUrl);
}
```

### Client-Side

```typescript
"use client";

import { useWorkOSSSO } from "@repo/workos-service";

export function SSOButton() {
  const sso = useWorkOSSSO();
  
  const handleClick = async () => {
    if (sso.isEnabled()) {
      const authUrl = await sso.getAuthorizationUrl({
        organizationId: "org_123",
        redirectUri: window.location.origin + "/callback",
      });
      window.location.href = authUrl;
    }
  };
  
  return <button onClick={handleClick}>SSO Login</button>;
}
```

---

## 🔄 CI/CD Setup

### 1. Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add the following secrets:

```
WORKOS_API_KEY
WORKOS_CLIENT_ID
WORKOS_REDIRECT_URI
CONVEX_DEPLOYMENT
NEXT_PUBLIC_CONVEX_URL
NEXT_PUBLIC_SITE_URL
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
```

### 2. Workflows

The following workflows are automatically configured:

- **Test** (`.github/workflows/test.yml`)
  - Runs on PR and push to main
  - Type checking, linting, tests

- **Build** (`.github/workflows/build.yml`)
  - Runs on PR and push to main
  - Builds all packages and apps

- **Deploy** (`.github/workflows/deploy.yml`)
  - Runs on push to main
  - Deploys to Vercel and Convex

- **Security** (`.github/workflows/security.yml`)
  - Runs on PR, push, and weekly
  - Vulnerability and secret scanning

### 3. Test CI/CD

Create a test PR to verify workflows:

```bash
git checkout -b test-ci-cd
git commit --allow-empty -m "Test CI/CD"
git push origin test-ci-cd
```

Then create a PR on GitHub and check the Actions tab.

---

## 🏥 Health Checks

### Check Health Endpoint

```bash
# Start the API server first
pnpm dev

# In another terminal
pnpm health:check
```

Or manually:

```bash
curl http://localhost:3002/api/health
```

Response:

```json
{
  "status": "healthy",
  "checks": {
    "workos": { "status": "healthy" },
    "convex": { "status": "healthy" }
  },
  "timestamp": "2025-01-27T00:00:00.000Z"
}
```

---

## 📚 Available Scripts

```bash
# Development
pnpm dev                    # Start all dev servers
pnpm build                  # Build all packages and apps
pnpm test                   # Run all tests
pnpm typecheck             # Type check all packages

# Feature Flags
# Use feature flags in your code (see examples above)

# WorkOS Service
# Use WorkOS service in your code (see examples above)

# Validation
pnpm validate:env          # Validate environment variables
pnpm health:check          # Check health endpoint

# Convex
pnpm convex:dev            # Start Convex dev server
pnpm convex:deploy         # Deploy Convex functions
```

---

## 🐛 Troubleshooting

### Environment Validation Fails

```bash
# Check which variables are missing
pnpm validate:env

# Make sure all required variables are set in .env.local
```

### WorkOS Service Not Working

```bash
# Check if WorkOS is enabled
echo $NEXT_PUBLIC_WORKOS_AUTH_ENABLED

# Check WorkOS credentials
echo $WORKOS_API_KEY | cut -c1-8
echo $WORKOS_CLIENT_ID
```

### Convex Not Connecting

```bash
# Check Convex deployment
echo $CONVEX_DEPLOYMENT
echo $NEXT_PUBLIC_CONVEX_URL

# Restart Convex dev server
cd packages/database
npx convex dev
```

### CI/CD Failing

1. Check GitHub Secrets are set correctly
2. Check workflow logs in Actions tab
3. Verify environment variables in workflow files

---

## 📖 Next Steps

1. ✅ Read `CODEBASE_ANALYSIS.md` for architecture overview
2. ✅ Read `IMPLEMENTATION_PLAN.md` for implementation details
3. ✅ Read `IMPLEMENTATION_SUMMARY.md` for what was implemented
4. ✅ Configure feature flags in PostHog
5. ✅ Set up WorkOS features in WorkOS dashboard
6. ✅ Configure CI/CD secrets
7. ✅ Test deployments

---

## 🆘 Need Help?

- Check the documentation files in the root directory
- Review the codebase analysis document
- Check GitHub Actions logs for CI/CD issues
- Validate environment variables with `pnpm validate:env`

---

**Last Updated:** 2025-01-27

