# Migration Guide: Next-Forge + Convex + WorkOS

This guide explains the major changes from the original next-forge template and how to get started with the new stack.

## 🔄 What Changed

### Database: Prisma + Neon → Convex

**Before:**
```typescript
import { database } from "@repo/database";

const pages = await database.page.findMany();
```

**After:**
```typescript
import { api } from "@repo/database";
import { useQuery } from "convex/react";

// Client-side
const todos = useQuery(api.todos.list);

// Server-side
import { fetchQuery } from "convex/nextjs";
const todos = await fetchQuery(api.todos.list);
```

### Authentication: Clerk → WorkOS

**Before:**
```typescript
import { auth } from "@repo/auth/server";

const { userId } = await auth();
```

**After:**
```typescript
import { getCurrentUser } from "@repo/auth";

const user = await getCurrentUser();
```

### New Features Added

1. **Liveblocks** - Real-time collaborative editing
2. **ElevenLabs** - Voice transcription and AI
3. **WorkOS** - Enterprise SSO, Directory Sync, Admin Portal

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Convex

```bash
# Install Convex CLI globally
npm install -g convex

# Initialize Convex (creates deployment)
cd packages/database
convex dev
```

This will:
- Create a new Convex deployment
- Generate `CONVEX_DEPLOYMENT` and `NEXT_PUBLIC_CONVEX_URL`
- Start the Convex dev server

### 3. Set Up WorkOS

1. Sign up at [workos.com](https://workos.com)
2. Create a new organization
3. Get your API key and Client ID
4. Configure redirect URI: `http://localhost:3000/api/auth/callback`

### 4. Configure Environment Variables

Create `.env.local` in your app directory:

```bash
# Convex (from step 2)
CONVEX_DEPLOYMENT="your-deployment-name"
NEXT_PUBLIC_CONVEX_URL="https://your-deployment.convex.cloud"

# WorkOS (from step 3)
WORKOS_API_KEY="sk_test_..."
WORKOS_CLIENT_ID="client_..."
WORKOS_REDIRECT_URI="http://localhost:3000/api/auth/callback"
NEXT_PUBLIC_WORKOS_CLIENT_ID="client_..."
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Admin users (your email)
ADMIN="your-email@example.com"

# Optional: Liveblocks
LIVEBLOCKS_SECRET_KEY="sk_..."
NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY="pk_..."

# Optional: ElevenLabs
ELEVENLABS_API_KEY="..."

# Keep your existing keys for:
# - Stripe
# - Resend
# - Analytics
# etc.
```

### 5. Seed the Database (Optional)

```bash
cd packages/database
convex run init:seed
```

### 6. Start Development

```bash
# Terminal 1: Convex dev server
pnpm convex:dev

# Terminal 2: Next.js apps
pnpm dev
```

---

## 📦 Package Structure

### New Packages

- **`@repo/database`** - Convex backend with schema, queries, mutations
- **`@repo/auth`** - WorkOS authentication
- **`@repo/liveblocks`** - Collaborative editing
- **`@repo/elevenlabs`** - Voice AI

### Removed Packages

- **`apps/studio`** - Prisma Studio (replaced by Convex Dashboard)

---

## 🔧 Convex Patterns

### Schema Definition

```typescript
// packages/database/convex/schema.ts
import { defineEnt, defineEntSchema } from 'convex-ents';

const schema = defineEntSchema({
  todos: defineEnt({
    title: v.string(),
    completed: v.boolean(),
  })
    .edge('user', { to: 'user' })
    .index('completed', ['completed']),
});
```

### Queries

```typescript
// packages/database/convex/todos.ts
import { createAuthQuery } from './functions';

export const list = createAuthQuery({
  handler: async (ctx) => {
    return await ctx.table('todos')
      .filter(q => q.eq(q.field('userId'), ctx.user._id))
      .collect();
  },
});
```

### Mutations

```typescript
import { createAuthMutation } from './functions';

export const create = createAuthMutation({
  args: { title: v.string() },
  handler: async (ctx, { title }) => {
    return await ctx.table('todos').insert({
      title,
      completed: false,
      userId: ctx.user._id,
    });
  },
});
```

### Using in Components

```typescript
"use client";

import { api } from "@repo/database";
import { useQuery, useMutation } from "convex/react";

export function TodoList() {
  const todos = useQuery(api.todos.list);
  const createTodo = useMutation(api.todos.create);

  return (
    <div>
      {todos?.map(todo => (
        <div key={todo._id}>{todo.title}</div>
      ))}
      <button onClick={() => createTodo({ title: "New todo" })}>
        Add Todo
      </button>
    </div>
  );
}
```

---

## 🔐 WorkOS Authentication

### Login Flow

1. User clicks "Sign In"
2. Redirected to WorkOS AuthKit
3. After authentication, redirected back to your app
4. Session created in Convex

### Protected Routes

```typescript
import { Authenticated } from "@repo/auth";

export default function ProtectedPage() {
  return (
    <Authenticated>
      <YourContent />
    </Authenticated>
  );
}
```

### Server-Side Auth

```typescript
import { getCurrentUser } from "@repo/auth";

export default async function Page() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/login");
  }

  return <div>Hello {user.name}</div>;
}
```

---

## 🎨 Liveblocks Collaboration

### Setup

1. Sign up at [liveblocks.io](https://liveblocks.io)
2. Get your public and secret keys
3. Add to `.env.local`

### Usage

```typescript
import { RoomProvider } from "@repo/liveblocks";

export function CollaborativeEditor({ documentId }) {
  return (
    <RoomProvider id={documentId}>
      <Editor />
    </RoomProvider>
  );
}
```

---

## 🎤 ElevenLabs Voice

### Setup

1. Sign up at [elevenlabs.io](https://elevenlabs.io)
2. Get your API key
3. Add to `.env.local`

### Usage

```typescript
import { VoiceInput } from "@repo/elevenlabs";

export function MyForm() {
  return (
    <VoiceInput
      onTranscript={(text) => console.log(text)}
    />
  );
}
```

---

## 📚 Resources

- [Convex Documentation](https://docs.convex.dev)
- [WorkOS Documentation](https://workos.com/docs)
- [Liveblocks Documentation](https://liveblocks.io/docs)
- [ElevenLabs Documentation](https://elevenlabs.io/docs)

---

## 🆘 Troubleshooting

### Convex not connecting

1. Check `NEXT_PUBLIC_CONVEX_URL` is set
2. Ensure Convex dev server is running
3. Check browser console for errors

### WorkOS authentication failing

1. Verify redirect URI matches exactly
2. Check API key and Client ID
3. Ensure user email is in ADMIN list (for first login)

### Build errors

1. Run `pnpm clean` and `pnpm install`
2. Delete `.next` folders
3. Restart dev servers

---

## 🎯 Next Steps

1. Explore the Convex schema in `packages/database/convex/schema.ts`
2. Check out example queries in `packages/database/convex/todos.ts`
3. Set up WorkOS authentication
4. Try the collaborative features with Liveblocks
5. Experiment with voice input using ElevenLabs

