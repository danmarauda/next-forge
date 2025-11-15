# WorkOS Credentials Setup Guide

## 🚨 CRITICAL: Required Before Running Setup Script

The organization setup script **requires valid WorkOS credentials**. You cannot proceed without them.

---

## Option 1: Get Existing Credentials (Recommended)

If you already have a WorkOS account for ARA Group Platform:

1. **Login to WorkOS Dashboard**
   - Go to: https://dashboard.workos.com
   - Sign in with your WorkOS account

2. **Navigate to API Keys**
   - Click on your environment (Development/Production)
   - Go to: https://dashboard.workos.com/api-keys

3. **Copy Credentials**
   - **API Key**: Starts with `sk_test_` (dev) or `sk_live_` (prod)
   - **Client ID**: Starts with `client_`

4. **Update Environment File**
   ```bash
   # Edit /Users/alias/Clients/ARAGroup-Platform/apps/app/.env.local
   WORKOS_API_KEY="sk_test_YOUR_ACTUAL_KEY"
   WORKOS_CLIENT_ID="client_YOUR_ACTUAL_ID"
   ```

5. **Run Setup Script**
   ```bash
   cd /Users/alias/Clients/ARAGroup-Platform
   npx tsx scripts/setup-all-ara-organizations.ts
   ```

---

## Option 2: Create New WorkOS Account

If you don't have a WorkOS account yet:

### Step 1: Sign Up

1. Go to: https://workos.com
2. Click "Start building for free"
3. Create account with ARA Group email

### Step 2: Create Project

1. After login, create a new project
2. Name: **ARA Group Platform**
3. Choose environment: **Development** (for testing)

### Step 3: Configure Redirect URI

1. In dashboard, go to: **Configuration → Redirect URIs**
2. Add development URL:
   ```
   http://localhost:3000/auth/callback
   http://ara.aliaslabs.ai:3000/auth/callback
   ```
3. Save changes

### Step 4: Get API Credentials

1. Go to: **API Keys** section
2. Copy your **API Key** (starts with `sk_test_`)
3. Copy your **Client ID** (starts with `client_`)

### Step 5: Update Environment File

```bash
# Edit /Users/alias/Clients/ARAGroup-Platform/apps/app/.env.local
WORKOS_API_KEY="sk_test_YOUR_ACTUAL_KEY_HERE"
WORKOS_CLIENT_ID="client_YOUR_ACTUAL_ID_HERE"
WORKOS_REDIRECT_URI="http://localhost:3000/auth/callback"
NEXT_PUBLIC_WORKOS_CLIENT_ID="client_YOUR_ACTUAL_ID_HERE"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### Step 6: Run Setup Script

```bash
cd /Users/alias/Clients/ARAGroup-Platform
npx tsx scripts/setup-all-ara-organizations.ts
```

This will create all 11 ARA organizations in your WorkOS account.

---

## What the Setup Script Does

Once you have valid credentials, the script will:

1. ✅ **Create 11 Organizations** in WorkOS:
   - ARA Group Platform (main)
   - ARA Fire & Security
   - ARA Electrical
   - ARA Building Services
   - ARA Mechanical Services
   - ARA Property Services
   - ARA Products
   - ARA Manufacturing
   - ARA Marine
   - ARA Security Solutions
   - ARA Indigenous Services

2. ✅ **Configure Domains** for each organization:
   - Demo: `*.ara.aliaslabs.ai`
   - Production: `*.aragroup.com.au`

3. ✅ **Assign Super Admins** to all organizations:
   - Ed Federman (ed.federman@aragroup.com.au)
   - Mark Brady (mark.brady@aliaslabs.ai)
   - Dan Humphreys (dan.humphreys@aliaslabs.ai)

4. ✅ **Set Branding** with verified colors:
   - Primary colors from actual logos
   - Secondary color: #435464 (consistent across all)
   - Logo URLs configured

---

## Current Status

📊 **Implementation Status:**
- ✅ Code infrastructure: 100% complete
- ✅ Multi-tenant routing: Ready
- ✅ Organization branding: Configured
- ✅ Convex schema: Extended
- ⚠️ **WorkOS credentials: REQUIRED**
- ⏸️ Organization creation: Blocked on credentials

🔐 **What's Needed:**
- WorkOS API Key (sk_test_...)
- WorkOS Client ID (client_...)

---

## Verification Steps

After running the setup script:

1. **Check WorkOS Dashboard**
   - Go to: https://dashboard.workos.com/organizations
   - Verify all 11 organizations exist
   - Check domains are configured

2. **Test Local Development**
   ```bash
   pnpm run dev --filter app

   # Access different subdomains:
   # http://ara.aliaslabs.ai:3000
   # http://fire.ara.aliaslabs.ai:3000
   # http://electrical.ara.aliaslabs.ai:3000
   ```

3. **Verify Branding**
   - Check organization switcher shows correct logos
   - Verify colors match brand colors
   - Test organization switching

---

## Troubleshooting

### "Invalid API key" Error
- Double-check the API key starts with `sk_test_` or `sk_live_`
- Ensure no extra spaces or quotes
- Verify the key is from the correct WorkOS environment

### "Organization already exists" Error
- This is OK - the script will skip existing organizations
- Use the WorkOS dashboard to manage existing orgs

### "Network error" or "Connection refused"
- Check your internet connection
- Verify WorkOS API is accessible
- Try again in a few minutes

---

## Quick Command Reference

```bash
# 1. Install tsx globally (already done ✅)
pnpm add -g tsx

# 2. Edit environment file
code /Users/alias/Clients/ARAGroup-Platform/apps/app/.env.local

# 3. Add your credentials
WORKOS_API_KEY="sk_test_YOUR_KEY"
WORKOS_CLIENT_ID="client_YOUR_ID"

# 4. Run setup script
cd /Users/alias/Clients/ARAGroup-Platform
npx tsx scripts/setup-all-ara-organizations.ts

# 5. Start development server
pnpm run dev --filter app
```

---

## Support

- **WorkOS Documentation**: https://workos.com/docs
- **WorkOS Dashboard**: https://dashboard.workos.com
- **API Reference**: https://workos.com/docs/reference
- **Support**: support@workos.com

---

**Status**: ⏸️ Waiting for WorkOS credentials
**Last Updated**: 2025-01-14
