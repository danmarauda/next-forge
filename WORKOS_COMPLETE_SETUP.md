# 🚀 WorkOS Complete Setup Guide for ARA Group Platform

This guide covers the complete setup of **ALL** WorkOS features for the ARA Group Platform.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Core Setup](#core-setup)
3. [Authentication Methods](#authentication-methods)
4. [SSO (Single Sign-On)](#sso-single-sign-on)
5. [Directory Sync](#directory-sync)
6. [Organizations & Users](#organizations--users)
7. [Audit Logs](#audit-logs)
8. [Admin Portal](#admin-portal)
9. [Fine-Grained Authorization (FGA)](#fine-grained-authorization-fga)
10. [Roles & Permissions](#roles--permissions)
11. [Webhooks](#webhooks)
12. [Branding](#branding)
13. [Domains](#domains)
14. [Feature Flags](#feature-flags)
15. [Radar](#radar)
16. [IdP Attributes](#idp-attributes)
17. [OAuth Providers](#oauth-providers)
18. [Testing](#testing)
19. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### 1. Environment Variables

Ensure these are set in `apps/app/.env.local`:

```bash
# WorkOS Core
WORKOS_API_KEY=sk_...
WORKOS_CLIENT_ID=client_...
WORKOS_REDIRECT_URI=https://ara.aliaslabs.ai/auth/callback
WORKOS_WEBHOOK_URL=https://api.ara-group.com/api/webhooks/workos
WORKOS_ENVIRONMENT_ID=environment_01K5K3Y79TXRCBAA52TCYZ5CCA

# WorkOS Feature Flags (optional)
NEXT_PUBLIC_WORKOS_AUTH_ENABLED=true
NEXT_PUBLIC_WORKOS_SSO_ENABLED=true
NEXT_PUBLIC_WORKOS_DIRECTORY_SYNC_ENABLED=true
NEXT_PUBLIC_WORKOS_AUDIT_LOGS_ENABLED=true
NEXT_PUBLIC_WORKOS_ADMIN_PORTAL_ENABLED=true
NEXT_PUBLIC_WORKOS_FGA_ENABLED=true
```

### 2. Run Setup Script

```bash
pnpm run setup:workos:complete
```

Or directly:

```bash
tsx scripts/setup-workos-complete.ts
```

---

## Core Setup

### Application Configuration

✅ **Already Configured:**
- Application Name: `ARA Group Platform`
- Redirect URI: `https://ara.aliaslabs.ai/auth/callback`
- Webhook URL: `https://api.ara-group.com/api/webhooks/workos`
- Environment: Production

**Dashboard:** https://dashboard.workos.com/environment_01K5K3Y79TXRCBAA52TCYZ5CCA/applications

---

## Authentication Methods

### 1. Email + Password ✅ Enabled

**Status:** Enabled by default

**Configuration:**
- Min. password length: 10 characters
- Min. password complexity: Safely unguessable (3/4)
- Password rules: None
- Compromised passwords: Don't reject breached passwords
- Password history: Don't reject previously used passwords

**Dashboard:** https://dashboard.workos.com/environment_01K5K3Y79TXRCBAA52TCYZ5CCA/authentication

### 2. Passkeys ✅ Enabled

**Status:** Enabled by default

**Features:**
- WebAuthn/FIDO2 support
- Biometric authentication
- Cross-device support

**Dashboard:** https://dashboard.workos.com/environment_01K5K3Y79TXRCBAA52TCYZ5CCA/authentication

### 3. Magic Auth ⚠️ Needs Enablement

**Status:** Requires dashboard enablement

**Steps:**
1. Go to Authentication → Magic Auth
2. Click "Enable"
3. Configure email template (optional)

**Dashboard:** https://dashboard.workos.com/environment_01K5K3Y79TXRCBAA52TCYZ5CCA/authentication

---

## SSO (Single Sign-On)

### Setup Status

✅ **Organization Ready:** ARA Group Platform organization is configured

### Supported Providers

- **SAML 2.0:** Entra ID, Okta, Google Workspace, OneLogin, etc.
- **OIDC:** Generic OIDC providers
- **OAuth:** Google, Microsoft, etc.

### Configuration Steps

1. **Go to Organization SSO Settings:**
   ```
   https://dashboard.workos.com/environment_01K5K3Y79TXRCBAA52TCYZ5CCA/organizations/{org_id}/sso
   ```

2. **Add SSO Connection:**
   - Choose provider type (SAML, OIDC, OAuth)
   - Enter provider details
   - Configure attribute mappings
   - Test connection

3. **Configure Redirect URI:**
   - Ensure `https://ara.aliaslabs.ai/auth/callback` is configured

### Programmatic Usage

```typescript
import { WorkOSService } from "@repo/workos-service";

const workos = new WorkOSService();

// Get SSO authorization URL
const authUrl = await workos.sso.getAuthorizationUrl({
  organizationId: "org_...",
  redirectUri: "https://ara.aliaslabs.ai/auth/callback",
  state: "optional-state",
});

// Authenticate with code
const { user, accessToken } = await workos.sso.authenticateWithCode(code);
```

**Dashboard:** https://dashboard.workos.com/environment_01K5K3Y79TXRCBAA52TCYZ5CCA/organizations/{org_id}/sso

---

## Directory Sync

### Setup Status

✅ **Ready:** Directory Sync is ready for configuration

### Supported Providers

- **Microsoft Entra ID (Azure AD)**
- **Google Workspace**
- **Okta**
- **OneLogin**
- **Generic SCIM 2.0**

### Configuration Steps

1. **Go to Directory Sync:**
   ```
   https://dashboard.workos.com/environment_01K5K3Y79TXRCBAA52TCYZ5CCA/organizations/{org_id}/directory-sync
   ```

2. **Add Directory Connection:**
   - Choose provider
   - Enter credentials
   - Configure sync settings
   - Test connection

3. **Configure Sync Rules:**
   - User sync rules
   - Group sync rules
   - Attribute mappings

### Programmatic Usage

```typescript
import { WorkOSService } from "@repo/workos-service";

const workos = new WorkOSService();

// List directories
const directories = await workos.directorySync.listDirectories({
  organizationId: "org_...",
});

// List directory users
const users = await workos.directorySync.listUsers(directoryId, {
  limit: 100,
});

// List directory groups
const groups = await workos.directorySync.listGroups(directoryId, {
  limit: 100,
});
```

**Dashboard:** https://dashboard.workos.com/environment_01K5K3Y79TXRCBAA52TCYZ5CCA/organizations/{org_id}/directory-sync

---

## Organizations & Users

### Current Setup

✅ **Organization:** ARA Group Platform (`org_...`)
✅ **Admin User:** Created and added to organization

### Programmatic Usage

```typescript
import { WorkOSService } from "@repo/workos-service";

const workos = new WorkOSService();

// Create organization
const org = await workos.sso.createOrganization({
  name: "New Organization",
  domains: [{ domain: "example.com" }],
});

// Create user
const user = await workos.userManagement.createUser({
  email: "user@example.com",
  emailVerified: true,
});

// Add user to organization
await workos.sso.updateOrganization(org.id, {
  // Add membership via API
});
```

**Dashboard:**
- Organizations: https://dashboard.workos.com/environment_01K5K3Y79TXRCBAA52TCYZ5CCA/organizations
- Users: https://dashboard.workos.com/environment_01K5K3Y79TXRCBAA52TCYZ5CCA/users

---

## Audit Logs

### Setup Status

✅ **Enabled:** Audit Logs are automatically enabled with WorkOS

### Features

- Automatic event logging
- User actions
- API key actions
- Organization changes
- Security events

### Programmatic Usage

```typescript
import { WorkOSService } from "@repo/workos-service";

const workos = new WorkOSService();

// Create audit log event
await workos.auditLogs.createEvent({
  action: "user.login",
  actor: {
    type: "user",
    id: "user_...",
  },
  context: {
    location: "San Francisco, CA",
    userAgent: "Mozilla/5.0...",
  },
  metadata: {
    ipAddress: "192.168.1.1",
  },
});

// List audit log events
const events = await workos.auditLogs.listEvents({
  organizationId: "org_...",
  limit: 100,
});
```

**Dashboard:** https://dashboard.workos.com/environment_01K5K3Y79TXRCBAA52TCYZ5CCA/audit-logs

---

## Admin Portal

### Setup Status

✅ **Ready:** Admin Portal is ready for use

### Features

- Self-service user management
- Organization management
- SSO configuration

### Programmatic Usage

```typescript
import { WorkOSService } from "@repo/workos-service";

const workos = new WorkOSService();

// Generate admin portal link
const link = await workos.adminPortal.generateLink({
  organizationId: "org_...",
  intent: "user_management",
  returnUrl: "https://ara.aliaslabs.ai/admin",
});
```

**Dashboard:** https://dashboard.workos.com/environment_01K5K3Y79TXRCBAA52TCYZ5CCA/organizations/{org_id}/admin-portal

---

## Fine-Grained Authorization (FGA)

### Setup Status

✅ **Ready:** FGA is ready for configuration

### Features

- Role-based access control (RBAC)
- Attribute-based access control (ABAC)
- Policy-based authorization

### Configuration Steps

1. **Go to FGA Settings:**
   ```
   https://dashboard.workos.com/environment_01K5K3Y79TXRCBAA52TCYZ5CCA/organizations/{org_id}/fga
   ```

2. **Configure Authorization Policies:**
   - Define resources
   - Define actions
   - Create policies
   - Test policies

**Dashboard:** https://dashboard.workos.com/environment_01K5K3Y79TXRCBAA52TCYZ5CCA/organizations/{org_id}/fga

---

## Roles & Permissions

### Setup Status

✅ **Ready:** Roles & Permissions are ready for configuration

### Configuration Steps

1. **Go to Roles & Permissions:**
   ```
   https://dashboard.workos.com/environment_01K5K3Y79TXRCBAA52TCYZ5CCA/roles-and-permissions
   ```

2. **Create Roles:**
   - Define role names
   - Assign permissions
   - Assign to users/organizations

**Dashboard:** https://dashboard.workos.com/environment_01K5K3Y79TXRCBAA52TCYZ5CCA/roles-and-permissions

---

## Webhooks

### Current Configuration

✅ **Webhook URL:** `https://api.ara-group.com/api/webhooks/workos`
✅ **Events:** All 59 events configured

### Supported Events

**User Events:**
- `user.created`
- `user.updated`
- `user.deleted`

**Organization Events:**
- `organization.created`
- `organization.updated`
- `organization.deleted`

**Directory Sync Events:**
- `dsync.user.created`
- `dsync.user.updated`
- `dsync.user.deleted`
- `dsync.group.created`
- `dsync.group.updated`
- `dsync.group.deleted`
- `dsync.group.user_added`
- `dsync.group.user_removed`

**And 47 more events...**

### Webhook Handler

The webhook handler is already implemented at:
```
apps/app/app/api/webhooks/workos/route.ts
```

**Dashboard:** https://dashboard.workos.com/environment_01K5K3Y79TXRCBAA52TCYZ5CCA/webhooks

---

## Branding

### Setup Status

✅ **Ready:** Branding is ready for configuration

### Configuration Steps

1. **Go to Branding:**
   ```
   https://dashboard.workos.com/branding
   ```

2. **Configure:**
   - Upload logo
   - Set primary color
   - Set secondary color
   - Configure email templates
   - Set custom CSS (if needed)

**Dashboard:** https://dashboard.workos.com/branding

---

## Domains

### Current Domain

✅ **Domain:** `ara-group.com` (configured in organization)

### Configuration Steps

1. **Go to Domains:**
   ```
   https://dashboard.workos.com/domains
   ```

2. **Add Domain:**
   - Enter domain name
   - Verify domain ownership
   - Configure DNS records

**Dashboard:** https://dashboard.workos.com/domains

---

## Feature Flags

### Setup Status

✅ **Ready:** Feature Flags are ready for configuration

### Configuration Steps

1. **Go to Feature Flags:**
   ```
   https://dashboard.workos.com/environment_01K5K3Y79TXRCBAA52TCYZ5CCA/flags
   ```

2. **Create Flags:**
   - Define flag keys
   - Set default values
   - Configure rollout percentages
   - Assign to organizations/users

**Dashboard:** https://dashboard.workos.com/environment_01K5K3Y79TXRCBAA52TCYZ5CCA/flags

---

## Radar

### Setup Status

✅ **Ready:** Radar is ready for configuration

### Features

- Fraud detection
- Risk scoring
- Device fingerprinting
- IP reputation
- Behavioral analysis

### Configuration Steps

1. **Go to Radar:**
   ```
   https://dashboard.workos.com/environment_01K5K3Y79TXRCBAA52TCYZ5CCA/radar
   ```

2. **Configure Security Policies:**
   - Set risk thresholds
   - Configure blocking rules
   - Set up alerts

**Dashboard:** https://dashboard.workos.com/environment_01K5K3Y79TXRCBAA52TCYZ5CCA/radar

---

## IdP Attributes

### Setup Status

✅ **Ready:** IdP Attributes are ready for configuration

### Configuration Steps

1. **Go to IdP Attributes:**
   ```
   https://dashboard.workos.com/environment_01K5K3Y79TXRCBAA52TCYZ5CCA/identity-provider-attributes
   ```

2. **Configure Attribute Mappings:**
   - Map IdP attributes to WorkOS user attributes
   - Configure default values
   - Set up transformations

**Dashboard:** https://dashboard.workos.com/environment_01K5K3Y79TXRCBAA52TCYZ5CCA/identity-provider-attributes

---

## OAuth Providers

### Setup Status

✅ **Ready:** OAuth Providers are ready for configuration

### Supported Providers

- **Google**
- **Microsoft**
- **GitHub**
- **GitLab**
- **Generic OAuth 2.0**

### Configuration Steps

1. **Go to OAuth Providers:**
   ```
   https://dashboard.workos.com/environment_01K5K3Y79TXRCBAA52TCYZ5CCA/authentication/oauth-providers
   ```

2. **Add Provider:**
   - Choose provider
   - Enter client ID and secret
   - Configure scopes
   - Test connection

**Dashboard:** https://dashboard.workos.com/environment_01K5K3Y79TXRCBAA52TCYZ5CCA/authentication/oauth-providers

---

## Testing

### 1. Test Authentication Flow

```bash
# Start development server
pnpm dev

# Navigate to sign-in page
open http://localhost:3000/sign-in

# Test email/password authentication
# Test magic auth (if enabled)
# Test passkeys (if enabled)
```

### 2. Test SSO Flow

```bash
# Use SSO authorization URL
const authUrl = await workos.sso.getAuthorizationUrl({
  organizationId: "org_...",
  redirectUri: "https://ara.aliaslabs.ai/auth/callback",
});

# Redirect user to authUrl
# User authenticates with IdP
# Callback receives code
# Exchange code for session
```

### 3. Test Webhooks

```bash
# Use WorkOS webhook testing tool
# Or send test events from dashboard
```

### 4. Test Admin Portal

```bash
# Generate admin portal link
const link = await workos.adminPortal.generateLink({
  organizationId: "org_...",
  intent: "user_management",
});

# Redirect user to link
# User manages organization/users
```

---

## Troubleshooting

### Common Issues

1. **"Redirect URI mismatch"**
   - Ensure redirect URI matches exactly in dashboard
   - Check for trailing slashes
   - Verify protocol (http vs https)

2. **"Webhook signature invalid"**
   - Verify webhook secret is correct
   - Check signature verification logic
   - Ensure request body is raw JSON

3. **"Organization not found"**
   - Verify organization ID
   - Check organization exists in dashboard
   - Ensure API key has correct permissions

4. **"SSO connection failed"**
   - Verify IdP configuration
   - Check attribute mappings
   - Test connection in dashboard first

### Support Resources

- **WorkOS Docs:** https://workos.com/docs
- **WorkOS Dashboard:** https://dashboard.workos.com
- **WorkOS Support:** support@workos.com

---

## ✅ Setup Checklist

- [x] Application created
- [x] Redirect URI configured
- [x] Webhook configured with all events
- [x] Organization created
- [x] Admin user created
- [ ] Magic Auth enabled
- [ ] SSO providers configured
- [ ] Directory Sync connections configured
- [ ] OAuth providers configured
- [ ] Branding configured
- [ ] Domains verified
- [ ] Roles & Permissions configured
- [ ] Feature Flags configured
- [ ] Radar policies configured
- [ ] IdP Attributes mapped
- [ ] Authentication flow tested
- [ ] Webhook endpoints tested
- [ ] Admin Portal tested

---

## 🎯 Next Steps

1. Enable Magic Auth in dashboard
2. Configure SSO providers for your organization
3. Set up Directory Sync connections (if needed)
4. Configure OAuth providers (Google, Microsoft, etc.)
5. Set up Branding (logo, colors, styling)
6. Configure Domains and DNS records
7. Set up Roles & Permissions
8. Configure Feature Flags
9. Set up Radar security policies
10. Configure IdP Attributes mappings
11. Test all authentication flows
12. Test webhook endpoints
13. Monitor Audit Logs
14. Set up alerts and notifications

---

**Last Updated:** $(date)
**Platform:** ARA Group Platform
**Environment:** Production

