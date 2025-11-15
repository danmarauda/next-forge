/**
 * @repo/database - Convex Backend Package
 *
 * This package exports the Convex client and all backend functions.
 * Use this in server components and API routes.
 */

// Re-export commonly used Convex utilities
export { ConvexError } from 'convex/values';
// Export Convex API for server-side usage
export { api } from './convex/_generated/api';
// Export Convex types
export type { Doc, Id } from './convex/_generated/dataModel';
// Export environment keys
export { keys } from './keys';
