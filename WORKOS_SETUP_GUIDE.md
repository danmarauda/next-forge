# 🔧 WorkOS Setup Guide
## Programmatic Setup and Testing

This guide will help you set up WorkOS programmatically using the provided scripts.

---

## 📋 Prerequisites

1. **WorkOS Account**
   - Sign up at [workos.com](https://workos.com)
   - Get your API key from [Dashboard → API Keys](https://dashboard.workos.com/api-keys)

2. **Environment Variables**
   - Ensure `.env.local` files are configured (see `QUICK_START.md`)

---

## 🚀 Quick Setup

### Step 1: Get WorkOS Credentials

1. Log into [WorkOS Dashboard](https://dashboard.workos.com)
2. Navigate to **API Keys** section
3. Copy your **API Key** (starts with `sk_`)
4. Copy your **Client ID** (starts with `client_`)

### Step 2: Configure Environment

Add to `apps/app/.env.local`:

```bash
WORKOS_API_KEY=sk_your_api_key_here
WORKOS_CLIENT_ID=client_your_client_id_here
WORKOS_REDIRECT_URI=http://localhost:3000/auth/callback
NEXT_PUBLIC_WORKOS_CLIENT_ID=client_your_client_id_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Step 3: Run Setup Script

```bash
pnpm setup:workos
```

This will:
- ✅ Verify API connection
- ✅ Create organization (if needed)
- ✅ Create admin user (if needed)
- ✅ Set up SSO (if enabled)
- ✅ Set up Directory Sync (if enabled)
- ✅ Configure webhooks
- ✅ Enable Audit Logs (if enabled)

### Step 4: Test Integration

```bash
pnpm test:workos
```

This will:
- ✅ Test API connection
- ✅ List organizations
- ✅ List users
- ✅ Generate authorization URL

---

## 🔧 Manual Dashboard Setup

While the script handles basic setup, some features need manual configuration in the WorkOS Dashboard:

### SSO Configuration

1. Go to [WorkOS Dashboard → SSO](https://dashboard.workos.com/sso)
2. Click **Create Connection**
3. Choose your Identity Provider:
   - **Google OAuth** - For Google Workspace
   - **Microsoft OAuth** - For Azure AD / Microsoft 365
   - **SAML** - For generic SAML providers
   - **OIDC** - For generic OIDC providers
4. Configure redirect URI: `http://localhost:3000/auth/callback`
5. Save the connection

### Directory Sync Configuration

1. Go to [WorkOS Dashboard → Directory Sync](https://dashboard.workos.com/directory-sync)
2. Click **Create Directory**
3. Choose your directory provider:
   - **Azure AD** - Azure Active Directory
   - **Google Workspace** - Google Workspace
   - **Okta** - Okta
   - **Generic SCIM** - Any SCIM 2.0 provider
4. Follow the setup wizard
5. Configure webhook endpoint: `http://localhost:3002/api/webhooks/workos/directory-sync`

### Webhook Configuration

1. Go to [WorkOS Dashboard → Webhooks](https://dashboard.workos.com/webhooks)
2. Click **Create Webhook**
3. Set webhook URL: `http://localhost:3002/api/webhooks/workos`
4. Select events:
   - ✅ `user.created`
   - ✅ `user.updated`
   - ✅ `user.deleted`
   - ✅ `organization.created`
   - ✅ `organization.updated`
   - ✅ `organization.deleted`
   - ✅ `dsync.user.created`
   - ✅ `dsync.user.updated`
   - ✅ `dsync.user.deleted`
   - ✅ `dsync.group.created`
   - ✅ `dsync.group.updated`
   - ✅ `dsync.group.deleted`
5. Save webhook

### Admin Portal

1. Go to [WorkOS Dashboard → Admin Portal](https://dashboard.workos.com/admin-portal)
2. Configure portal settings
3. Set allowed redirect URIs
4. Enable features as needed

---

## 🧪 Testing Features

### Test Authentication Flow

1. Start your development server:
   ```bash
   pnpm dev
   ```

2. Navigate to your app's login page

3. Test Magic Code authentication:
   - Enter your email
   - Check email for magic code
   - Enter code to authenticate

4. Test SSO (if configured):
   - Click "Sign in with SSO"
   - Select your organization
   - Complete SSO flow

### Test Directory Sync

1. Ensure Directory Sync is configured in dashboard

2. Test webhook endpoint:
   ```bash
   curl -X POST http://localhost:3002/api/webhooks/workos/directory-sync \
     -H "Content-Type: application/json" \
     -d '{
       "event": "dsync.user.created",
       "data": {
         "id": "user_123",
         "email": "test@example.com"
       }
     }'
   ```

### Test Audit Logs

Audit logs are automatically enabled with WorkOS. View them in:
- [WorkOS Dashboard → Audit Logs](https://dashboard.workos.com/audit-logs)

---

## 🔍 Troubleshooting

### API Connection Failed

```bash
# Check API key
echo $WORKOS_API_KEY | cut -c1-8

# Test connection
pnpm test:workos
```

### Organization Not Found

```bash
# Run setup again
pnpm setup:workos
```

### Webhook Not Receiving Events

1. Check webhook URL is correct
2. Ensure webhook is enabled in dashboard
3. Test webhook endpoint manually
4. Check server logs for errors

### SSO Not Working

1. Verify SSO connection is created in dashboard
2. Check redirect URI matches exactly
3. Ensure organization is linked to SSO connection
4. Check browser console for errors

---

## 📚 Additional Resources

- [WorkOS Documentation](https://workos.com/docs)
- [WorkOS API Reference](https://workos.com/docs/reference)
- [WorkOS Dashboard](https://dashboard.workos.com)
- [WorkOS Support](https://workos.com/support)

---

## ✅ Checklist

- [ ] WorkOS account created
- [ ] API key obtained
- [ ] Client ID obtained
- [ ] Environment variables configured
- [ ] Setup script run successfully
- [ ] Test script passed
- [ ] SSO configured (if needed)
- [ ] Directory Sync configured (if needed)
- [ ] Webhooks configured
- [ ] Authentication flow tested
- [ ] All features working

---

**Last Updated:** 2025-01-27

