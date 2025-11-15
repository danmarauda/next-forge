# ARA Group Platform - Setup Documentation

## Repository Structure

This repository (`ARAGroup-Platform`) is the **active development platform** for ARA Group, built on the [next-forge](https://github.com/danmarauda/next-forge) foundation.

### Relationship to Reference Repository

- **This Repository** (`/Users/alias/Clients/ARAGroup-Platform`): Active platform development
- **Reference Repository** (`/Users/alias/Clients/ARAGroup`): Documentation, reference materials, and organizational planning

These repositories are **sibling directories** and serve different purposes:

| Repository | Purpose | Contents |
|------------|---------|----------|
| `ARAGroup-Platform` | Active Development | Next.js apps, packages, codebase |
| `ARAGroup` | Reference & Planning | Documentation, master context, annual reports, guides |

## Base Template

This platform is built on **next-forge**, a production-grade Turborepo template for Next.js apps.

**Source**: [https://github.com/danmarauda/next-forge](https://github.com/danmarauda/next-forge)

### Key Features from next-forge

- **Monorepo Structure**: Turborepo-managed monorepo
- **Apps**: Web, App, API, Docs, Email, Storybook
- **Packages**: Authentication, Database, Design System, Payments, Email, Analytics, etc.
- **Production-Ready**: Type-safe, secure, scalable

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (recommended) or npm/yarn/bun
- Stripe CLI (for local webhook testing)

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.development .env.local

# Run development server
pnpm dev
```

### Environment Setup

1. Configure `.env.local` with required service credentials:
   - Clerk (Authentication)
   - Stripe (Payments)
   - Resend (Email)
   - Database connection
   - Other service APIs

2. See `.env.development` for required variables

## Project Structure

```
ARAGroup-Platform/
├── apps/           # Deployable applications
│   ├── web/        # Marketing website (port 3001)
│   ├── app/        # Main application (port 3000)
│   ├── api/        # API server
│   ├── docs/       # Documentation
│   ├── email/      # Email templates
│   └── storybook/  # Component library
└── packages/       # Shared packages
    ├── design-system/
    ├── database/
    ├── auth/
    └── ...
```

## Development Workflow

1. **Reference Documentation**: Check `/Users/alias/Clients/ARAGroup/docs/` for:
   - Master context documents
   - Architecture specifications
   - Strategic roadmaps
   - Implementation guides

2. **Platform Development**: Work in this repository (`ARAGroup-Platform`)

3. **Documentation Updates**: Update reference repo when architecture changes

## Next Steps

1. Review existing ARA Group documentation files in this repo
2. Configure environment variables
3. Set up service accounts (Clerk, Stripe, etc.)
4. Begin platform customization for ARA Group requirements

## Related Documentation

- **Reference Repository**: `/Users/alias/Clients/ARAGroup/`
- **Master Context**: `/Users/alias/Clients/ARAGroup/docs/master-context/`
- **Architecture Docs**: `/Users/alias/Clients/ARAGroup/docs/master-context/ARA-Platform-*.md`

---

**Last Updated**: 2025-01-XX  
**Base Template**: next-forge (MIT License)  
**Status**: Active Development








