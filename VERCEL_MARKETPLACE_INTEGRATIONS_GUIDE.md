# 🛒 VERCEL MARKETPLACE INTEGRATIONS SETUP GUIDE

## 🎯 **USING VERCEL MARKETPLACE FOR LEGITIMATE API KEYS**

All integration pages are now open in your browser. Use this guide to set up real API keys through the Vercel Marketplace instead of placeholders.

## 📋 **INTEGRATION CHECKLIST**

### ✅ **OPENED INTEGRATION PAGES (12 Total)**

1. **WorkOS Authentication** - Enterprise SSO
   🔗 https://vercel.com/integrations/workos
   
2. **Convex Database** - Backend database
   🔗 https://vercel.com/integrations/convex
   
3. **Stripe Payments** - Payment processing
   🔗 https://vercel.com/integrations/stripe
   
4. **Resend Email** - Email delivery
   🔗 https://vercel.com/integrations/resend
   
5. **Sentry Error Monitoring** - Error tracking
   🔗 https://vercel.com/integrations/sentry
   
6. **PostHog Analytics** - Product analytics
   🔗 https://vercel.com/integrations/posthog
   
7. **BetterStack Monitoring** - Infrastructure monitoring
   🔗 https://vercel.com/integrations/betterstack
   
8. **Liveblocks Collaboration** - Real-time collaboration
   🔗 https://vercel.com/integrations/liveblocks
   
9. **ElevenLabs AI** - Voice features
   🔗 https://vercel.com/integrations/elevenlabs
   
10. **Svix Webhooks** - Webhook management
    🔗 https://vercel.com/integrations/svix
    
11. **BaseHub CMS** - Content management
    🔗 https://vercel.com/integrations/basehub
    
12. **Knock Notifications** - Advanced notifications
    🔗 https://vercel.com/integrations/knock

## 🚀 **STEP-BY-STEP SETUP PROCESS**

### **For Each Integration:**

1. **Click "Add Integration"** on the Vercel Marketplace page
2. **Select your project**: `alias-labs/app`
3. **Configure the integration**:
   - Follow the OAuth flow or API key setup
   - Choose the appropriate plan (free tier available for most)
   - Configure settings for your use case
4. **Environment variables will be automatically added** to your project
5. **Test the connection** using the integration's test features

### **Priority Order (Recommended):**

#### **🔥 CRITICAL (Set up first):**
1. **WorkOS** - Authentication (required for user access)
2. **Convex** - Database (required for data storage)
3. **Resend** - Email (required for notifications)

#### **⚡ IMPORTANT (Set up next):**
4. **Stripe** - Payments (if you need billing)
5. **Sentry** - Error monitoring (production essential)
6. **PostHog** - Analytics (product insights)

#### **🎯 NICE-TO-HAVE (Set up last):**
7. **BetterStack** - Infrastructure monitoring
8. **Liveblocks** - Real-time collaboration
9. **ElevenLabs** - Voice features
10. **Svix** - Webhook management
11. **BaseHub** - Content management
12. **Knock** - Advanced notifications

## 🔧 **DETAILED SETUP INSTRUCTIONS**

### **1. WorkOS Authentication**
```
1. Click "Add Integration" → Select "alias-labs/app"
2. Sign up/log in to WorkOS
3. Configure SSO providers (Google, Microsoft, SAML, etc.)
4. Set up redirect URLs (auto-configured)
5. Choose plan (Free tier: 1,000 MAU)
6. Environment variables auto-added:
   - WORKOS_API_KEY
   - WORKOS_CLIENT_ID
   - WORKOS_REDIRECT_URI
   - NEXT_PUBLIC_WORKOS_CLIENT_ID
```

### **2. Convex Database**
```
1. Click "Add Integration" → Select "alias-labs/app"
2. Create or link Convex project
3. Choose deployment region
4. Environment variables auto-added:
   - CONVEX_DEPLOYMENT
   - NEXT_PUBLIC_CONVEX_URL
5. Run: cd packages/database && npx convex dev
```

### **3. Stripe Payments**
```
1. Click "Add Integration" → Select "alias-labs/app"
2. Connect Stripe account (create if needed)
3. Configure webhook endpoints
4. Environment variables auto-added:
   - STRIPE_SECRET_KEY
   - STRIPE_WEBHOOK_SECRET
5. Test with Stripe CLI: stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### **4. Resend Email**
```
1. Click "Add Integration" → Select "alias-labs/app"
2. Create Resend account
3. Verify domain (ara.aliaslabs.ai)
4. Environment variables auto-added:
   - RESEND_FROM
   - RESEND_TOKEN
5. Test email sending via API
```

### **5. Sentry Error Monitoring**
```
1. Click "Add Integration" → Select "alias-labs/app"
2. Create Sentry organization/project
3. Configure error tracking settings
4. Environment variables auto-added:
   - SENTRY_ORG
   - SENTRY_PROJECT
   - NEXT_PUBLIC_SENTRY_DSN
5. Test with: throw new Error("Test Sentry integration")
```

## ✅ **VERIFICATION PROCESS**

After setting up each integration:

### **1. Check Environment Variables:**
```bash
cd apps/app
vercel env ls
# Look for real API keys (not placeholders)
```

### **2. Test Integration:**
```bash
# Pull latest environment variables
vercel env pull .env.local

# Test the integration locally
pnpm dev
```

### **3. Verify with Script:**
```bash
./scripts/verify-vercel-integrations.sh
# Should show all variables as configured with real values
```

## 🎯 **EXPECTED OUTCOME**

After completing the marketplace integrations:

- ✅ **Real API Keys**: All 35 variables will have legitimate values
- ✅ **Working Integrations**: Each service will be fully functional
- ✅ **Production Ready**: Platform ready for real deployment
- ✅ **Auto-Configuration**: Environment variables managed by Vercel
- ✅ **Billing Active**: Free tiers activated, upgrade when needed

## 🔄 **POST-SETUP STEPS**

### **1. Update Local Development:**
```bash
cd apps/app
vercel env pull .env.local
pnpm install
pnpm dev
```

### **2. Test Production Deployment:**
```bash
vercel --prod
```

### **3. Monitor Integration Health:**
- Check each service's dashboard
- Monitor error rates in Sentry
- Track analytics in PostHog
- Watch email delivery in Resend

## 📞 **SUPPORT RESOURCES**

Each integration provides:
- **Documentation**: Service-specific setup guides
- **Support Chat**: In-dashboard help
- **Community Forums**: Developer community support
- **Status Pages**: Service availability monitoring

---

## 🏆 **NEXT STEPS**

1. **Start with WorkOS** (critical for authentication)
2. **Set up Convex** (critical for database)
3. **Configure Resend** (critical for email)
4. **Add remaining integrations** based on your needs
5. **Test thoroughly** before production deployment

**All integration pages are open in your browser - start setting them up now!**

---

*This guide replaces all placeholder values with legitimate API keys through Vercel Marketplace integrations.*
