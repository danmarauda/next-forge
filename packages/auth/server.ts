/**
 * @repo/auth/server - Server-side WorkOS Auth Exports
 *
 * Server-side authentication utilities and types for WorkOS
 */

// Re-export WorkOS types for server-side use
export type {
  Organization,
  OrganizationMembership,
  User,
  Webhook,
} from '@workos-inc/node';

// Export WorkOS client (for server-side usage)
export { WorkOS } from '@workos-inc/node';

// Export server-side auth helpers
export { currentUser, auth } from './src/server-helpers';

