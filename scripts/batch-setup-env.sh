#!/bin/bash

# Batch Environment Variable Setup Script
# This script sets up critical environment variables in batch mode

set -e

echo "🚀 Batch setting up critical environment variables..."
echo "=================================================="

# Navigate to the app directory
cd apps/app

# Check if we're in the right directory and linked to Vercel
if [ ! -d ".vercel" ]; then
    echo "❌ Error: Not linked to Vercel. Please run 'vercel link' first."
    exit 1
fi

echo "✅ Project is linked to Vercel"

# Critical variables that need to be set for basic functionality
declare -a critical_vars=(
    "NEXT_PUBLIC_SITE_URL:https://ara.aliaslabs.ai"
    "VERCEL_PROJECT_PRODUCTION_URL:https://ara.aliaslabs.ai"
    "NEXT_PUBLIC_APP_URL:https://ara.aliaslabs.ai"
    "NEXT_PUBLIC_WEB_URL:https://www.aliaslabs.ai"
    "NEXT_PUBLIC_DOCS_URL:https://docs.aliaslabs.ai"
    "ADMIN:admin@aliaslabs.ai"
)

# Function to add environment variable to all environments
add_env_var_all() {
    local var_name=$1
    local var_value=$2
    
    echo "📝 Adding $var_name to all environments..."
    
    # Add to Development
    echo "$var_value" | vercel env add "$var_name" development || echo "⚠️  Failed to add to development"
    
    # Add to Preview
    echo "$var_value" | vercel env add "$var_name" preview || echo "⚠️  Failed to add to preview"
    
    # Add to Production
    echo "$var_value" | vercel env add "$var_name" production || echo "⚠️  Failed to add to production"
    
    echo "✅ Added $var_name"
}

echo ""
echo "🌐 Setting up URL Configuration..."
echo "================================="

for var_entry in "${critical_vars[@]}"; do
    var_name=$(echo "$var_entry" | cut -d':' -f1)
    var_value=$(echo "$var_entry" | cut -d':' -f2-)
    
    add_env_var_all "$var_name" "$var_value"
done

echo ""
echo "🧹 Cleaning up Legacy Variables..."
echo "================================="

# Legacy variables to remove
declare -a legacy_vars=(
    "NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL"
    "NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL"
    "NEXT_PUBLIC_CLERK_SIGN_UP_URL"
    "NEXT_PUBLIC_CLERK_SIGN_IN_URL"
)

for var_name in "${legacy_vars[@]}"; do
    echo "🗑️  Removing $var_name..."
    # Note: This requires interactive confirmation
    echo "Please run manually: vercel env rm $var_name"
    echo "Select all environments when prompted"
done

echo ""
echo "📋 Current Environment Variables:"
echo "================================="
vercel env ls

echo ""
echo "✅ Batch Setup Complete!"
echo "======================"
echo ""
echo "Next steps:"
echo "1. Run verification script: ./scripts/verify-vercel-integrations.sh"
echo "2. Complete remaining integrations via browser"
echo "3. Test deployment: vercel --prod"
echo ""
echo "📖 For detailed instructions, see: VERCEL_INTEGRATIONS_SETUP_GUIDE.md"
