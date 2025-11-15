# AGENTS.md

This guide helps agents work effectively in the ARA Group Platform codebase based on实际 observation of the codebase.

## Project Overview

This is a production-grade Turborepo monorepo built on next-forge template, customized for ARA Group with:
- Multi-tenant architecture using subdomains
- WorkOS authentication (migrated from Clerk)
- Convex database with custom schema
- Feature flags and security middleware
- CI/CD with multi-environment deployments

## Essential Commands

### Development
```bash
# Install dependencies
pnpm install

# Start development (all apps)
pnpm dev

# Start specific apps
pnpm --filter app dev    # Main app (port 3000)
pnpm --filter api dev    # API server (port 3002)
pnpm --filter web dev    # Marketing site (port 3001)

# Convex database
pnpm convex:dev          # Start Convex in dev mode
cd packages/database && convex dev
```

### Build & Test
```bash
# Build all packages/apps
pnpm build

# Run tests
pnpm test

# Type checking
pn turbo run build --filter=!@repo/email --filter=!@repo/storybook --dry=json

# Linting and formatting (uses Ultracite, not Biome for most files)
pnpm check               # Lint check
pnpm fix                 # Auto-fix linting issues
```

### WorkOS Setup
```bash
# Setup WorkOS features
pnpm setup:workos                    # Basic WorkOS setup
pnpm setup:workos:complete          # Complete setup with all features
pnpm test:workos                    # Test WorkOS integration
pnpm configure:ara-group            # Configure ARA Group organizations
pnpm setup:ara-complete             # Full ARA organization setup
```

### Environment & Deployment
```bash
# Sync environment variables across environments
pnpm sync:env:dev
pnpm sync:env:staging
pnpm sync:env:prod
pnpm sync:env:all

# Validate environment
pnpm validate:env

# Health check
pnpm health:check
```

## Codebase Structure

### Monorepo Layout
```
apps/                    # Deployable applications
├── app/                 # Main application (port 3000)
├── api/                 # API server (port 3002) 
├── web/                 # Marketing site (port 3001)
├── docs/                # Documentation site
├── email/               # Email templates
└── storybook/          # Component library

packages/               # Shared packages
├── auth/               # WorkOS authentication
├── database/           # Convex database and schema
├── design-system/      # UI components and design tokens
├── security/           # Security middleware and headers
├── payments/           # Stripe payment integration
├── notifications/      # In-app notifications
├── feature-flags/      # Feature flag management
└── [20+ other packages]

scripts/                # Setup and automation scripts
.github/workflows/      # CI/CD pipelines
```

### Key Patterns

#### Authentication (WorkOS)
- Uses WorkOS instead of Clerk for enterprise SSO
- Server-side auth in `@repo/auth/server`
- Client-side components in `@repo/auth/src/components`
- Middleware handles organization subdomain detection
- Environment variables: `WORKOS_API_KEY`, `WORKOS_CLIENT_ID`

#### Database (Convex)
- Schema defined in `packages/database/convex/schema.ts`
- Uses convex-ents for entity relationships
- Custom auth schema forked from Better Auth
- Functions in `packages/database/convex/`
- Generate types: `cd packages/database && convex generate`

#### Multi-Tenancy
- Organization detection via subdomain (middleware.ts:24-99)
- ARA subdomains: ['fire', 'electrical', 'buildingservices', etc.]
- Two domain patterns: `*.ara.aliaslabs.ai` and `*.aragroup.com.au`
- Organization context passed via headers and query params

#### Environment Management
- Shared configs in root: `.env.development`, `.env.production`, `.env.staging`
- App-specific: `apps/app/.env.local`, `packages/database/.env.local`
- Scripts for syncing across Vercel environments
- All env vars are optional (validation is non-blocking)

## Code Style & Conventions

### Formatting
- Uses Biome for most files (configured in `biome.jsonc`)
- Ultracite for additional linting (`pnpm check`, `pnpm fix`)
- 2-space indentation, 80 character line width
- Single quotes, semicolons always, trailing commas

### TypeScript
- Strict TypeScript configuration
- Shared config in `@repo/typescript-config`
- Use `readonly` for object properties where appropriate
- Export types separately from implementations

### Component Patterns
- Server components by default
- Client components marked with `"use client"`
- Design system components in `@repo/design-system`
- Sidebar layout with organization provider

### Database Patterns
- Use convex-ents for entity definitions
- Define edges first, then fields, then indexes
- Include `_generated` directory in git
- Schema changes require `convex deploy` to sync

## Important Gotchas

### WorkOS Migration
- Clerk references have been removed but some documentation may still mention it
- WorkOS requires API key and client ID in environment
- Webhook endpoints: `/api/webhooks/workos`
- Redirect URI must be configured in WorkOS dashboard

### Environment Variables
- All env vars are designed to be optional for graceful degradation
- Use `.env.local` for development overrides
- Production values managed via Vercel environment sync scripts
- `WORKOS_` vars for auth, `CONVEX_` vars for database

### Testing
- Uses Vitest for unit tests
- Test environment: `NODE_ENV=test vitest run`
- Integration tests include WorkOS and Convex functionality

### Build Dependencies
- Build order matters: auth packages → database → apps
- Email and Storybook are excluded from some CI builds
- Convex deployment happens separately from Next.js builds

### Security
- Arcjet integration for request validation
- Security middleware configurable via environment
- Organization isolation based on subdomain
- Rate limiting and secure headers enabled

## CI/CD

### Workflows
- `ci.yml`: Main pipeline (lint, typecheck, test, build)
- `deploy-staging.yml`: Staging deployments
- `deploy-production.yml`: Production deployments
- `security.yml`: Security scanning

### Required Secrets
- `TURBO_TOKEN`, `TURBO_TEAM` for Turborepo caching
- `WORKOS_API_KEY`, `WORKOS_CLIENT_ID` for auth
- `CONVEX_DEPLOYMENT` for database access
- Vercel tokens for deployment

## Development Workflow

1. **Setup**: Run `pnpm install` and configure `.env.local` files
2. **Database**: Start Convex with `pnpm convex:dev`
3. **Auth**: Configure WorkOS with `pnpm setup:workos`
4. **Development**: Use `pnpm dev` to start all services
5. **Testing**: Run `pnpm test` before committing
6. **Build**: Verify with `pnpm build`
7. **Environment Sync**: Use `pnpm sync:env:[env]` for deployments

## 📋 README.md Maintenance (CRITICAL)

**IMPORTANT**: The `README.md` file is the primary source of truth for this project. It **MUST** be kept up to date.

### When to Update README.md

You **MUST** update `README.md` whenever you:

1. **Add or modify features** - Update "Features & Implementation Status" section
2. **Add packages or integrations** - Update "Packages & Integrations" and "Integrations & Services" sections
3. **Change architecture** - Update "Architecture" section
4. **Modify setup/configuration** - Update "Getting Started" section
5. **Add or change scripts** - Update "Available Scripts" section
6. **Update implementation status** - Change status indicators (✅, ⚠️, ❌)

### Status Indicators

Use consistently:
- ✅ = Complete/Implemented
- ⚠️ = In Progress/Partial
- ❌ = Not Started/Not Implemented

### Update Checklist

Before completing any task:
- [ ] README.md updated with all changes
- [ ] Status indicators are accurate
- [ ] All new features/packages documented
- [ ] Commands and scripts listed
- [ ] Environment variables documented
- [ ] Structure and formatting consistent

### Additional Resources

- See `CRUSH.md` for detailed CRUSH agent instructions
- See `CLAUDE.md` for detailed Claude agent instructions
- See `README.md` for the complete project documentation

**Remember**: Code changes without documentation updates are incomplete. Keep README.md synchronized with code changes!

## Package Dependencies

Key internal dependencies to understand:
- All apps depend on `@repo/auth`, `@repo/database`, `@repo/design-system`
- API uses `@repo/payments` for Stripe webhooks
- Auth package integrates with Convex for user management
- Security middleware used across all Next.js apps

## Vercel CLI Status

### Installation & Configuration
- **CLI Version**: 47.0.5 (installed via Homebrew)
- **Authentication**: Logged in as `alias-com-ai`
- **Workspace**: alias-labs
- **Main Project**: `next-forge` (https://next-forge-alias-labs.vercel.app)

### Project Structure on Vercel
The monorepo has individual deployments for each app:
- `app` - Main application (linked to app directory)
- `api` - API server  
- `web` - Marketing site
- `docs` - Documentation
- `storybook` - Component library

### Environment Variables
All apps are configured for Vercel deployments with:
- **WorkOS variables**: `WORKOS_API_KEY`, `WORKOS_CLIENT_ID`
- **Convex variables**: `CONVEX_DEPLOYMENT`, `NEXT_PUBLIC_CONVEX_URL`
- **Clerk legacy variables**: Still present but being migrated to WorkOS

### Vercel Commands
```bash
# Link individual app directories
cd apps/app && vercel link --yes
cd apps/api && vercel link --yes
cd apps/web && vercel link --yes

# Deploy specific apps
vercel --prod              # Production
vercel                     # Preview

# Environment management
vercel env ls              # List environment variables
vercel env pull .env.local # Pull to local file
```

## Scripts Directory

The `scripts/` directory contains extensive automation utilities:
- WorkOS setup and configuration
- ARA organization management
- Environment variable synchronization
- CI/CD pipeline setup
- Testing automation

These are TypeScript executable scripts using `tsx`.