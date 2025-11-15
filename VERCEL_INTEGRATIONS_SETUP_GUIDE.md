# Vercel Integrations Setup Guide

This guide walks through setting up all required integrations for the ARA Group Platform using Vercel CLI and browser tools.

## Prerequisites

- Vercel CLI installed and authenticated
- Project linked to Vercel (`apps/app` directory linked to `alias-labs/app`)
- Browser access to Vercel dashboard

## Required Integrations

Based on the environment configuration, the following integrations need to be set up:

### 1. WorkOS (Authentication)
- **Purpose**: Enterprise SSO and authentication
- **Required Variables**:
  - `WORKOS_API_KEY`
  - `WORKOS_CLIENT_ID`
  - `WORKOS_REDIRECT_URI`
  - `NEXT_PUBLIC_WORKOS_CLIENT_ID`
  - `NEXT_PUBLIC_SITE_URL`

### 2. Convex (Database)
- **Purpose**: Backend database and real-time functions
- **Required Variables**:
  - `CONVEX_DEPLOYMENT`
  - `NEXT_PUBLIC_CONVEX_URL`

### 3. Stripe (Payments)
- **Purpose**: Payment processing
- **Required Variables**:
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`

### 4. Resend (Email)
- **Purpose**: Email delivery
- **Required Variables**:
  - `RESEND_FROM`
  - `RESEND_TOKEN`

### 5. Sentry (Error Monitoring)
- **Purpose**: Error tracking and performance monitoring
- **Required Variables**:
  - `SENTRY_ORG`
  - `SENTRY_PROJECT`
  - `NEXT_PUBLIC_SENTRY_DSN`

### 6. PostHog (Analytics)
- **Purpose**: Product analytics
- **Required Variables**:
  - `NEXT_PUBLIC_POSTHOG_KEY`
  - `NEXT_PUBLIC_POSTHOG_HOST`

### 7. Liveblocks (Collaboration)
- **Purpose**: Real-time collaborative editing
- **Required Variables**:
  - `LIVEBLOCKS_SECRET_KEY`
  - `NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY`

### 8. Additional Services
- **ElevenLabs** (Voice AI): `ELEVENLABS_API_KEY`
- **BetterStack** (Monitoring): `BETTERSTACK_API_KEY`, `BETTERSTACK_URL`
- **Arcjet** (Security): `ARCJET_KEY`
- **Svix** (Webhooks): `SVIX_TOKEN`
- **BaseHub** (CMS): `BASEHUB_TOKEN`
- **Knock** (Notifications): Multiple KNOCK_* variables
- **Feature Flags**: `FLAGS_SECRET`

## Setup Steps

### Step 1: Browser-Based Integration Setup

1. **Open Vercel Dashboard**: https://vercel.com/alias-labs/app
2. **Navigate to Integrations**: https://vercel.com/integrations

#### WorkOS Setup
1. Go to: https://vercel.com/integrations/workos
2. Click "Add Integration"
3. Select the `alias-labs/app` project
4. Follow the OAuth flow to connect WorkOS
5. Configure the required environment variables

#### Convex Setup
1. Go to: https://vercel.com/integrations/convex
2. Click "Add Integration"
3. Select the `alias-labs/app` project
4. Connect your Convex deployment
5. Configure the required environment variables

#### Stripe Setup
1. Go to: https://vercel.com/integrations/stripe
2. Click "Add Integration"
3. Select the `alias-labs/app` project
4. Connect your Stripe account
5. Configure webhook endpoints and environment variables

#### Other Integrations
Repeat the same process for:
- Resend: https://vercel.com/integrations/resend
- Sentry: https://vercel.com/integrations/sentry
- PostHog: https://vercel.com/integrations/posthog
- Liveblocks: https://vercel.com/integrations/liveblocks

### Step 2: CLI-Based Environment Variable Setup

For integrations that don't have dedicated Vercel integrations or for additional configuration:

```bash
# Navigate to app directory
cd apps/app

# Add environment variables (interactive)
vercel env add ELEVENLABS_API_KEY
vercel env add BETTERSTACK_API_KEY
vercel env add ARCJET_KEY
vercel env add SVIX_TOKEN
vercel env add BASEHUB_TOKEN
vercel env add FLAGS_SECRET

# Add Knock variables
vercel env add KNOCK_API_KEY
vercel env add KNOCK_SECRET_API_KEY
vercel env add NEXT_PUBLIC_KNOCK_API_KEY
vercel env add KNOCK_FEED_CHANNEL_ID
vercel env add NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID

# Add URL variables
vercel env add VERCEL_PROJECT_PRODUCTION_URL
vercel env add NEXT_PUBLIC_APP_URL
vercel env add NEXT_PUBLIC_WEB_URL
vercel env add NEXT_PUBLIC_DOCS_URL

# Add admin users
vercel env add ADMIN
```

### Step 3: Clean Up Legacy Variables

Remove old Clerk variables that are no longer needed:

```bash
cd apps/app

# Remove legacy Clerk variables
vercel env rm NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL
vercel env rm NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL
vercel env rm NEXT_PUBLIC_CLERK_SIGN_UP_URL
vercel env rm NEXT_PUBLIC_CLERK_SIGN_IN_URL
```

### Step 4: Verify Configuration

```bash
# List all environment variables
vercel env ls

# Pull environment variables to local file
vercel env pull .env.local

# Test deployment
vercel --prod
```

## Environment-Specific Configuration

### Development
- Use test/development keys from each service
- Set `NODE_ENV=development`
- Use localhost URLs for redirects

### Staging
- Use staging/test keys
- Set `NODE_ENV=staging`
- Use staging URLs for redirects

### Production
- Use live/production keys
- Set `NODE_ENV=production`
- Use production URLs: `https://ara.aliaslabs.ai`

## Security Considerations

1. **Never commit API keys** to version control
2. **Use different keys** for each environment
3. **Regularly rotate** API keys and secrets
4. **Monitor usage** of all integrations
5. **Implement proper webhook signing** for Stripe and other services

## Troubleshooting

### Common Issues

1. **Integration not showing up**: Ensure you're logged into the correct Vercel workspace
2. **Environment variables not working**: Check that they're set for the correct environments
3. **Webhook failures**: Verify webhook URLs are accessible and properly configured
4. **Build failures**: Check that all required environment variables are set

### Debug Commands

```bash
# Check project linkage
vercel link

# Verify environment variables
vercel env ls

# Test deployment
vercel --debug

# Check logs
vercel logs
```

## Next Steps

1. Complete all integrations setup
2. Test authentication flow with WorkOS
3. Verify database connection with Convex
4. Test payment processing with Stripe
5. Configure monitoring and alerting
6. Set up proper domain configuration
7. Test end-to-end functionality

## Support

For integration-specific issues:
- WorkOS: https://workos.com/docs
- Convex: https://docs.convex.dev
- Stripe: https://stripe.com/docs
- Vercel: https://vercel.com/docs

For project-specific issues, check the project documentation or contact the development team.
