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
export { SignIn } from './components/sign-in';

// Export client-side auth utilities
export { WorkOSAuthProvider, useAuth, useRequireAuth } from './client';

// Export middleware
export { authMiddleware, getUserFromHeaders } from './middleware';
