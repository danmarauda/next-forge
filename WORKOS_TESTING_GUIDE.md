# 🧪 WorkOS Complete Testing Guide

This guide covers testing all WorkOS features using browser tools, Convex CLI, and automated scripts.

---

## 📋 Prerequisites

### 1. Environment Variables

Ensure these are set in `apps/app/.env.local`:

```bash
# WorkOS Core
WORKOS_API_KEY=sk_...
WORKOS_CLIENT_ID=client_...
WORKOS_REDIRECT_URI=https://ara.aliaslabs.ai/auth/callback
WORKOS_WEBHOOK_URL=https://api.ara-group.com/api/webhooks/workos
WORKOS_ENVIRONMENT_ID=environment_01K5K3Y79TXRCBAA52TCYZ5CCA

# Convex
CONVEX_DEPLOYMENT=...
NEXT_PUBLIC_CONVEX_URL=...
```

### 2. Start Development Servers

```bash
# Terminal 1: Start Next.js app
pnpm dev

# Terminal 2: Start Convex dev server
pnpm convex:dev
```

---

## 🧪 Testing Methods

### Method 1: Automated Test Script

Run the complete test suite:

```bash
pnpm run test:workos:complete
```

This tests:
- ✅ API Connection
- ✅ Organizations
- ✅ Users
- ✅ Authentication Methods
- ✅ SSO
- ✅ Directory Sync
- ✅ Audit Logs
- ✅ Admin Portal
- ✅ Webhook Endpoint

### Method 2: Browser Testing

#### Test Authentication Flow

1. **Navigate to Sign-In Page:**
   ```
   http://localhost:3000/sign-in
   ```

2. **Test Email/Password:**
   - Enter email and password
   - Verify redirect to callback
   - Check session cookie is set

3. **Test Magic Auth:**
   - Click "Sign in with Magic Link"
   - Enter email
   - Check email for code
   - Enter code
   - Verify authentication

4. **Test Passkeys:**
   - Click "Sign in with Passkey"
   - Use device biometric/password
   - Verify authentication

#### Test SSO Flow

1. **Get SSO Authorization URL:**
   ```typescript
   // In browser console or API route
   const response = await fetch('/api/auth/sso', {
     method: 'POST',
     body: JSON.stringify({ organizationId: 'org_...' }),
   });
   const { authorizationUrl } = await response.json();
   ```

2. **Redirect to SSO URL:**
   - User authenticates with IdP
   - Callback receives code
   - Exchange code for session

### Method 3: Convex CLI Testing

#### Test WorkOS Actions

```bash
# Test authorization URL generation
npx convex run workosAuth:getAuthorizationUrl --args '{"redirectUri": "https://ara.aliaslabs.ai/auth/callback"}'

# Test user authentication (requires code from OAuth flow)
npx convex run workosAuth:authenticateUser --args '{"code": "code_from_workos"}'

# Test webhook handling
npx convex run workosAuth:handleWebhook --args '{"event": "user.created", "data": {...}}'
```

#### Test Webhook Endpoint

1. **Start local webhook server:**
   ```bash
   # Use ngrok or similar to expose localhost
   ngrok http 3000
   ```

2. **Update webhook URL in WorkOS dashboard:**
   ```
   https://your-ngrok-url.ngrok.io/api/webhooks/workos
   ```

3. **Send test event from WorkOS dashboard:**
   - Go to Webhooks → Test Event
   - Select event type (e.g., `user.created`)
   - Send test event
   - Verify Convex receives and processes it

#### Test Convex Functions Directly

```bash
# List all WorkOS-related functions
npx convex run --help | grep workos

# Test session queries
npx convex run workosAuth:getSessionsByUserId --args '{"userId": "user_..."}'

# Test user queries
npx convex run user:getUserByEmail --args '{"email": "test@example.com"}'
```

---

## 🔍 Feature-Specific Testing

### 1. Authentication Methods

#### Email/Password
```bash
# Test via browser
1. Navigate to /sign-in
2. Enter email/password
3. Verify redirect and session
```

#### Magic Auth
```bash
# Test via browser
1. Navigate to /sign-in
2. Click "Sign in with Magic Link"
3. Enter email
4. Check email for code
5. Enter code
6. Verify authentication
```

#### Passkeys
```bash
# Test via browser
1. Navigate to /sign-in
2. Click "Sign in with Passkey"
3. Use device authentication
4. Verify authentication
```

### 2. SSO

#### Test SSO Connection

1. **Configure SSO Provider in Dashboard:**
   - Go to: https://dashboard.workos.com/environment_01K5K3Y79TXRCBAA52TCYZ5CCA/organizations/{org_id}/sso
   - Add SAML/OIDC connection
   - Configure attributes

2. **Test SSO Flow:**
   ```typescript
   // Get SSO URL
   const ssoUrl = await workos.sso.getAuthorizationUrl({
     organizationId: 'org_...',
     redirectUri: 'https://ara.aliaslabs.ai/auth/callback',
   });
   
   // Redirect user to ssoUrl
   // User authenticates with IdP
   // Callback receives code
   // Exchange code for session
   ```

### 3. Directory Sync

#### Test Directory Sync

1. **Configure Directory in Dashboard:**
   - Go to: https://dashboard.workos.com/environment_01K5K3Y79TXRCBAA52TCYZ5CCA/organizations/{org_id}/directory-sync
   - Add directory connection (Entra ID, Google Workspace, etc.)
   - Configure sync settings

2. **Test Sync:**
   ```bash
   # List directories
   npx convex run workosAuth:listDirectories --args '{"organizationId": "org_..."}'
   
   # List directory users
   npx convex run workosAuth:listDirectoryUsers --args '{"directoryId": "dir_..."}'
   ```

### 4. Webhooks

#### Test Webhook Handler

1. **Verify Webhook Endpoint:**
   ```bash
   # Test GET request (should return 405)
   curl http://localhost:3000/api/webhooks/workos
   
   # Test POST with sample event
   curl -X POST http://localhost:3000/api/webhooks/workos \
     -H "Content-Type: application/json" \
     -H "workos-signature: test" \
     -d '{
       "event": "user.created",
       "data": {
         "id": "user_123",
         "email": "test@example.com",
         "firstName": "Test",
         "lastName": "User"
       }
     }'
   ```

2. **Test from WorkOS Dashboard:**
   - Go to: https://dashboard.workos.com/environment_01K5K3Y79TXRCBAA52TCYZ5CCA/webhooks
   - Click "Send Test Event"
   - Select event type
   - Verify Convex receives event

3. **Verify Convex Processing:**
   ```bash
   # Check Convex logs
   npx convex logs
   
   # Or check Convex dashboard
   # https://dashboard.convex.dev
   ```

### 5. Audit Logs

#### Test Audit Log Creation

```typescript
// Create audit log event
await workos.auditLogs.createEvent({
  action: 'user.login',
  actor: {
    type: 'user',
    id: 'user_...',
  },
  context: {
    location: 'San Francisco, CA',
    userAgent: 'Mozilla/5.0...',
  },
  metadata: {
    ipAddress: '192.168.1.1',
  },
});
```

#### View Audit Logs

1. **In Dashboard:**
   - Go to: https://dashboard.workos.com/environment_01K5K3Y79TXRCBAA52TCYZ5CCA/audit-logs
   - View events

2. **Via API:**
   ```bash
   npx convex run workosAuth:listAuditLogs --args '{"organizationId": "org_..."}'
   ```

### 6. Admin Portal

#### Test Admin Portal Link Generation

```typescript
// Generate admin portal link
const link = await workos.adminPortal.generateLink({
  organizationId: 'org_...',
  intent: 'user_management',
  returnUrl: 'https://ara.aliaslabs.ai/admin',
});

// Redirect user to link
// User manages organization/users in WorkOS portal
// User returns to returnUrl
```

---

## 🔧 Debugging

### Check WorkOS Dashboard

- **Applications:** https://dashboard.workos.com/environment_01K5K3Y79TXRCBAA52TCYZ5CCA/applications
- **Users:** https://dashboard.workos.com/environment_01K5K3Y79TXRCBAA52TCYZ5CCA/users
- **Organizations:** https://dashboard.workos.com/environment_01K5K3Y79TXRCBAA52TCYZ5CCA/organizations
- **Webhooks:** https://dashboard.workos.com/environment_01K5K3Y79TXRCBAA52TCYZ5CCA/webhooks
- **Events:** https://dashboard.workos.com/environment_01K5K3Y79TXRCBAA52TCYZ5CCA/events

### Check Convex Dashboard

- **Functions:** https://dashboard.convex.dev
- **Logs:** `npx convex logs`
- **Data:** View tables in Convex dashboard

### Common Issues

1. **"Redirect URI mismatch"**
   - Verify redirect URI matches exactly in dashboard
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

4. **"Convex function not found"**
   - Verify function is deployed: `npx convex deploy`
   - Check function name matches
   - Verify function is exported correctly

---

## ✅ Testing Checklist

- [ ] API Connection test passes
- [ ] Organizations can be listed/created
- [ ] Users can be listed/created
- [ ] Email/Password authentication works
- [ ] Magic Auth authentication works
- [ ] Passkeys authentication works
- [ ] SSO flow works (if configured)
- [ ] Directory Sync works (if configured)
- [ ] Webhook endpoint receives events
- [ ] Convex processes webhook events
- [ ] Audit logs can be created/viewed
- [ ] Admin Portal links can be generated
- [ ] All features work in production environment

---

## 🎯 Next Steps

1. Run complete test suite: `pnpm run test:workos:complete`
2. Test authentication flows in browser
3. Test webhook endpoints with Convex
4. Configure additional features as needed
5. Monitor logs and events
6. Set up production testing environment

---

**Last Updated:** $(date)
**Platform:** ARA Group Platform

