# Next-Forge: Enterprise Edition

> **Production-grade monorepo template with Convex, WorkOS, Liveblocks, and ElevenLabs**

This is an enhanced version of [next-forge](https://github.com/haydenbleasel/next-forge) with enterprise features merged from multiple repositories.

## 🚀 What's New

This template combines the best of three repositories:

1. **next-forge** - Production-grade Turborepo monorepo
2. **alias-enterprise-better-convex** - Convex backend with advanced patterns
3. **nodebench-enterprise** - Enterprise features (WorkOS, Liveblocks, ElevenLabs)

### Key Upgrades

- 🔄 **Convex** instead of Prisma + Neon PostgreSQL
- 🔐 **WorkOS** instead of Clerk (Enterprise SSO, Directory Sync)
- 🤝 **Liveblocks** for real-time collaboration
- 🎤 **ElevenLabs** for voice AI features

## 📦 Tech Stack

### Core
- **Next.js 16.0.0** with React 19.2.0
- **Turborepo 2.5.8** monorepo
- **TypeScript 5.9.3** strict mode
- **pnpm 10.19.0** package manager

### Backend & Database
- **Convex 1.29.0** - Serverless backend
- **Convex Ents** - Entity relationships
- **Rate Limiting** - Tier-based limits
- **Aggregates** - O(log n) counting

### Authentication
- **WorkOS AuthKit** - Enterprise auth
- **SSO Support** - SAML, OIDC, OAuth
- **Directory Sync** - SCIM integration
- **Admin Portal** - Self-service

### Collaboration
- **Liveblocks 3.10.0** - Real-time editing
- **Tiptap** - Rich text editor
- **YJS** - CRDT for conflict resolution

### Voice AI
- **ElevenLabs 2.23.0** - Voice transcription
- **Voice Components** - Ready-to-use UI

### Payments & Email
- **Stripe** - Payments
- **Resend** - Transactional email
- **React Email** - Email templates

### UI & Design
- **shadcn/ui** - Component library
- **Tailwind CSS v4** - Styling
- **Radix UI** - Primitives
- **Lucide** - Icons

### Developer Experience
- **Biome** - Linting & formatting
- **Vitest** - Testing
- **Storybook** - Component development
- **Lefthook** - Git hooks

## 🏗️ Monorepo Structure

```
next-forge/
├── apps/
│   ├── app/          # Main application
│   ├── web/          # Marketing site
│   ├── api/          # API routes
│   ├── docs/         # Documentation
│   ├── email/        # Email templates
│   └── storybook/    # Component library
├── packages/
│   ├── database/     # 🆕 Convex backend
│   ├── auth/         # 🆕 WorkOS authentication
│   ├── liveblocks/   # 🆕 Collaboration
│   ├── elevenlabs/   # 🆕 Voice AI
│   ├── design-system/
│   ├── analytics/
│   ├── payments/
│   ├── email/
│   └── ... (20+ packages)
└── tooling/
    └── typescript-config/
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm 10.19.0
- Convex CLI

### 1. Clone & Install

```bash
git clone <your-repo>
cd next-forge
pnpm install
```

### 2. Set Up Convex

```bash
# Install Convex CLI
npm install -g convex

# Initialize Convex
cd packages/database
convex dev
```

This creates a deployment and gives you:
- `CONVEX_DEPLOYMENT`
- `NEXT_PUBLIC_CONVEX_URL`

### 3. Set Up WorkOS

1. Sign up at [workos.com](https://workos.com)
2. Create an organization
3. Get your credentials:
   - `WORKOS_API_KEY`
   - `WORKOS_CLIENT_ID`
4. Set redirect URI: `http://localhost:3000/api/auth/callback`

### 4. Configure Environment

Create `apps/app/.env.local`:

```bash
# Convex
CONVEX_DEPLOYMENT="your-deployment"
NEXT_PUBLIC_CONVEX_URL="https://your-deployment.convex.cloud"

# WorkOS
WORKOS_API_KEY="sk_test_..."
WORKOS_CLIENT_ID="client_..."
WORKOS_REDIRECT_URI="http://localhost:3000/api/auth/callback"
NEXT_PUBLIC_WORKOS_CLIENT_ID="client_..."
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Admin (your email)
ADMIN="your-email@example.com"

# Optional: Liveblocks
LIVEBLOCKS_SECRET_KEY="sk_..."
NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY="pk_..."

# Optional: ElevenLabs
ELEVENLABS_API_KEY="..."

# Keep existing: Stripe, Resend, etc.
```

### 5. Start Development

```bash
# Terminal 1: Convex backend
pnpm convex:dev

# Terminal 2: Next.js apps
pnpm dev
```

Visit:
- App: http://localhost:3000
- Web: http://localhost:3001
- API: http://localhost:3002
- Docs: http://localhost:3004

## 📚 Documentation

- **[Migration Guide](./MIGRATION_GUIDE.md)** - Detailed migration from Prisma/Clerk
- **[Merge Complete](./MERGE_COMPLETE.md)** - Full merge summary
- **[Merge Status](./MERGE_STATUS.md)** - Detailed progress tracking

### External Docs
- [Convex Docs](https://docs.convex.dev)
- [WorkOS Docs](https://workos.com/docs)
- [Liveblocks Docs](https://liveblocks.io/docs)
- [ElevenLabs Docs](https://elevenlabs.io/docs)

## 🎯 Key Features

### Convex Backend

```typescript
// Define schema with relationships
const schema = defineEntSchema({
  todos: defineEnt({
    title: v.string(),
    completed: v.boolean(),
  }).edge('user', { to: 'user' }),
});

// Type-safe queries
export const list = createAuthQuery({
  handler: async (ctx) => {
    return await ctx.table('todos').collect();
  },
});

// Use in components
const todos = useQuery(api.todos.list);
```

### WorkOS Authentication

```typescript
// Protected routes
<Authenticated>
  <YourContent />
</Authenticated>

// Server-side auth
const user = await getCurrentUser();
```

### Liveblocks Collaboration

```typescript
<RoomProvider id={documentId}>
  <CollaborativeEditor />
</RoomProvider>
```

### ElevenLabs Voice

```typescript
<VoiceInput
  onTranscript={(text) => handleTranscript(text)}
/>
```

## 🛠️ Available Scripts

```bash
# Development
pnpm dev              # Start all apps
pnpm convex:dev       # Start Convex backend

# Building
pnpm build            # Build all apps
pnpm convex:deploy    # Deploy Convex

# Code Quality
pnpm check            # Lint code
pnpm fix              # Fix linting issues
pnpm test             # Run tests

# Maintenance
pnpm clean            # Clean node_modules
pnpm bump-deps        # Update dependencies
pnpm bump-ui          # Update shadcn/ui
```

## 📦 Packages

### New Packages

- `@repo/database` - Convex backend
- `@repo/auth` - WorkOS authentication
- `@repo/liveblocks` - Real-time collaboration
- `@repo/elevenlabs` - Voice AI

### Existing Packages

- `@repo/design-system` - UI components
- `@repo/analytics` - Analytics providers
- `@repo/payments` - Stripe integration
- `@repo/email` - Email templates
- `@repo/cms` - BaseHub CMS
- `@repo/feature-flags` - Vercel Flags
- `@repo/internationalization` - i18n
- ... and 15+ more

## 🔐 Environment Variables

See `.env.example` files in:
- `apps/app/.env.example`
- `packages/database/.env.example`

Required:
- Convex deployment URL
- WorkOS credentials
- Admin email

Optional:
- Liveblocks keys
- ElevenLabs API key
- Stripe keys
- Analytics keys

## 🚢 Deployment

### Vercel (Recommended)

1. Connect your repository
2. Set environment variables
3. Deploy!

Vercel automatically:
- Builds all apps
- Deploys Convex backend
- Sets up preview deployments

### Other Platforms

Works with any platform supporting Next.js:
- Netlify
- Railway
- Render
- Self-hosted

## 🤝 Contributing

This is a template repository. Fork it and make it your own!

## 📄 License

MIT

## 🙏 Credits

Built on top of:
- [next-forge](https://github.com/haydenbleasel/next-forge) by Hayden Bleasel
- Convex backend patterns
- WorkOS enterprise features
- Liveblocks collaboration
- ElevenLabs voice AI

## 📞 Support

- [Convex Discord](https://discord.gg/convex)
- [WorkOS Support](https://workos.com/support)
- [Liveblocks Discord](https://liveblocks.io/discord)
- [ElevenLabs Discord](https://discord.gg/elevenlabs)

