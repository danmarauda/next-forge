# Next-Forge + Convex + WorkOS Merge Status

## Overview

This document tracks the progress of merging three repositories into the next-forge monorepo:

1. **next-forge** - Production-grade Turborepo monorepo template (base)
2. **alias-enterprise-better-convex** - Convex backend with Better Auth
3. **nodebench-enterprise** - Advanced features with WorkOS, Liveblocks, ElevenLabs

## Merge Strategy

### Authentication: WorkOS Only ✅
- **Removed**: Clerk (from next-forge), Better Auth (from alias-enterprise-better-convex)
- **Using**: WorkOS AuthKit (from nodebench-enterprise)
- **Rationale**: Enterprise-grade SSO, Directory Sync, and Admin Portal capabilities

### Database: Convex ✅
- **Removed**: Prisma + Neon PostgreSQL
- **Using**: Convex with Convex Ents for relationships
- **Location**: `packages/database/`

### Additional Features (Pending)
- **Liveblocks**: Collaborative editing
- **ElevenLabs**: Voice transcription and AI
- **Advanced UI**: Additional shadcn/ui components
- **Documents/Chat**: Collaborative features

---

## ✅ Completed Work

### 1. Database Package Migration
**Status**: ✅ Complete

**Changes Made**:
- ✅ Removed Prisma dependencies (`@prisma/client`, `@prisma/adapter-neon`, `@neondatabase/serverless`)
- ✅ Added Convex dependencies:
  - `convex@1.29.0`
  - `convex-ents@^0.16.0`
  - `convex-helpers@0.1.104`
  - `@convex-dev/aggregate@^0.1.25`
  - `@convex-dev/rate-limiter@^0.3.0`
  - `@convex-dev/react-query@0.0.0-alpha.11`
  - `@convex-dev/resend@^0.1.13`
  - `@workos-inc/node@^7.72.2`
- ✅ Copied entire `convex/` directory from alias-enterprise-better-convex
- ✅ Updated `packages/database/package.json` scripts:
  - `analyze`: `convex dev --until-success`
  - `build`: `convex deploy --cmd 'echo Build complete'`
  - `dev`: `convex dev`
- ✅ Created new `packages/database/index.ts` exporting Convex API
- ✅ Created `packages/database/client.ts` for client-side usage
- ✅ Updated `packages/database/keys.ts` for Convex environment variables

**Files Modified**:
- `packages/database/package.json`
- `packages/database/index.ts`
- `packages/database/client.ts`
- `packages/database/keys.ts`

**Files Added**:
- `packages/database/convex/` (entire directory from alias-enterprise-better-convex)

**Files Removed**:
- `packages/database/prisma/`
- `packages/database/generated/`

### 2. WorkOS Authentication Integration
**Status**: ✅ Complete (Backend)

**Changes Made**:
- ✅ Removed Better Auth dependencies (`better-auth`, `better-auth-convex`, `@convex-dev/better-auth`)
- ✅ Added WorkOS dependency (`@workos-inc/node@^7.72.2`)
- ✅ Copied WorkOS backend files from nodebench-enterprise:
  - `packages/database/convex/workos.ts` - WorkOS client initialization
  - `packages/database/convex/workosAuth.ts` - Auth queries/actions
  - `packages/database/convex/workosInternal.ts` - Internal mutations

**WorkOS Features Available**:
- ✅ User authentication with AuthKit
- ✅ Session management
- ✅ Organization support
- ✅ Webhook handling
- ✅ Admin role assignment
- 🔄 SSO (requires configuration)
- 🔄 Directory Sync (requires configuration)
- 🔄 Audit Logs (requires configuration)

---

### 3. Update Apps to Use Convex
**Status**: ✅ Complete

**Changes Made**:
- ✅ Created `apps/app/components/convex-provider.tsx` - Convex client provider
- ✅ Updated `apps/app/app/layout.tsx` - Added ConvexClientProvider
- ✅ Updated `apps/app/app/(authenticated)/page.tsx` - Removed Prisma, added TodoList component
- ✅ Updated `apps/app/app/(authenticated)/search/page.tsx` - Removed Prisma, added SearchResults component
- ✅ Updated `apps/api/app/cron/keep-alive/route.ts` - Simplified to health check (Convex has built-in cron)
- ✅ Created placeholder components for todos and search (ready for auth integration)

**Files Modified**:
- `apps/app/app/layout.tsx`
- `apps/app/app/(authenticated)/page.tsx`
- `apps/app/app/(authenticated)/search/page.tsx`
- `apps/api/app/cron/keep-alive/route.ts`

**Files Added**:
- `apps/app/components/convex-provider.tsx`
- `apps/app/app/(authenticated)/components/todo-list.tsx`
- `apps/app/app/(authenticated)/search/components/search-results.tsx`

### 4. Port Frontend Auth Components
**Status**: ✅ Complete

**Changes Made**:
- ✅ Created `packages/auth/src/` directory structure
- ✅ Copied WorkOS client files from nodebench-enterprise:
  - `packages/auth/src/workos-client.ts` - Client-side auth helpers
  - `packages/auth/src/workos-rsc.tsx` - Server component auth helpers
  - `packages/auth/src/components/authenticated.tsx` - Auth guard component
  - `packages/auth/src/components/workos-provider.tsx` - Auth provider
  - `packages/auth/src/components/workos-sign-form.tsx` - Login form
- ✅ Updated `packages/auth/package.json` - Removed Clerk, added WorkOS + Convex
- ✅ Updated `packages/auth/keys.ts` - WorkOS environment variables
- ✅ Created `packages/auth/index.ts` - Main exports

**Files Modified**:
- `packages/auth/package.json`
- `packages/auth/keys.ts`

**Files Added**:
- `packages/auth/index.ts`
- `packages/auth/src/workos-client.ts`
- `packages/auth/src/workos-rsc.tsx`
- `packages/auth/src/components/authenticated.tsx`
- `packages/auth/src/components/workos-provider.tsx`
- `packages/auth/src/components/workos-sign-form.tsx`

**Files Removed** (to be cleaned up):
- Old Clerk components in `packages/auth/components/`
- `packages/auth/client.ts` (Clerk)
- `packages/auth/middleware.ts` (Clerk)
- `packages/auth/provider.tsx` (Clerk)
- `packages/auth/server.ts` (Clerk)

### 5. Liveblocks Integration
**Status**: ✅ Complete (Package Created)

**Changes Made**:
- ✅ Created `packages/liveblocks/` package
- ✅ Copied `liveblocks.config.ts` from nodebench-enterprise
- ✅ Created `packages/liveblocks/package.json` with all dependencies:
  - `@liveblocks/client@^3.10.0`
  - `@liveblocks/node@^3.10.0`
  - `@liveblocks/react@^3.10.0`
  - `@liveblocks/react-tiptap@^3.10.0`
  - `@liveblocks/react-ui@^3.10.0`
  - All Tiptap extensions for rich text editing
  - `yjs@^13.6.27` and `y-prosemirror@^1.3.7` for CRDT
- ✅ Created `packages/liveblocks/index.ts` - Main exports
- ✅ Created `packages/liveblocks/tsconfig.json`
- ✅ Installed all dependencies successfully

**Files Added**:
- `packages/liveblocks/package.json`
- `packages/liveblocks/index.ts`
- `packages/liveblocks/tsconfig.json`
- `packages/liveblocks/liveblocks.config.ts`

**Next Steps for Liveblocks**:
- [ ] Copy Liveblocks auth endpoint from nodebench-enterprise
- [ ] Copy collaborative document components
- [ ] Create documents app or integrate into existing app

---

## 🔄 In Progress
- [ ] Update environment variables

**Current Prisma Usage**:
1. `apps/app/app/(authenticated)/page.tsx` - `database.page.findMany()`
2. `apps/app/app/(authenticated)/search/page.tsx` - `database.page.findMany({ where: { name: { contains: q } } })`
3. `apps/api/app/cron/keep-alive/route.ts` - `database.page.create()` and `database.page.delete()`

### 4. Port Frontend Auth Components
**Status**: 🔄 Not Started

**Required Changes**:
- [ ] Copy WorkOS auth components from nodebench-enterprise:
  - `src/lib/convex/workos-client.ts`
  - `src/lib/convex/workos-rsc.tsx`
  - `src/lib/convex/components/workos-provider.tsx`
  - `src/lib/convex/components/workos-sign-form.tsx`
  - `src/lib/convex/components/authenticated.tsx`
- [ ] Remove Clerk components from `packages/auth/`
- [ ] Update auth routes in apps

---

## 📋 Remaining Tasks

### High Priority

1. **Update Root Configuration**
   - [ ] Update `turbo.json` to replace Prisma outputs with Convex
   - [ ] Update root `package.json` scripts (remove `migrate`, add Convex scripts)
   - [ ] Update `.env.example` files with Convex/WorkOS variables

2. **Remove Prisma Artifacts**
   - [ ] Delete `packages/database/prisma/`
   - [ ] Delete `apps/studio/` (Prisma Studio)
   - [ ] Clean up Prisma generated files

3. **Port Liveblocks Integration**
   - [ ] Copy Liveblocks setup from nodebench-enterprise
   - [ ] Add collaborative editing features
   - [ ] Configure Liveblocks authentication

4. **Port ElevenLabs Integration**
   - [ ] Copy ElevenLabs voice features
   - [ ] Add voice transcription API routes
   - [ ] Configure ElevenLabs API keys

5. **Port Advanced UI Components**
   - [ ] Copy additional shadcn/ui components
   - [ ] Port custom components from nodebench-enterprise
   - [ ] Update component library

6. **Port Documents/Chat Features**
   - [ ] Copy collaborative documents functionality
   - [ ] Copy chat features
   - [ ] Integrate with Liveblocks

### Medium Priority

7. **Testing**
   - [ ] Run development servers
   - [ ] Test authentication flow
   - [ ] Test database operations
   - [ ] Run TypeScript checks
   - [ ] Update existing tests

8. **Documentation**
   - [ ] Update main README
   - [ ] Update database documentation
   - [ ] Update auth documentation
   - [ ] Create migration guide

---

## Environment Variables

### Required Convex Variables
```env
# Convex
CONVEX_DEPLOYMENT=your-deployment-name
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# WorkOS
WORKOS_API_KEY=sk_test_...
WORKOS_CLIENT_ID=client_...
WORKOS_REDIRECT_URI=http://localhost:3000/auth/callback
ADMIN=admin@example.com,another@example.com

# Resend (for emails)
RESEND_API_KEY=re_...
```

### Optional Variables (for advanced features)
```env
# Liveblocks
NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=pk_...
LIVEBLOCKS_SECRET_KEY=sk_...

# ElevenLabs
ELEVENLABS_API_KEY=...

# Polar (payments)
POLAR_ACCESS_TOKEN=...
```

---

## Key Architectural Decisions

### 1. Monorepo Structure Preserved
- Kept next-forge's Turborepo structure
- Database package now exports Convex instead of Prisma
- Auth package will export WorkOS instead of Clerk

### 2. Convex Backend Patterns
- Using custom function wrappers (`createAuthQuery`, `createAuthMutation`, etc.)
- Pre-loaded `ctx.user` in authenticated contexts
- Rate limiting with tier-based limits (free/premium)
- Soft delete support via Convex Ents
- Full-text search indexes

### 3. WorkOS Authentication
- Enterprise-grade SSO capabilities
- Directory Sync for user provisioning
- Admin Portal for self-service
- Webhook-based event handling
- Session management via Convex

---

## Next Steps

1. **Immediate**: Update apps to use Convex queries
2. **Short-term**: Port frontend auth components
3. **Medium-term**: Add Liveblocks, ElevenLabs, advanced UI
4. **Long-term**: Testing, documentation, deployment

---

## Notes

- All Convex backend files are in `packages/database/convex/`
- WorkOS auth backend is ready, frontend components pending
- Prisma artifacts still exist but are not used
- Clerk packages still installed but will be removed
- Better Auth completely removed from dependencies

---

**Last Updated**: 2025-11-12
**Status**: Phase 1 Complete (Database + Auth Backend)

