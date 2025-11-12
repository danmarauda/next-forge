# 🏢 ARA Group Platform - WorkOS Setup
**Platform Name:** ARA Group Platform  
**Date:** 2025-01-27  
**Environment:** Production

---

## 📋 Platform Configuration

### Application Details
- **Name:** ARA Group Platform ✅
- **Description:** ARA Group Platform - Enterprise authentication and user management ✅
- **Type:** OAuth Application (AuthKit)
- **Management:** Managed by you
- **Application ID:** `app_01K9VYFTZQZZHHT2PNJGPGBWTY`
- **Client ID:** `client_01K9VYFTZQWHNWZAS9XV3TAZ02` (Application-specific)
- **Environment Client ID:** `client_01K5K3Y7R2NGZG5FN9HRHK5705`

### Environment
- **Environment ID:** `env_01K5K3Y79TXRCBAA52TCYZ5CCA`
- **Environment:** Production

---

## 🔧 Configuration Requirements

### 1. Application Setup
- ✅ Application created successfully
- ✅ Name: "ARA Group Platform"
- ✅ Description: "ARA Group Platform - Enterprise authentication and user management"
- ✅ Application ID: `app_01K9VYFTZQZZHHT2PNJGPGBWTY`
- ✅ Client ID: `client_01K9VYFTZQWHNWZAS9XV3TAZ02`
- ✅ Redirect URI: `https://ara.aliaslabs.ai/auth/callback` (production - default)

### 2. Webhook Configuration
- ✅ **Endpoint:** `https://ara.aliaslabs.ai/api/webhooks/workos` (production)
- ✅ **Status:** Enabled
- ✅ **Events:** 59 events (all WorkOS events)
- ✅ **Webhook ID:** `we_01K9VYNW2JM84B6CBZFAGBC4TD`
- ✅ **Signing Secret:** `qnBHYx1kStf8LWTNJ1aGaXaVr`

### 3. Organization Setup
- **Existing Organization:** ARA Property Services
- **Organization ID:** `org_01K6W09SDNDYB728PEB37T2Q1S`
- **Action:** Verify/configure for ARA Group Platform

### 4. User Management
- **Existing User:** `test@ara-property.com`
- **Status:** Inactive
- **Action:** Activate and configure for platform access

---

## 🔑 Environment Variables

### Required for `apps/app/.env.local`
```bash
# WorkOS Configuration
WORKOS_API_KEY=sk_... # Get from API Keys page
WORKOS_CLIENT_ID=client_01K5K3Y7R2NGZG5FN9HRHK5705
WORKOS_REDIRECT_URI=http://localhost:3000/auth/callback

# Public Client ID
NEXT_PUBLIC_WORKOS_CLIENT_ID=client_01K5K3Y7R2NGZG5FN9HRHK5705

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Production Environment Variables
```bash
WORKOS_REDIRECT_URI=https://ara.aliaslabs.ai/auth/callback
NEXT_PUBLIC_SITE_URL=https://ara.aliaslabs.ai
WORKOS_WEBHOOK_URL=https://ara.aliaslabs.ai/api/webhooks/workos
WORKOS_WEBHOOK_SECRET=qnBHYx1kStf8LWTNJ1aGaXaVr
```

---

## 🚀 Setup Steps

### Step 1: Complete Application Creation
1. Wait for current application creation to complete
2. Update application name to "ARA Group Platform"
3. Configure redirect URIs

### Step 2: Set Up Webhook
1. Navigate to Webhooks page
2. Create webhook with production endpoint
3. Select all required events
4. Test webhook delivery

### Step 3: Configure Organization
1. Verify "ARA Property Services" organization
2. Set up SSO (if needed)
3. Configure Directory Sync (if needed)

### Step 4: Environment Variables
1. Copy API key from dashboard
2. Add to `.env.local` files
3. Update production environment variables

---

## 📊 Current Status

### ✅ Completed
- [x] Logged into WorkOS Dashboard
- [x] Application created: "ARA Group Platform"
- [x] Application name and description configured
- [x] Redirect URI configured: `https://ara.aliaslabs.ai/auth/callback`
- [x] Webhook created and configured
- [x] Webhook endpoint: `https://ara.aliaslabs.ai/api/webhooks/workos`
- [x] All 59 WorkOS events selected for webhook
- [x] Webhook signing secret obtained

### 📋 Pending
- [ ] Environment variables configuration (API key, client ID)
- [ ] Organization verification
- [ ] User activation
- [ ] Test authentication flow

---

## 🎯 Platform Features

### Authentication (AuthKit)
- User sign-up and sign-in
- Magic link authentication
- OAuth providers (Google, Microsoft)
- Session management

### Organizations
- Multi-tenant support
- Organization management
- User-organization relationships

### SSO (Future)
- Single Sign-On configuration
- Identity provider integration

### Directory Sync (Future)
- Directory synchronization
- User provisioning

### Audit Logs (Future)
- Event tracking
- Compliance logging

---

**Platform:** ARA Group Platform  
**Domain:** `ara.aliaslabs.ai`  
**Status:** ✅ Core setup complete  
**Next Action:** Configure environment variables and test authentication flow

