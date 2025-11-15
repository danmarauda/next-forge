/**
 * @repo/auth - WorkOS Authentication Package
 *
 * This package provides WorkOS authentication for the monorepo.
 * Use this for server-side auth operations.
 */

// Export environment keys
export { keys } from './keys';
// Re-export server exports for convenience
export * from './server';

// Export auth components
export { AuthProvider } from './src/provider';
// Temporarily disabled for visual testing
// export { Authenticated } from './src/components/authenticated';
// export { ConvexProvider } from './src/components/workos-provider';
// export { WorkOSSignForm } from './src/components/workos-sign-form';
// Export WorkOS client utilities
// export { workosAuth } from './src/workos-client';
// Export server-side auth helpers
// export * from './src/workos-rsc';
