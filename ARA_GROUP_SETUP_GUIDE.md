# 🚀 ARA Group Platform - Complete Setup Guide

This guide walks you through setting up all 11 ARA Group organizations in WorkOS, Convex, and Vercel.

---

## 📋 Prerequisites

1. **WorkOS Account** with API key
2. **Convex Project** configured
3. **Vercel Project** configured
4. **Environment Variables** set up

---

## 🔧 Step 1: Environment Setup

### Required Environment Variables

Add these to `apps/app/.env.local`:

```bash
# WorkOS
WORKOS_API_KEY=your_workos_api_key
WORKOS_CLIENT_ID=your_workos_client_id
WORKOS_ENVIRONMENT=production

# Convex
CONVEX_DEPLOYMENT=your_convex_deployment
NEXT_PUBLIC_CONVEX_URL=your_convex_url

# Vercel
VERCEL_URL=your_vercel_url
```

---

## 🏢 Step 2: Create WorkOS Organizations

Run the setup script to create all 11 organizations:

```bash
pnpm run setup:ara-organizations
```

This will:
- ✅ Create all 11 ARA Group organizations in WorkOS
- ✅ Assign demo domains (`*.ara.aliaslabs.ai`)
- ✅ Create Super Admin users (Ed Federman, Mark Brady, Dan Humphreys)
- ✅ Assign Super Admins to all organizations

### Organizations Created:

1. **ARA Group Platform** - `ara.aliaslabs.ai`
2. **ARA Fire & Security** - `fire.ara.aliaslabs.ai`
3. **ARA Electrical** - `electrical.ara.aliaslabs.ai`
4. **ARA Building Services** - `buildingservices.ara.aliaslabs.ai`
5. **ARA Mechanical Services** - `mechanical.ara.aliaslabs.ai`
6. **ARA Property Services** - `propertyservices.ara.aliaslabs.ai`
7. **ARA Products** - `products.ara.aliaslabs.ai`
8. **ARA Manufacturing** - `manufacturing.ara.aliaslabs.ai`
9. **ARA Marine** - `marine.ara.aliaslabs.ai`
10. **ARA Security Solutions** - `security.ara.aliaslabs.ai`
11. **ARA Indigenous Services** - `indigenous.ara.aliaslabs.ai`

---

## 👑 Step 3: Configure Super Admins

Super Admins are automatically created and assigned. Verify in WorkOS Dashboard:

- **Ed Federman** (`ed.federman@aragroup.com.au`) - ARA Group Super Admin
- **Mark Brady** (`mark.brady@aliaslabs.ai`) - ALIAS Super Admin
- **Dan Humphreys** (`dan.humphreys@aliaslabs.ai`) - ALIAS Super Admin

---

## 🎨 Step 4: Configure Branding

Configure branding for each organization in WorkOS Dashboard:

1. Go to **Branding** section
2. Set **Primary Color**: `#AFCC37` (Lime Green)
3. Set **Secondary Color**: `#435464` (Navy Blue)
4. Upload **Logo**: ARA Property Services logo
5. Set **Tagline**: "ARA. Here for you. Here for good."

---

## 🔐 Step 5: Configure Roles & Permissions

Set up roles in WorkOS Dashboard:

1. **Super Admin** - Full access (`*`)
2. **Admin** - Organization administration
3. **Credential Manager** - Credential management
4. **Credential Viewer** - Read-only credentials
5. **Manager** - Team management
6. **Supervisor** - Supervision access
7. **Operator** - Operational access
8. **Viewer** - Read-only access
9. **User** - Basic user access

---

## 🔗 Step 6: Configure WorkOS Webhooks

Set up webhook endpoint in WorkOS Dashboard:

1. Go to **Webhooks** section
2. Add endpoint: `https://your-domain.com/api/webhooks/workos`
3. Select events:
   - `user.created`
   - `user.updated`
   - `user.deleted`
   - `organization.created`
   - `organization.updated`
   - `organization.deleted`
   - `organization_membership.created`
   - `organization_membership.updated`
   - `organization_membership.deleted`

---

## 💾 Step 7: Convex Database Sync

Organizations are automatically synced to Convex via webhooks:

- Organizations are stored in `organization` table
- WorkOS ID stored in `metadata` field
- Domains stored in `metadata` field

### Verify Sync:

```bash
# Check Convex dashboard for organizations
# Or query via Convex dashboard
```

---

## 🌐 Step 8: Vercel Domain Configuration

### Configure Domains in Vercel:

1. Go to **Vercel Dashboard** → **Project Settings** → **Domains**
2. Add each demo domain:
   - `ara.aliaslabs.ai`
   - `fire.ara.aliaslabs.ai`
   - `electrical.ara.aliaslabs.ai`
   - `buildingservices.ara.aliaslabs.ai`
   - `mechanical.ara.aliaslabs.ai`
   - `propertyservices.ara.aliaslabs.ai`
   - `products.ara.aliaslabs.ai`
   - `manufacturing.ara.aliaslabs.ai`
   - `marine.ara.aliaslabs.ai`
   - `security.ara.aliaslabs.ai`
   - `indigenous.ara.aliaslabs.ai`

### DNS Configuration:

Add CNAME records for each subdomain pointing to your Vercel deployment.

---

## ✅ Step 9: Verification

### Verify WorkOS Setup:

```bash
# List all organizations
pnpm run list:ara-organizations

# Test WorkOS connection
pnpm run test:workos
```

### Verify Convex Sync:

Check Convex dashboard for organizations synced from WorkOS webhooks.

### Verify Vercel Deployment:

Visit each demo domain to verify routing works correctly.

---

## 📝 Next Steps

1. **Configure SSO** (if needed) in WorkOS Dashboard
2. **Set up Directory Sync** (if needed) for user provisioning
3. **Configure Audit Logs** in WorkOS Dashboard
4. **Set up Admin Portal** access
5. **Configure Fine-Grained Authorization** (FGA) if needed

---

## 🐛 Troubleshooting

### Organizations Not Created:

- Check `WORKOS_API_KEY` is set correctly
- Verify API key has proper permissions
- Check WorkOS Dashboard for errors

### Webhooks Not Working:

- Verify webhook URL is accessible
- Check webhook signature verification
- Review Convex logs for errors

### Domains Not Routing:

- Verify DNS records are correct
- Check Vercel domain configuration
- Review Vercel deployment logs

---

## 📚 Additional Resources

- [WorkOS Documentation](https://workos.com/docs)
- [Convex Documentation](https://docs.convex.dev)
- [Vercel Documentation](https://vercel.com/docs)

---

**Last Updated:** $(date)
**Platform:** ARA Group Platform
**Total Organizations:** 11

