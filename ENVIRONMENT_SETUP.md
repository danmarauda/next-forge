# Environment Setup Guide

Complete guide for configuring environment variables for the ARA Group Platform across all environments.

## 📋 Quick Start

### 1. Development Setup

```bash
# Copy template
cp .env.template .env.development

# Edit with your values
# Required: CONVEX_DEPLOYMENT, WORKOS_API_KEY, WORKOS_CLIENT_ID
```

### 2. Staging Setup

```bash
# Copy template
cp .env.template .env.staging

# Update with staging credentials
# Use test/staging keys for all services
```

### 3. Production Setup

```bash
# Copy template
cp .env.template .env.production

# Use production keys for all services
# CRITICAL: Use sk_live_... keys, not sk_test_...
```

## 🔑 Required Variables (Must Configure)

### Convex Backend

```bash
# Get from: https://dashboard.convex.dev
CONVEX_DEPLOYMENT="dev-your-deployment"
NEXT_PUBLIC_CONVEX_URL="https://your-deployment.convex.cloud"
```

**Setup Steps:**
1. Go to https://dashboard.convex.dev
2. Create new deployment or select existing
3. Copy deployment name and URL
4. Paste into .env file

### WorkOS Authentication

```bash
# Get from: https://dashboard.workos.com
WORKOS_API_KEY="sk_test_YOUR_API_KEY"  # Use sk_live_... for production
WORKOS_CLIENT_ID="client_YOUR_CLIENT_ID"
WORKOS_REDIRECT_URI="http://localhost:3000/api/auth/callback"
NEXT_PUBLIC_WORKOS_CLIENT_ID="client_YOUR_CLIENT_ID"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

**Setup Steps:**
1. Go to https://dashboard.workos.com/api-keys
2. Copy API Key (test or live)
3. Go to https://dashboard.workos.com/configuration
4. Copy Client ID
5. Set redirect URI to your callback endpoint
6. Update NEXT_PUBLIC_SITE_URL to your domain

## 🛠️ Optional Variables (Configure as Needed)

### Admin Users

```bash
# Comma-separated list of super admin emails
ADMIN="admin@aragroup.com.au,dev@example.com"
```

### Liveblocks (Real-time Collaboration)

```bash
# Get from: https://liveblocks.io/dashboard/apikeys
LIVEBLOCKS_SECRET_KEY="sk_dev_YOUR_KEY"
NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY="pk_dev_YOUR_KEY"
```

**When to configure:** If using real-time collaborative features

### ElevenLabs (Voice AI)

```bash
# Get from: https://elevenlabs.io/app/settings
ELEVENLABS_API_KEY="sk_dev_YOUR_KEY"
```

**When to configure:** If using voice AI features

### Resend (Email)

```bash
# Get from: https://resend.com/api-keys
RESEND_FROM="noreply@aragroup.com.au"
RESEND_TOKEN="re_dev_YOUR_TOKEN"
```

**When to configure:** For sending system emails (invitations, notifications)

### Stripe (Payments)

```bash
# Get from: https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY="sk_test_YOUR_KEY"  # Use sk_live_... for production
STRIPE_WEBHOOK_SECRET="whsec_test_YOUR_SECRET"
```

**When to configure:** If enabling payment features

### Sentry (Error Monitoring)

```bash
# Get from: https://sentry.io/settings/projects/
SENTRY_ORG="aragroup"
SENTRY_PROJECT="ara-platform"
NEXT_PUBLIC_SENTRY_DSN="https://YOUR_DSN@sentry.io/PROJECT_ID"
```

**When to configure:** For production error monitoring (highly recommended)

### PostHog (Analytics)

```bash
# Get from: https://posthog.com/project/settings
NEXT_PUBLIC_POSTHOG_KEY="phc_dev_YOUR_KEY"
NEXT_PUBLIC_POSTHOG_HOST="https://app.posthog.com"
```

**When to configure:** For product analytics and feature flags

### Knock (Notifications)

```bash
# Get from: https://dashboard.knock.app
KNOCK_API_KEY="sk_dev_YOUR_KEY"
KNOCK_SECRET_API_KEY="sk_dev_YOUR_SECRET"
NEXT_PUBLIC_KNOCK_API_KEY="pk_dev_YOUR_KEY"
```

**When to configure:** For in-app notifications system

## 🔄 Syncing to Vercel

### Development Environment

```bash
pnpm sync:env:dev
```

### Staging Environment

```bash
pnpm sync:env:staging
```

### Production Environment

```bash
pnpm sync:env:prod
```

### All Environments

```bash
pnpm sync:env:all
```

## ✅ Validation

Test your environment configuration:

```bash
# Validate environment variables
pnpm validate:env

# Test authentication flow
pnpm test:auth:flow

# Verify WorkOS setup
pnpm verify:workos
```

## 🚨 Common Issues

### Issue: "WORKOS_API_KEY not configured"

**Solution:**
1. Check .env.development file exists
2. Verify WORKOS_API_KEY is not placeholder value
3. Restart development server

### Issue: "CONVEX_URL not configured"

**Solution:**
1. Deploy Convex: `pnpm convex:deploy`
2. Copy deployment URL from output
3. Update NEXT_PUBLIC_CONVEX_URL in .env

### Issue: "OAuth callback failed"

**Solution:**
1. Verify WORKOS_REDIRECT_URI matches your domain
2. Check WorkOS dashboard has correct redirect URI
3. Ensure NEXT_PUBLIC_SITE_URL is correct

## 📚 Environment-Specific Settings

### Development

- Use `sk_test_...` keys for all services
- Set NODE_ENV="development"
- Use localhost URLs
- Enable debug logging

### Staging

- Use test/staging keys
- Set NODE_ENV="staging"
- Use staging domain URLs
- Mirror production configuration

### Production

- Use `sk_live_...` keys for all services
- Set NODE_ENV="production"
- Use production domain URLs
- Enable monitoring and analytics
- Configure error reporting

## 🔐 Security Best Practices

1. **Never commit .env files**
   - .env files are in .gitignore
   - Use .env.template for documentation

2. **Use different keys per environment**
   - Development: test keys
   - Staging: staging keys
   - Production: live keys

3. **Rotate keys regularly**
   - Set up key rotation schedule
   - Update all environments when rotating

4. **Restrict API key permissions**
   - Use minimum required permissions
   - Create separate keys for different services

5. **Monitor key usage**
   - Set up alerts for unusual activity
   - Review access logs regularly

## 📋 Pre-Deployment Checklist

### Before deploying to production:

- [ ] All required variables are set
- [ ] Using production API keys (sk_live_...)
- [ ] WORKOS_REDIRECT_URI points to production domain
- [ ] NEXT_PUBLIC_SITE_URL is production URL
- [ ] Sentry DSN configured for error monitoring
- [ ] Stripe webhook secret configured
- [ ] Email service configured (Resend)
- [ ] Analytics configured (PostHog/GA)
- [ ] All integrations tested
- [ ] Environment synced to Vercel
- [ ] Validation script passes

## 🔍 Testing Environment Setup

After configuring variables:

```bash
# 1. Validate configuration
pnpm validate:env

# 2. Test authentication
pnpm test:auth:flow

# 3. Verify WorkOS
pnpm verify:workos

# 4. Start development server
pnpm dev

# 5. Test in browser
# Visit http://localhost:3000
# Try signing in
# Verify organization context
```

## 📞 Support

If you encounter issues:

1. Check this guide first
2. Review error messages in console
3. Verify all required variables are set
4. Test with validation scripts
5. Contact platform team if issues persist

## 🔗 Related Documentation

- [WorkOS Documentation](https://workos.com/docs)
- [Convex Documentation](https://docs.convex.dev)
- [Stripe Documentation](https://stripe.com/docs)
- [Sentry Documentation](https://docs.sentry.io)
- [README.md](./README.md) - Platform overview
- [PLATFORM_AUDIT_REPORT.md](./PLATFORM_AUDIT_REPORT.md) - Implementation status
