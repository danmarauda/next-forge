# Production Domain Setup: ara.aliaslabs.ai

This guide explains how to configure your custom production domain.

---

## 🌐 Domain Configuration

**Production Domain**: `ara.aliaslabs.ai`

### Environment URLs

- **Production**: https://ara.aliaslabs.ai
- **Staging**: https://staging-next-forge.vercel.app (or custom staging domain)
- **Development**: http://localhost:3000

---

## 🚀 Automated Setup

### Step 1: Add Domain to Vercel

Run the automated setup script:

```bash
export VERCEL_TOKEN="your-vercel-token"
tsx scripts/setup-custom-domain.ts
```

This script will:
1. ✅ Add `ara.aliaslabs.ai` to your Vercel project
2. ✅ Show required DNS records
3. ✅ Verify domain configuration

### Step 2: Configure DNS

The script will output the required DNS records. Add them to your DNS provider:

#### Option A: CNAME Record (Recommended)

```
Type: CNAME
Name: ara
Value: cname.vercel-dns.com
TTL: Auto or 3600
```

#### Option B: A Record

```
Type: A
Name: ara
Value: 76.76.21.21
TTL: Auto or 3600
```

### Step 3: Verify Domain

After adding DNS records, run the script again to verify:

```bash
tsx scripts/setup-custom-domain.ts
```

---

## 📋 Manual Setup (Alternative)

If you prefer to set up manually:

### 1. Add Domain in Vercel Dashboard

1. Go to https://vercel.com/alias-labs/next-forge/settings/domains
2. Click "Add Domain"
3. Enter: `ara.aliaslabs.ai`
4. Click "Add"

### 2. Configure DNS

Vercel will show you the required DNS records. Add them to your DNS provider.

**For Cloudflare:**
1. Go to https://dash.cloudflare.com
2. Select `aliaslabs.ai` domain
3. Go to DNS → Records
4. Add new record:
   - Type: `CNAME`
   - Name: `ara`
   - Target: `cname.vercel-dns.com`
   - Proxy status: DNS only (gray cloud)
5. Save

**For Other DNS Providers:**
- Follow similar steps in your DNS provider's dashboard
- Use the DNS records shown in Vercel

### 3. Wait for Verification

- DNS propagation can take up to 48 hours
- Usually completes within 5-10 minutes
- Check status in Vercel dashboard

---

## 🔧 Update Environment Variables

The production environment file has been updated with the custom domain:

### .env.production

```bash
# WorkOS Authentication
WORKOS_REDIRECT_URI="https://ara.aliaslabs.ai/api/auth/callback"
NEXT_PUBLIC_SITE_URL="https://ara.aliaslabs.ai"

# URLs
VERCEL_PROJECT_PRODUCTION_URL="https://ara.aliaslabs.ai"
NEXT_PUBLIC_APP_URL="https://ara.aliaslabs.ai"
NEXT_PUBLIC_WEB_URL="https://www.aliaslabs.ai"
NEXT_PUBLIC_DOCS_URL="https://docs.aliaslabs.ai"

# Email
RESEND_FROM="noreply@aliaslabs.ai"

# Admin
ADMIN="admin@aliaslabs.ai"
```

### Sync to Vercel

After domain is verified, sync the updated environment variables:

```bash
export VERCEL_TOKEN="your-token"
export VERCEL_PROJECT_ID="prj_zm0h3A5Xcs82mN5ArivZ8Gm4V4I5"
export VERCEL_TEAM_ID="team_zgbZHABKGlI9iyDBGQQauFTW"

pnpm sync:env:prod
```

---

## 🔐 Update OAuth Redirect URIs

After domain is configured, update your OAuth providers:

### WorkOS

1. Go to https://dashboard.workos.com
2. Navigate to your application
3. Update Redirect URI to: `https://ara.aliaslabs.ai/api/auth/callback`

### Other OAuth Providers

Update redirect URIs in:
- Google OAuth Console
- GitHub OAuth Apps
- Any other OAuth providers you use

---

## ✅ Verification Checklist

- [ ] Domain added to Vercel project
- [ ] DNS records configured
- [ ] Domain verified in Vercel
- [ ] SSL certificate issued (automatic)
- [ ] Environment variables updated
- [ ] Environment variables synced to Vercel
- [ ] OAuth redirect URIs updated
- [ ] Test deployment successful

---

## 🧪 Testing

### 1. Test DNS Resolution

```bash
# Check DNS propagation
dig ara.aliaslabs.ai

# Should show CNAME or A record pointing to Vercel
```

### 2. Test HTTPS

```bash
# Check SSL certificate
curl -I https://ara.aliaslabs.ai

# Should return 200 or 308 (redirect)
```

### 3. Test Deployment

```bash
# Deploy to production
git checkout main
git push origin main

# Check deployment status
vercel ls
```

---

## 🐛 Troubleshooting

### Domain Not Verifying

**Problem**: Domain shows as "Pending Verification"

**Solutions**:
1. Check DNS records are correct
2. Wait for DNS propagation (up to 48 hours)
3. Try using A record instead of CNAME
4. Disable Cloudflare proxy (use DNS only)

### SSL Certificate Issues

**Problem**: SSL certificate not issued

**Solutions**:
1. Wait 24 hours for automatic issuance
2. Remove and re-add domain
3. Check DNS records are correct
4. Contact Vercel support

### OAuth Redirect Errors

**Problem**: OAuth callback fails after domain change

**Solutions**:
1. Update redirect URIs in all OAuth providers
2. Clear browser cache and cookies
3. Test in incognito mode
4. Check environment variables are synced

---

## 📊 DNS Propagation Check

Check DNS propagation status:

- https://dnschecker.org/#CNAME/ara.aliaslabs.ai
- https://www.whatsmydns.net/#CNAME/ara.aliaslabs.ai

---

## 🎯 Quick Commands

```bash
# Add domain to Vercel
tsx scripts/setup-custom-domain.ts

# Sync environment variables
pnpm sync:env:prod

# Deploy to production
git push origin main

# Check deployment status
vercel ls

# Check domain status
vercel domains ls
```

---

## 📞 Support

- **Vercel Domains**: https://vercel.com/docs/concepts/projects/domains
- **DNS Help**: https://vercel.com/docs/concepts/projects/domains/troubleshooting
- **SSL Issues**: https://vercel.com/docs/concepts/projects/domains/troubleshooting#ssl-certificate-issues

---

**Status**: Ready to configure! Run `tsx scripts/setup-custom-domain.ts` to start. 🚀

