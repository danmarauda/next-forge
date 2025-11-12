# 🌐 WorkOS Browser Setup Guide
## Step-by-Step Browser Automation Setup

This guide walks through setting up WorkOS features using browser automation.

---

## 📋 Prerequisites

✅ Logged into WorkOS Dashboard  
✅ Production environment selected  
✅ Browser tools available

---

## 🎯 Setup Steps

### Step 1: Get API Key
1. Navigate to: `https://dashboard.workos.com/environment_01K5K3Y79TXRCBAA52TCYZ5CCA/api-keys`
2. Find an active API key
3. Click to reveal the secret key
4. Copy the key (starts with `sk_`)

### Step 2: Create Application
1. Navigate to: `https://dashboard.workos.com/environment_01K5K3Y79TXRCBAA52TCYZ5CCA/applications`
2. Click "Create application"
3. Fill in:
   - **Name:** Next Forge App
   - **Type:** AuthKit
   - **Redirect URI:** `http://localhost:3000/auth/callback`
4. Click "Create"

### Step 3: Create Webhook
1. Navigate to: `https://dashboard.workos.com/environment_01K5K3Y79TXRCBAA52TCYZ5CCA/webhooks`
2. Click "Create webhook"
3. Fill in:
   - **Endpoint:** `http://localhost:3002/api/webhooks/workos`
   - **Events:** Select all user and organization events
4. Click "Create"

### Step 4: Verify Organization
1. Navigate to: `https://dashboard.workos.com/environment_01K5K3Y79TXRCBAA52TCYZ5CCA/organizations`
2. Check if "ARA Property Services" exists
3. If not, click "Create organization"

### Step 5: Configure Environment Variables
Add to `apps/app/.env.local`:
```bash
WORKOS_API_KEY=sk_... # From Step 1
WORKOS_CLIENT_ID=client_01K5K3Y7R2NGZG5FN9HRHK5705
WORKOS_REDIRECT_URI=http://localhost:3000/auth/callback
NEXT_PUBLIC_WORKOS_CLIENT_ID=client_01K5K3Y7R2NGZG5FN9HRHK5705
```

---

## ✅ Verification

After setup, verify:
- [ ] Application created
- [ ] Webhook created and active
- [ ] Environment variables set
- [ ] Can run `pnpm setup:workos` successfully

---

**Ready to proceed with browser automation!**

