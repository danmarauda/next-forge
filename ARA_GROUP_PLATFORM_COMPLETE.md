# 🏢 ARA Group Platform - Complete Documentation

**Single Source of Truth** for ARA Group Platform setup, configuration, and operations.

**Last Updated:** 2025-01-27  
**Status:** Production Ready

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Company Overview](#company-overview)
3. [Organization Structure](#organization-structure)
4. [Environment Setup](#environment-setup)
5. [WorkOS Configuration](#workos-configuration)
6. [Scripts & Commands](#scripts--commands)
7. [Production Deployment](#production-deployment)
8. [Monitoring & Logging](#monitoring--logging)
9. [Testing](#testing)
10. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- pnpm 10.21.0+
- WorkOS account with API key
- Convex project configured
- Vercel account (for deployment)

### Initial Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Set up environment variables
cp apps/app/.env.example apps/app/.env.local
# Edit .env.local with your credentials

# 3. Validate environment
pnpm run validate:env

# 4. Setup ARA organizations
pnpm run setup:ara-organizations

# 5. Setup Super Admins
pnpm run setup:ara-super-admins

# 6. Start development server
pnpm dev
```

---

## 🏢 Company Overview

**ARA Group Limited** (ABN 47 074 886 561) is an Australian employee-owned company established in **2001** by co-founders **Leo Browne** and **Edward Federman**.

### Key Facts
- **Headquarters:** Crows Nest, New South Wales, Australia
- **Employees:** 4,000+ employees
- **Locations:** 100+ locations across Australia and New Zealand
- **Revenue (2025):** $1.204 billion (24% growth from 2024)
- **Tagline:** "Here for you. Here for good."
- **Type:** Employee-owned company (since 2007)

### Company History
- **2001:** Company founded
- **2007:** Transitioned to employee-owned company
- **2016:** Expanded operations into New Zealand
- **2017:** Acquired CMC Property Services and established ARA Indigenous Services
- **2021:** Formed ARA Marine through acquisitions
- **2025:** 24 years of operations, $1.204B revenue

---

## 🏢 Organization Structure

### Equal Status Model
**All 11 organizations are treated equally** - no parent-child hierarchy. Each organization has equal permissions and access.

### All Organizations

1. **ARA Group Platform** (Primary)
   - Demo: `ara.aliaslabs.ai`
   - Production: `aragroup.com.au`, `arapropertyservices.com.au`, `araproperty.com`, `aragroup.com`

2. **ARA Fire & Security**
   - Demo: `fire.ara.aliaslabs.ai`
   - Production: `fire.aragroup.com.au`, `arafireandsecurity.com`
   - Services: Fire protection, security, marine safety
   - History: Foundations date back to 1993

3. **ARA Electrical**
   - Demo: `electrical.ara.aliaslabs.ai`
   - Production: `electrical.aragroup.com.au`
   - Services: Industrial electrical installation and service

4. **ARA Building Services**
   - Demo: `buildingservices.ara.aliaslabs.ai`
   - Production: `buildingservices.aragroup.com.au`
   - Services: Building maintenance and repair services

5. **ARA Mechanical Services**
   - Demo: `mechanical.ara.aliaslabs.ai`
   - Production: `mechanical.aragroup.com.au`
   - Services: HVAC and mechanical services
   - Note: Part of Building Services but operates as standalone brand

6. **ARA Property Services**
   - Demo: `propertyservices.ara.aliaslabs.ai`
   - Production: `propertyservices.aragroup.com.au`
   - Services: Cleaning and property maintenance
   - History: Acquired CMC Property Services in 2017
   - Location: Camberwell, Victoria

7. **ARA Products**
   - Demo: `products.ara.aliaslabs.ai`
   - Production: `manufacture.aragroup.com.au`
   - Services: Product distribution of electronic security products

8. **ARA Manufacturing**
   - Demo: `manufacturing.ara.aliaslabs.ai`
   - Production: `manufacture.aragroup.com.au`
   - Services: Manufacturing of high-security products and commercial doors
   - Note: Part of Products capability area but operates as standalone brand

9. **ARA Marine**
   - Demo: `marine.ara.aliaslabs.ai`
   - Production: `aramarine.com.au`, `aramarine.co.nz`
   - Services: Specialty marine safety services and technical services
   - Established: 2021

10. **ARA Security Solutions**
    - Demo: `security.ara.aliaslabs.ai`
    - Production: `arasecuritysolutions.com.au`
    - Services: Security solutions

11. **ARA Indigenous Services**
    - Demo: `indigenous.ara.aliaslabs.ai`
    - Production: `indigenous.aragroup.com.au`
    - Type: Majority Indigenous-owned business partnership
    - Established: 2017
    - Managing Director: Michael O'Loughlin
    - Services: Cleaning and property maintenance services

### Super Admin Users

All three Super Admins have access to **all 11 organizations**:

1. **Ed Federman** (`ed.federman@aragroup.com.au`)
   - Title: Co-founder, ARA Group
   - Role: ARA Group Super Admin

2. **Mark Brady** (`mark.brady@aliaslabs.ai`)
   - Title: Executive
   - Role: ALIAS Super Admin

3. **Dan Humphreys** (`dan.humphreys@aliaslabs.ai`)
   - Title: Executive
   - Role: ALIAS Super Admin

---

## 🔧 Environment Setup

### Required Environment Variables

See `apps/app/.env.example` for complete list.

#### WorkOS (Required)
```bash
WORKOS_API_KEY=sk_...                    # WorkOS API key
WORKOS_CLIENT_ID=client_...              # WorkOS Client ID
WORKOS_REDIRECT_URI=http://localhost:3000/auth/callback
WORKOS_WEBHOOK_SECRET=...                # Webhook signing secret
WORKOS_ENVIRONMENT_ID=env_...            # WorkOS Environment ID
```

#### Convex (Required)
```bash
CONVEX_DEPLOYMENT=...                     # Convex deployment name
NEXT_PUBLIC_CONVEX_URL=https://...       # Convex public URL
```

#### Application (Optional)
```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN=admin@example.com                  # Comma-separated admin emails
```

#### Client-Side (Required)
```bash
NEXT_PUBLIC_WORKOS_CLIENT_ID=client_...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Environment Validation

```bash
# Validate all environment variables
pnpm run validate:env
```

---

## 🎨 WorkOS Configuration

### Branding
- **Primary Color:** `#AFCC37` (Lime Green)
- **Secondary Color:** `#435464` (Navy Blue)
- **Logo:** ARA Property Services Stacked Logo (SVG)
- **Tagline:** "ARA. Here for you. Here for good."

### Roles & Permissions (9 Roles)

1. **Super Admin** - Full system access (`*`)
2. **Admin** - Organization administration
3. **Credential Manager** - Credential management
4. **Credential Viewer** - Read-only credentials
5. **Manager** - Team management
6. **Supervisor** - Operational supervision
7. **Operator** - Basic operational access
8. **Viewer** - Read-only access
9. **User** - Basic user access

### WorkOS Dashboard URLs

- **Environment:** `https://dashboard.workos.com/environment_01K5K3Y79TXRCBAA52TCYZ5CCA`
- **Organizations:** `/organizations`
- **Users:** `/users`
- **Roles & Permissions:** `/roles-and-permissions`
- **Branding:** `/branding`
- **Webhooks:** `/webhooks`

---

## 📜 Scripts & Commands

### ARA Group Commands

```bash
# List all organizations
pnpm run list:ara-organizations

# Setup all organizations in WorkOS
pnpm run setup:ara-organizations

# Setup Super Admins
pnpm run setup:ara-super-admins

# Configure ARA Group settings
pnpm run configure:ara-group

# Complete ARA setup
pnpm run setup:ara-complete
```

### WorkOS Commands

```bash
# Setup WorkOS
pnpm run setup:workos

# Complete WorkOS setup
pnpm run setup:workos:complete

# Test WorkOS connection
pnpm run test:workos

# Test all WorkOS features
pnpm run test:workos:all

# Check WorkOS best practices
pnpm run check:workos:practices
```

### General Commands

```bash
# Development
pnpm dev                    # Start dev server
pnpm build                  # Build all apps
pnpm test                   # Run tests

# Environment
pnpm run validate:env       # Validate environment variables
pnpm run sync:env:dev       # Sync Vercel env (dev)
pnpm run sync:env:prod      # Sync Vercel env (prod)

# Database
pnpm run convex:dev         # Start Convex dev
pnpm run convex:deploy      # Deploy Convex
```

---

## 🚀 Production Deployment

### Domain Configuration

#### Demo Domains (Current)
All demo domains use `*.ara.aliaslabs.ai` pattern:
- `ara.aliaslabs.ai` (Primary)
- `fire.ara.aliaslabs.ai`
- `electrical.ara.aliaslabs.ai`
- ... (11 total)

#### Production Domains (Future)
Configure in Vercel Dashboard → Project Settings → Domains:

1. Add each production domain:
   - `aragroup.com.au`
   - `fire.aragroup.com.au`
   - `electrical.aragroup.com.au`
   - ... (all 11 organizations)

2. DNS Configuration:
   - Add CNAME records for each subdomain pointing to Vercel
   - Example: `fire.aragroup.com.au` → `cname.vercel-dns.com`

### Vercel Configuration

1. **Environment Variables:**
   - Set all required variables in Vercel Dashboard
   - Use `pnpm run sync:env:prod` to sync from local

2. **Domain Setup:**
   - Add all production domains
   - Configure SSL certificates (automatic)

3. **Webhook URLs:**
   - Update `WORKOS_REDIRECT_URI` to production URL
   - Update `WORKOS_WEBHOOK_URL` to production webhook endpoint

### Deployment Checklist

- [ ] Environment variables configured
- [ ] WorkOS organizations created (11 total)
- [ ] Super Admins assigned to all organizations
- [ ] WorkOS branding configured
- [ ] WorkOS roles configured
- [ ] WorkOS webhooks configured
- [ ] Convex organizations synced
- [ ] Vercel domains configured
- [ ] DNS records added
- [ ] SSL certificates active
- [ ] All demo domains accessible
- [ ] Production domains tested

---

## 📊 Monitoring & Logging

### WorkOS Webhook Monitoring

Webhook events are logged with:
- Event type
- Timestamp
- Organization ID
- User ID (if applicable)
- Event data

**Log Locations:**
- **API Route:** `apps/app/app/api/webhooks/workos/route.ts`
- **Convex Handler:** `packages/database/convex/workosAuth.ts`

### Monitoring Events

All WorkOS webhook events are monitored:
- `user.created`
- `user.updated`
- `user.deleted`
- `organization.created`
- `organization.updated`
- `organization.deleted`
- `organization_membership.created`
- `organization_membership.updated`
- `organization_membership.deleted`
- `dsync.*` (Directory Sync events)

### Logging Format

```typescript
{
  timestamp: string,
  event: string,
  organizationId?: string,
  userId?: string,
  data: object,
  status: 'success' | 'error',
  error?: string
}
```

### Viewing Logs

- **Vercel:** Dashboard → Project → Logs
- **Convex:** Dashboard → Logs
- **Local:** Console output during development

---

## 🧪 Testing

### Automated Tests

```bash
# Run all tests
pnpm test

# Test WorkOS features
pnpm run test:workos:all

# Validate environment
pnpm run validate:env

# Check best practices
pnpm run check:workos:practices
```

### Manual Testing

1. **Organization Setup:**
   ```bash
   pnpm run setup:ara-organizations
   # Verify in WorkOS Dashboard
   ```

2. **Super Admin Setup:**
   ```bash
   pnpm run setup:ara-super-admins
   # Verify access in WorkOS Dashboard
   ```

3. **Webhook Testing:**
   - Trigger events in WorkOS Dashboard
   - Check logs for webhook processing
   - Verify Convex database updates

### Visual Testing

```bash
# Start dev server
pnpm dev

# Access:
# - Main app: http://localhost:3000
# - Web app: http://localhost:3001
# - API: http://localhost:3002
# - Docs: http://localhost:3003
```

---

## 🐛 Troubleshooting

### Common Issues

#### Organizations Not Created
- Check `WORKOS_API_KEY` is set correctly
- Verify API key has proper permissions
- Check WorkOS Dashboard for errors

#### Webhooks Not Working
- Verify webhook URL is accessible
- Check webhook signature verification
- Review Convex logs for errors
- Ensure `WORKOS_WEBHOOK_SECRET` is set

#### Domains Not Routing
- Verify DNS records are correct
- Check Vercel domain configuration
- Review Vercel deployment logs
- Ensure SSL certificates are active

#### Environment Variables Missing
- Run `pnpm run validate:env`
- Check `.env.local` file exists
- Verify all required variables are set
- Check variable names match exactly

### Getting Help

1. Check logs in Vercel/Convex dashboards
2. Run validation scripts
3. Review WorkOS Dashboard for errors
4. Check this documentation
5. Review error messages in console

---

## 📚 Additional Resources

### Documentation Files
- `ARA_GROUP_RESEARCH.md` - Company research
- `ARA_GROUP_ORGANIZATIONS_COMPLETE.md` - Organization details
- `WORKOS_ARA_GROUP_CONFIGURATION.md` - WorkOS configuration
- `ARA_GROUP_SETUP_GUIDE.md` - Setup guide

### External Resources
- [WorkOS Documentation](https://workos.com/docs)
- [Convex Documentation](https://docs.convex.dev)
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)

---

**Status:** ✅ Complete Documentation  
**Maintained By:** ARA Group Platform Team  
**Last Review:** 2025-01-27


