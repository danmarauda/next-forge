# ⚡ WorkOS Quick Setup
## Get Started in 5 Minutes

This is a quick reference guide for setting up WorkOS programmatically.

---

## 🎯 Quick Steps

### 1. Get Your WorkOS Credentials

1. Go to [workos.com](https://workos.com) and sign up/login
2. Navigate to [Dashboard → API Keys](https://dashboard.workos.com/api-keys)
3. Copy your **API Key** (starts with `sk_`)
4. Copy your **Client ID** (starts with `client_`)

### 2. Add to Environment File

Edit `apps/app/.env.local`:

```bash
WORKOS_API_KEY=sk_your_api_key_here
WORKOS_CLIENT_ID=client_your_client_id_here
WORKOS_REDIRECT_URI=http://localhost:3000/auth/callback
NEXT_PUBLIC_WORKOS_CLIENT_ID=client_your_client_id_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Run Setup Script

```bash
pnpm setup:workos
```

This automatically:
- ✅ Verifies API connection
- ✅ Creates organization
- ✅ Creates admin user
- ✅ Configures webhooks
- ✅ Sets up all features

### 4. Test Everything

```bash
pnpm test:workos
```

---

## 🔧 What the Script Does

The `setup-workos` script programmatically:

1. **Verifies Connection** - Tests WorkOS API access
2. **Creates Organization** - Sets up your main organization
3. **Creates Admin User** - Creates admin user from `ADMIN` env var
4. **Configures SSO** - Prepares organization for SSO (manual dashboard config needed)
5. **Sets up Directory Sync** - Prepares for directory sync
6. **Configures Webhooks** - Sets up webhook endpoints
7. **Enables Audit Logs** - Audit logs are automatic with WorkOS

---

## 📝 Manual Dashboard Steps

After running the script, complete these in the [WorkOS Dashboard](https://dashboard.workos.com):

### SSO Setup (Optional)

1. Go to **SSO → Connections**
2. Click **Create Connection**
3. Choose provider (Google, Microsoft, SAML, OIDC)
4. Set redirect URI: `http://localhost:3000/auth/callback`
5. Save

### Directory Sync (Optional)

1. Go to **Directory Sync**
2. Click **Create Directory**
3. Choose provider (Azure AD, Google Workspace, Okta, Generic SCIM)
4. Follow setup wizard
5. Set webhook: `http://localhost:3002/api/webhooks/workos/directory-sync`

### Webhooks

1. Go to **Webhooks**
2. Click **Create Webhook**
3. Set URL: `http://localhost:3002/api/webhooks/workos`
4. Select all events
5. Save

---

## ✅ Verify Setup

Run the test script:

```bash
pnpm test:workos
```

Expected output:
```
🧪 Testing WorkOS Integration...

Testing: API Connection...
  ✅ API connection successful

Testing: List Organizations...
  ✅ Found 1 organization(s)
     - {"id":"org_...","name":"Next Forge Organization"}

Testing: List Users...
  ✅ Found 1 user(s)
     - {"id":"user_...","email":"admin@example.com"}

Testing: Get Authorization URL...
  ✅ Authorization URL generated
     {"url":"https://api.workos.com/user_management/authorize?..."}

============================================================
Tests: 4 passed, 0 failed
============================================================
```

---

## 🚀 Next Steps

1. ✅ Run `pnpm setup:workos`
2. ✅ Run `pnpm test:workos`
3. ✅ Configure SSO in dashboard (if needed)
4. ✅ Configure Directory Sync in dashboard (if needed)
5. ✅ Start testing authentication flow

---

## 🆘 Troubleshooting

### "API Key Invalid"
- Check `WORKOS_API_KEY` in `.env.local`
- Ensure it starts with `sk_`
- Regenerate in dashboard if needed

### "Organization Not Found"
- Run `pnpm setup:workos` again
- Check organization name matches

### "User Already Exists"
- This is normal - script will use existing user
- Check user email matches `ADMIN` env var

---

**Need more details?** See `WORKOS_SETUP_GUIDE.md` for comprehensive guide.

