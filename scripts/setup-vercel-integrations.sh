#!/bin/bash

# Vercel Integrations Setup Script
# This script helps set up all required integrations for the ARA Group Platform

set -e

echo "🚀 Setting up Vercel integrations for ARA Group Platform..."
echo "=========================================================="

# Navigate to the app directory
cd apps/app

# Check if we're in the right directory and linked to Vercel
if [ ! -d ".vercel" ]; then
    echo "❌ Error: Not linked to Vercel. Please run 'vercel link' first."
    exit 1
fi

echo "✅ Project is linked to Vercel"

# Function to add environment variable with confirmation
add_env_var() {
    local var_name=$1
    local description=$2
    local environments=${3:-"Development,Preview,Production"}
    
    echo ""
    echo "📝 Adding environment variable: $var_name"
    echo "   Description: $description"
    echo "   Environments: $environments"
    echo ""
    echo "Please enter the value for $var_name (or press Enter to skip):"
    read -r value
    
    if [ -n "$value" ]; then
        echo "Adding $var_name to Vercel..."
        echo "$value" | vercel env add "$var_name"
        echo "✅ Added $var_name"
    else
        echo "⏭️  Skipped $var_name"
    fi
}

# Function to remove legacy environment variable
remove_legacy_var() {
    local var_name=$1
    
    echo ""
    echo "🗑️  Removing legacy variable: $var_name"
    
    # Check if variable exists
    if vercel env ls | grep -q "$var_name"; then
        echo "Removing $var_name from all environments..."
        # Note: This requires interactive confirmation in CLI
        echo "Please run: vercel env rm $var_name"
        echo "Select all environments (Development, Preview, Production) when prompted"
    else
        echo "✅ $var_name not found, already cleaned up"
    fi
}

echo ""
echo "🔧 Setting up WorkOS Authentication..."
echo "====================================="

add_env_var "WORKOS_API_KEY" "WorkOS API key for authentication"
add_env_var "WORKOS_CLIENT_ID" "WorkOS client ID"
add_env_var "WORKOS_REDIRECT_URI" "WorkOS redirect URI (e.g., https://ara.aliaslabs.ai/api/auth/callback)"
add_env_var "NEXT_PUBLIC_WORKOS_CLIENT_ID" "Public WorkOS client ID"
add_env_var "NEXT_PUBLIC_SITE_URL" "Public site URL (e.g., https://ara.aliaslabs.ai)"

echo ""
echo "🗄️  Setting up Convex Database..."
echo "==============================="

add_env_var "CONVEX_DEPLOYMENT" "Convex deployment identifier"
add_env_var "NEXT_PUBLIC_CONVEX_URL" "Public Convex URL"

echo ""
echo "💳 Setting up Stripe Payments..."
echo "==============================="

add_env_var "STRIPE_SECRET_KEY" "Stripe secret key"
add_env_var "STRIPE_WEBHOOK_SECRET" "Stripe webhook secret"

echo ""
echo "📧 Setting up Resend Email..."
echo "============================"

add_env_var "RESEND_FROM" "From email address for Resend"
add_env_var "RESEND_TOKEN" "Resend API token"

echo ""
echo "📊 Setting up Analytics & Monitoring..."
echo "======================================"

add_env_var "NEXT_PUBLIC_POSTHOG_KEY" "PostHog public key"
add_env_var "NEXT_PUBLIC_POSTHOG_HOST" "PostHog host URL"
add_env_var "SENTRY_ORG" "Sentry organization slug"
add_env_var "SENTRY_PROJECT" "Sentry project slug"
add_env_var "NEXT_PUBLIC_SENTRY_DSN" "Public Sentry DSN"
add_env_var "BETTERSTACK_API_KEY" "BetterStack API key"
add_env_var "BETTERSTACK_URL" "BetterStack URL"

echo ""
echo "🔗 Setting up Liveblocks Collaboration..."
echo "========================================="

add_env_var "LIVEBLOCKS_SECRET_KEY" "Liveblocks secret key"
add_env_var "NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY" "Public Liveblocks key"

echo ""
echo "🤖 Setting up Additional Services..."
echo "==================================="

add_env_var "ELEVENLABS_API_KEY" "ElevenLabs API key for voice AI"
add_env_var "ARCJET_KEY" "Arcjet security key"
add_env_var "SVIX_TOKEN" "Svix webhook token"
add_env_var "BASEHUB_TOKEN" "BaseHub CMS token"
add_env_var "FLAGS_SECRET" "Feature flags secret"

echo ""
echo "🔔 Setting up Knock Notifications..."
echo "===================================="

add_env_var "KNOCK_API_KEY" "Knock API key"
add_env_var "KNOCK_SECRET_API_KEY" "Knock secret API key"
add_env_var "NEXT_PUBLIC_KNOCK_API_KEY" "Public Knock API key"
add_env_var "KNOCK_FEED_CHANNEL_ID" "Knock feed channel ID"
add_env_var "NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID" "Public Knock feed channel ID"

echo ""
echo "🌐 Setting up URL Configuration..."
echo "================================="

add_env_var "VERCEL_PROJECT_PRODUCTION_URL" "Production URL (e.g., https://ara.aliaslabs.ai)"
add_env_var "NEXT_PUBLIC_APP_URL" "Public app URL"
add_env_var "NEXT_PUBLIC_WEB_URL" "Public marketing site URL"
add_env_var "NEXT_PUBLIC_DOCS_URL" "Public documentation URL"

echo ""
echo "👤 Setting up Admin Configuration..."
echo "==================================="

add_env_var "ADMIN" "Admin user emails (comma-separated)"

echo ""
echo "🧹 Cleaning up Legacy Variables..."
echo "================================="

remove_legacy_var "NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL"
remove_legacy_var "NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL"
remove_legacy_var "NEXT_PUBLIC_CLERK_SIGN_UP_URL"
remove_legacy_var "NEXT_PUBLIC_CLERK_SIGN_IN_URL"

echo ""
echo "📋 Current Environment Variables:"
echo "================================="
vercel env ls

echo ""
echo "✅ Setup Complete!"
echo "================="
echo ""
echo "Next steps:"
echo "1. Open your browser to complete the integration setups:"
echo "   - Vercel Dashboard: https://vercel.com/alias-labs/app"
echo "   - Integrations: https://vercel.com/integrations"
echo ""
echo "2. Set up the following integrations via browser:"
echo "   - WorkOS: https://vercel.com/integrations/workos"
echo "   - Convex: https://vercel.com/integrations/convex"
echo "   - Stripe: https://vercel.com/integrations/stripe"
echo "   - Resend: https://vercel.com/integrations/resend"
echo "   - Sentry: https://vercel.com/integrations/sentry"
echo "   - PostHog: https://vercel.com/integrations/posthog"
echo "   - Liveblocks: https://vercel.com/integrations/liveblocks"
echo ""
echo "3. Test your deployment:"
echo "   vercel --prod"
echo ""
echo "4. Pull environment variables locally:"
echo "   vercel env pull .env.local"
echo ""
echo "📖 For detailed instructions, see: VERCEL_INTEGRATIONS_SETUP_GUIDE.md"
