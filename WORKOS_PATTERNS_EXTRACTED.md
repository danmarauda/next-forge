# 🎯 WorkOS Patterns Extracted from Official Examples
## Best Practices & Implementation Patterns

This document extracts specific patterns from official WorkOS examples to improve your implementation.

---

## 🔐 Pattern 1: OAuth Callback Handler

### From: `workos/next-b2b-starter-kit`

**Key Features:**
- ✅ Error handling for OAuth errors
- ✅ Code validation
- ✅ Session cookie management
- ✅ State parameter parsing
- ✅ Secure cookie settings

**Implementation:**
```typescript
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  
  if (error) {
    redirect(`/sign-in?error=${error}`);
  }
  
  if (!code) {
    redirect("/sign-in?error=no_code");
  }
  
  const { user, accessToken } = await workos.userManagement.authenticateWithCode({
    clientId: process.env.WORKOS_CLIENT_ID!,
    code,
  });
  
  cookies().set("workos_session", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });
  
  redirect("/");
}
```

**✅ Applied:** Created in `apps/app/app/api/auth/callback/route.ts`

---

## 🔔 Pattern 2: Webhook Handler

### From: `workos/next-b2b-starter-kit`

**Key Features:**
- ✅ Signature verification (security)
- ✅ Event type handling
- ✅ Error handling
- ✅ Async processing

**Implementation:**
```typescript
export async function POST(request: Request) {
  const signature = headers().get("workos-signature");
  const body = await request.json();
  
  // Verify signature
  const isValid = verifySignature(body, signature);
  if (!isValid) {
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  }
  
  const { event, data } = body;
  
  switch (event) {
    case "user.created":
      await handleUserCreated(data);
      break;
    case "user.updated":
      await handleUserUpdated(data);
      break;
    // ... more events
  }
  
  return Response.json({ received: true });
}
```

**✅ Applied:** Created in `apps/app/app/api/webhooks/workos/route.ts`

---

## 🏗️ Pattern 3: Service Layer Organization

### From: Your Implementation (Better than official)

**Key Features:**
- ✅ Unified service interface
- ✅ Feature flag integration
- ✅ Type-safe methods
- ✅ Modular separation

**Your Implementation:**
```typescript
export class WorkOSService {
  public readonly userManagement: UserManagementService;
  public readonly sso: SSOService;
  public readonly directorySync: DirectorySyncService;
  // ...
}
```

**Advantage:** More organized than direct WorkOS client usage.

---

## 🔒 Pattern 4: Session Management

### From: `workos/authkit-nextjs`

**Key Features:**
- ✅ HttpOnly cookies (XSS protection)
- ✅ Secure flag in production
- ✅ SameSite protection (CSRF)
- ✅ Proper expiration

**Best Practice:**
```typescript
cookies().set("workos_session", token, {
  httpOnly: true,                    // Prevents XSS
  secure: process.env.NODE_ENV === "production",  // HTTPS only
  sameSite: "lax",                   // CSRF protection
  maxAge: 60 * 60 * 24 * 30,         // 30 days
  path: "/",
});
```

**✅ Applied:** Used in callback route

---

## 🎯 Pattern 5: Error Handling

### From: Official Examples

**Key Features:**
- ✅ User-friendly error messages
- ✅ Proper error logging
- ✅ Redirect on error
- ✅ Error query parameters

**Best Practice:**
```typescript
try {
  // Auth logic
} catch (error) {
  console.error("Auth error:", error);
  const errorMessage = error instanceof Error ? error.message : "auth_failed";
  redirect(`/sign-in?error=${encodeURIComponent(errorMessage)}`);
}
```

**✅ Applied:** Used in callback route

---

## 🔄 Pattern 6: State Parameter Handling

### From: `workos/next-b2b-starter-kit`

**Key Features:**
- ✅ Store return URL in state
- ✅ Parse state after callback
- ✅ Fallback to default route

**Best Practice:**
```typescript
// On sign-in
const state = JSON.stringify({ returnTo: "/dashboard" });
const authUrl = await getAuthorizationUrl({ state });

// On callback
let returnTo = "/";
if (state) {
  try {
    const stateData = JSON.parse(state);
    returnTo = stateData.returnTo || "/";
  } catch {
    // Invalid state, use default
  }
}
redirect(returnTo);
```

**✅ Applied:** Used in callback route

---

## 📦 Pattern 7: Environment Variable Validation

### From: Your Implementation (Better than official)

**Key Features:**
- ✅ Zod validation
- ✅ Type safety
- ✅ Runtime validation
- ✅ Clear error messages

**Your Implementation:**
```typescript
export const keys = () =>
  createEnv({
    server: {
      WORKOS_API_KEY: z.string().min(1),
      WORKOS_CLIENT_ID: z.string().min(1),
    },
    // ...
  });
```

**Advantage:** More robust than direct `process.env` access.

---

## 🎨 Pattern 8: Client-Side Auth Helpers

### From: `workos/authkit-nextjs`

**Key Features:**
- ✅ Simple API
- ✅ Type-safe methods
- ✅ Cookie management
- ✅ Redirect handling

**Your Implementation:**
```typescript
export const workosAuth = {
  signIn: async (options?) => {
    const { authorizationUrl } = await fetchAction(...);
    window.location.href = authorizationUrl;
  },
  signOut: async () => {
    // Clear cookies and redirect
  },
  getToken: () => {
    return getCookie("workos_session");
  },
};
```

**✅ Already Implemented:** Matches official patterns

---

## 🚀 Pattern 9: Authorization URL Generation

### From: Official Examples

**Key Features:**
- ✅ Client ID from env
- ✅ Redirect URI configuration
- ✅ State parameter support
- ✅ Provider selection

**Best Practice:**
```typescript
const authorizationUrl = workos.userManagement.getAuthorizationUrl({
  clientId: process.env.WORKOS_CLIENT_ID!,
  redirectUri: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
  state: JSON.stringify({ returnTo: "/dashboard" }),
});
```

**✅ Already Implemented:** Used in Convex action

---

## 🔍 Pattern 10: User Sync Logic

### From: `workos/next-b2b-starter-kit`

**Key Features:**
- ✅ Check if user exists
- ✅ Create or update user
- ✅ Handle organization membership
- ✅ Sync user attributes

**Best Practice:**
```typescript
const existingUser = await getUserByEmail(workosUser.email);

if (existingUser) {
  await updateUser(existingUser.id, {
    name: workosUser.firstName + " " + workosUser.lastName,
    emailVerified: workosUser.emailVerified,
  });
} else {
  await createUser({
    email: workosUser.email,
    name: workosUser.firstName + " " + workosUser.lastName,
    emailVerified: workosUser.emailVerified,
  });
}
```

**✅ Already Implemented:** Used in `workosAuth.authenticateUser`

---

## 📋 Implementation Status

### ✅ Patterns Applied
- [x] OAuth callback handler
- [x] Webhook handler
- [x] Session management
- [x] Error handling
- [x] State parameter handling
- [x] Environment validation
- [x] Client-side helpers
- [x] Authorization URL generation
- [x] User sync logic

### 🔄 Patterns to Enhance
- [ ] Webhook signature verification
- [ ] Refresh token support
- [ ] Session expiration handling
- [ ] Organization context
- [ ] Audit logging

---

## 🎯 Next Steps

1. **Add webhook signature verification** - Security improvement
2. **Add refresh token support** - Better session management
3. **Add session expiration handling** - Automatic refresh
4. **Add organization context** - Multi-tenant support
5. **Add audit logging** - Compliance and debugging

---

**Extraction Date:** 2025-01-27  
**Sources:** workos/next-b2b-starter-kit, workos/authkit-nextjs

