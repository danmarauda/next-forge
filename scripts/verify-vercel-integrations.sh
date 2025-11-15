#!/bin/bash

# Vercel Integrations Verification Script
# This script checks the status of all required integrations

set -e

echo "🔍 Verifying Vercel integrations for ARA Group Platform..."
echo "========================================================="

# Navigate to the app directory
cd apps/app

# Check if we're in the right directory and linked to Vercel
if [ ! -d ".vercel" ]; then
    echo "❌ Error: Not linked to Vercel. Please run 'vercel link' first."
    exit 1
fi

echo "✅ Project is linked to Vercel"

# Arrays of required environment variables
required_vars=(
    "WORKOS_API_KEY:WorkOS API key"
    "WORKOS_CLIENT_ID:WorkOS client ID"
    "WORKOS_REDIRECT_URI:WorkOS redirect URI"
    "NEXT_PUBLIC_WORKOS_CLIENT_ID:Public WorkOS client ID"
    "NEXT_PUBLIC_SITE_URL:Public site URL"
    "CONVEX_DEPLOYMENT:Convex deployment identifier"
    "NEXT_PUBLIC_CONVEX_URL:Public Convex URL"
    "STRIPE_SECRET_KEY:Stripe secret key"
    "STRIPE_WEBHOOK_SECRET:Stripe webhook secret"
    "RESEND_FROM:Resend from email"
    "RESEND_TOKEN:Resend API token"
    "NEXT_PUBLIC_POSTHOG_KEY:PostHog public key"
    "NEXT_PUBLIC_POSTHOG_HOST:PostHog host URL"
    "SENTRY_ORG:Sentry organization"
    "SENTRY_PROJECT:Sentry project"
    "NEXT_PUBLIC_SENTRY_DSN:Public Sentry DSN"
    "BETTERSTACK_API_KEY:BetterStack API key"
    "BETTERSTACK_URL:BetterStack URL"
    "LIVEBLOCKS_SECRET_KEY:Liveblocks secret key"
    "NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY:Public Liveblocks key"
    "ELEVENLABS_API_KEY:ElevenLabs API key"
    "ARCJET_KEY:Arcjet security key"
    "SVIX_TOKEN:Svix webhook token"
    "BASEHUB_TOKEN:BaseHub CMS token"
    "FLAGS_SECRET:Feature flags secret"
    "KNOCK_API_KEY:Knock API key"
    "KNOCK_SECRET_API_KEY:Knock secret API key"
    "NEXT_PUBLIC_KNOCK_API_KEY:Public Knock API key"
    "KNOCK_FEED_CHANNEL_ID:Knock feed channel ID"
    "NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID:Public Knock feed channel ID"
    "VERCEL_PROJECT_PRODUCTION_URL:Production URL"
    "NEXT_PUBLIC_APP_URL:Public app URL"
    "NEXT_PUBLIC_WEB_URL:Public web URL"
    "NEXT_PUBLIC_DOCS_URL:Public docs URL"
    "ADMIN:Admin users"
)

# Legacy variables that should be removed
declare -a legacy_vars=(
    "NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL"
    "NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL"
    "NEXT_PUBLIC_CLERK_SIGN_UP_URL"
    "NEXT_PUBLIC_CLERK_SIGN_IN_URL"
)

echo ""
echo "📋 Checking Required Environment Variables..."
echo "============================================"

# Get current environment variables from Vercel
current_vars=$(vercel env ls)

configured_count=0
total_count=${#required_vars[@]}

for var_entry in "${required_vars[@]}"; do
    var_name=$(echo "$var_entry" | cut -d':' -f1)
    description=$(echo "$var_entry" | cut -d':' -f2-)
    
    if echo "$current_vars" | grep -q "$var_name"; then
        echo "✅ $var_name - $description"
        ((configured_count++))
    else
        echo "❌ $var_name - $description (MISSING)"
    fi
done

echo ""
echo "📊 Configuration Summary:"
echo "========================"
echo "Configured: $configured_count/$total_count variables"
echo "Progress: $(( configured_count * 100 / total_count ))%"

if [ $configured_count -eq $total_count ]; then
    echo "🎉 All required variables are configured!"
else
    echo "⚠️  Some variables are missing. Run the setup script to add them."
fi

echo ""
echo "🧹 Checking for Legacy Variables..."
echo "=================================="

legacy_found=false
for var_name in "${legacy_vars[@]}"; do
    if echo "$current_vars" | grep -q "$var_name"; then
        echo "⚠️  $var_name (should be removed)"
        legacy_found=true
    fi
done

if [ "$legacy_found" = false ]; then
    echo "✅ No legacy variables found - all clean!"
else
    echo "⚠️  Legacy variables found. Consider running cleanup."
fi

echo ""
echo "🔗 Integration Status Check..."
echo "============================"

# Check if integrations are available via Vercel marketplace
echo "The following integrations should be set up via Vercel dashboard:"
echo ""
echo "1. WorkOS Authentication:"
echo "   🔗 https://vercel.com/integrations/workos"
echo "   📋 Required: WORKOS_* variables"
echo ""

echo "2. Convex Database:"
echo "   🔗 https://vercel.com/integrations/convex"
echo "   📋 Required: CONVEX_* variables"
echo ""

echo "3. Stripe Payments:"
echo "   🔗 https://vercel.com/integrations/stripe"
echo "   📋 Required: STRIPE_* variables"
echo ""

echo "4. Resend Email:"
echo "   🔗 https://vercel.com/integrations/resend"
echo "   📋 Required: RESEND_* variables"
echo ""

echo "5. Sentry Error Monitoring:"
echo "   🔗 https://vercel.com/integrations/sentry"
echo "   📋 Required: SENTRY_* variables"
echo ""

echo "6. PostHog Analytics:"
echo "   🔗 https://vercel.com/integrations/posthog"
echo "   📋 Required: POSTHOG_* variables"
echo ""

echo "7. Liveblocks Collaboration:"
echo "   🔗 https://vercel.com/integrations/liveblocks"
echo "   📋 Required: LIVEBLOCKS_* variables"
echo ""

echo "🚀 Next Steps:"
echo "============="
echo ""
if [ $configured_count -lt $total_count ]; then
    echo "1. Run the setup script to add missing variables:"
    echo "   ./scripts/setup-vercel-integrations.sh"
    echo ""
fi

if [ "$legacy_found" = true ]; then
    echo "2. Clean up legacy variables:"
    echo "   vercel env rm NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL"
    echo "   vercel env rm NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL"
    echo "   vercel env rm NEXT_PUBLIC_CLERK_SIGN_UP_URL"
    echo "   vercel env rm NEXT_PUBLIC_CLERK_SIGN_IN_URL"
    echo ""
fi

echo "3. Set up integrations via browser:"
echo "   🌐 Vercel Dashboard: https://vercel.com/alias-labs/app"
echo "   🌐 Integrations: https://vercel.com/integrations"
echo ""

echo "4. Test deployment:"
echo "   vercel --prod"
echo ""

echo "5. Pull environment variables locally:"
echo "   vercel env pull .env.local"
echo ""

echo "📖 For detailed instructions, see: VERCEL_INTEGRATIONS_SETUP_GUIDE.md"
