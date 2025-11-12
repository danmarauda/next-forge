# 📚 WorkOS + Next.js Monorepo Reference Examples
## Comprehensive Guide Based on Real-World Implementations

This document compiles reference examples and best practices for integrating WorkOS with Next.js in a monorepo setup.

---

## 🎯 Official WorkOS Examples

### 1. WorkOS Next.js B2B Starter Kit ⭐ **RECOMMENDED**
**Repository:** `workos/next-b2b-starter-kit`  
**Link:** https://github.com/workos/next-b2b-starter-kit  
**Live Demo:** https://next-b2b-starter-kit.vercel.app  
**Stars:** 33 ⭐

**Key Features:**
- ✅ Full B2B SaaS template
- ✅ Next.js App Router
- ✅ WorkOS AuthKit integration
- ✅ Organization management
- ✅ Stripe billing integration
- ✅ Convex backend
- ✅ Enterprise-ready

**Structure:**
```
next-b2b-starter-kit/
├── convex/              # Convex backend
├── src/
│   ├── app/             # Next.js App Router
│   │   ├── (auth)/
│   │   │   └── callback/
│   │   ├── (dashboard)/
│   │   └── api/
│   │       └── webhooks/
│   ├── components/
│   │   └── auth/
│   └── lib/
│       └── workos.ts
├── scripts/             # Setup scripts
└── public/
```

**Environment Variables:**
```bash
WORKOS_API_KEY=sk_...
WORKOS_CLIENT_ID=client_...
WORKOS_REDIRECT_URI=http://localhost:3000/auth/callback
NEXT_PUBLIC_WORKOS_CLIENT_ID=client_...
```

**Key Files to Study:**
- `src/lib/workos.ts` - WorkOS client setup
- `src/app/(auth)/callback/route.ts` - OAuth callback handler
- `convex/` - Backend schema and functions

### 2. WorkOS AuthKit Next.js Library ⭐ **OFFICIAL SDK**
**Repository:** `workos/authkit-nextjs`  
**Link:** https://github.com/workos/authkit-nextjs  
**Stars:** 94 ⭐  
**Forks:** 35

**Key Features:**
- ✅ Official WorkOS Next.js library
- ✅ Convenient helpers for authentication
- ✅ Session management utilities
- ✅ TypeScript support
- ✅ Well-documented

**Usage:**
```typescript
import { signIn, signOut, getSession } from '@workos-inc/authkit-nextjs';

// Sign in
await signIn();

// Get session
const session = await getSession();

// Sign out
await signOut();
```

### 3. WorkOS Node SDK
**Repository:** `workos/workos-node`  
**Link:** https://github.com/workos/workos-node  
**Stars:** 140 ⭐

**Key Features:**
- ✅ Official Node.js SDK
- ✅ Full WorkOS API coverage
- ✅ TypeScript support
- ✅ Well-maintained

**Usage:**
```typescript
import { WorkOS } from '@workos-inc/node';

const workos = new WorkOS(process.env.WORKOS_API_KEY!);

// User management
const user = await workos.userManagement.getUser(userId);

// SSO
const authUrl = workos.sso.getAuthorizationUrl({...});

// Directory Sync
const directories = await workos.directorySync.listDirectories();
```

---

## 🏗️ Monorepo Examples

### 1. Turborepo + Next.js Examples

#### Example 1: Basic Turborepo Setup
**Repository:** `Riley-Brown/turbo-repo-express-next-example`  
**Link:** https://github.com/Riley-Brown/turbo-repo-express-next-example

**Structure:**
```
turbo-repo-express-next-example/
├── apps/
│   ├── front-end/      # Next.js app
│   └── back-end/       # Express API
├── packages/
│   └── shared/         # Shared utilities
└── turbo.json
```

**Key Learnings:**
- Separate apps for frontend and backend
- Shared packages for common code
- Turborepo for build orchestration

#### Example 2: Advanced Turborepo Setup
**Repository:** `tiesen243/create-yuki-turbo`  
**Link:** https://github.com/tiesen243/create-yuki-turbo

**Structure:**
```
create-yuki-turbo/
├── apps/
│   ├── web/            # Next.js app
│   └── docs/           # Documentation
├── packages/
│   ├── api/            # tRPC API
│   ├── db/             # Database
│   ├── ui/             # UI components
│   └── config/         # Shared configs
└── tooling/
    └── eslint/         # ESLint config
```

**Key Learnings:**
- Type-safe API with tRPC
- Shared UI components
- Centralized configuration
- Tooling packages

---

## 🔧 WorkOS Integration Patterns

### Pattern 1: Service Layer (Recommended)

```typescript
// packages/workos-service/src/workos-service.ts
import { WorkOS } from "@workos-inc/node";

export class WorkOSService {
  private client: WorkOS;
  
  constructor(apiKey: string) {
    this.client = new WorkOS(apiKey);
  }
  
  async getAuthorizationUrl(options: {
    redirectUri: string;
    state?: string;
  }): Promise<string> {
    return this.client.userManagement.getAuthorizationUrl({
      clientId: process.env.WORKOS_CLIENT_ID!,
      redirectUri: options.redirectUri,
      state: options.state,
    });
  }
}
```

### Pattern 2: API Routes

```typescript
// apps/app/app/api/auth/workos/authorize/route.ts
import { WorkOS } from "@workos-inc/node";

export async function GET(request: Request) {
  const workos = new WorkOS(process.env.WORKOS_API_KEY!);
  const { searchParams } = new URL(request.url);
  
  const authorizationUrl = workos.userManagement.getAuthorizationUrl({
    clientId: process.env.WORKOS_CLIENT_ID!,
    redirectUri: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    state: searchParams.get("state") || undefined,
  });
  
  return Response.redirect(authorizationUrl);
}
```

### Pattern 3: Server Components

```typescript
// apps/app/app/(auth)/sign-in/page.tsx
import { WorkOSService } from "@repo/workos-service";

export default async function SignInPage() {
  const workos = new WorkOSService(process.env.WORKOS_API_KEY!);
  
  const authUrl = await workos.getAuthorizationUrl({
    redirectUri: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
  });
  
  return (
    <div>
      <a href={authUrl}>Sign in with WorkOS</a>
    </div>
  );
}
```

---

## 📦 Package Structure Examples

### Example 1: Auth Package

```
packages/auth/
├── src/
│   ├── workos-client.ts      # Client-side utilities
│   ├── workos-rsc.tsx        # Server-side helpers
│   └── components/
│       ├── workos-provider.tsx
│       └── workos-sign-form.tsx
├── index.ts
└── package.json
```

### Example 2: WorkOS Service Package

```
packages/workos-service/
├── src/
│   ├── workos-service.ts     # Main service class
│   ├── services/
│   │   ├── user-management.ts
│   │   ├── sso.ts
│   │   ├── directory-sync.ts
│   │   └── audit-logs.ts
│   └── types.ts
├── hooks.ts                   # React hooks
├── config.ts                  # Configuration
└── index.ts
```

---

## 🔐 Environment Variable Patterns

### Pattern 1: Centralized Validation

```typescript
// packages/auth/keys.ts
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const keys = () =>
  createEnv({
    server: {
      WORKOS_API_KEY: z.string().min(1),
      WORKOS_CLIENT_ID: z.string().min(1),
      WORKOS_REDIRECT_URI: z.string().url(),
    },
    client: {
      NEXT_PUBLIC_WORKOS_CLIENT_ID: z.string().min(1),
    },
    runtimeEnv: {
      WORKOS_API_KEY: process.env.WORKOS_API_KEY,
      WORKOS_CLIENT_ID: process.env.WORKOS_CLIENT_ID,
      WORKOS_REDIRECT_URI: process.env.WORKOS_REDIRECT_URI,
      NEXT_PUBLIC_WORKOS_CLIENT_ID: process.env.NEXT_PUBLIC_WORKOS_CLIENT_ID,
    },
  });
```

### Pattern 2: App-Level Validation

```typescript
// apps/app/env.ts
import { keys as auth } from "@repo/auth/keys";
import { createEnv } from "@t3-oss/env-nextjs";

export const env = createEnv({
  extends: [auth()],
  server: {},
  client: {},
  runtimeEnv: {},
});
```

---

## 🚀 Setup Scripts

### Example: Programmatic Setup

```typescript
// scripts/setup-workos.ts
import { WorkOS } from "@workos-inc/node";

async function setupWorkOS() {
  const workos = new WorkOS(process.env.WORKOS_API_KEY!);
  
  // Create organization
  const org = await workos.organizations.createOrganization({
    name: "My Organization",
  });
  
  // Create user
  const user = await workos.userManagement.createUser({
    email: "admin@example.com",
    emailVerified: true,
  });
  
  console.log("✅ WorkOS setup complete");
  console.log(`Organization: ${org.id}`);
  console.log(`User: ${user.id}`);
}
```

---

## 📝 Best Practices

### 1. Service Layer Organization
- ✅ Create a unified WorkOS service package
- ✅ Separate concerns (auth, SSO, directory sync)
- ✅ Use feature flags for gradual rollout

### 2. Environment Variables
- ✅ Validate with Zod schemas
- ✅ Use @t3-oss/env-nextjs for type safety
- ✅ Separate server and client variables

### 3. Error Handling
- ✅ Check service availability before use
- ✅ Provide clear error messages
- ✅ Log errors for debugging

### 4. Type Safety
- ✅ Use TypeScript throughout
- ✅ Define interfaces for WorkOS types
- ✅ Export types from service packages

---

## 🔗 Additional Resources

- [WorkOS Documentation](https://workos.com/docs)
- [WorkOS API Reference](https://workos.com/docs/reference)
- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Turborepo Documentation](https://turbo.build/repo/docs)

---

**Last Updated:** 2025-01-27  
**Sources:** NIA Research, GitHub Repositories, WorkOS Official Examples

