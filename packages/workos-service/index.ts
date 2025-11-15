/**
 * @repo/workos-service - Unified WorkOS Service Package
 *
 * This package provides a unified service layer for all WorkOS features:
 * - Authentication (AuthKit)
 * - SSO (SAML, OIDC, OAuth)
 * - Directory Sync (SCIM)
 * - Audit Logs
 * - Admin Portal
 * - Fine-Grained Authorization (FGA)
 *
 * All services are feature-flag enabled and type-safe.
 */

// Export configuration
export { workosServiceConfig } from './config';
// Export hooks (client-side)
export {
  useWorkOSDirectorySync,
  useWorkOSOrganization,
  useWorkOSService,
  useWorkOSSSO,
  useWorkOSUser,
} from './hooks';
export { AdminPortalService } from './src/services/admin-portal';
export { AuditLogsService } from './src/services/audit-logs';
export { DirectorySyncService } from './src/services/directory-sync';
export { FGAService } from './src/services/fga';
export { SSOService } from './src/services/sso';
// Export individual services
export { UserManagementService } from './src/services/user-management';
// Export types
export type {
  WorkOSOrganization,
  WorkOSServiceConfig,
  WorkOSSession,
  WorkOSUser,
} from './src/types';
// Export WorkOS service
export { WorkOSService } from './src/workos-service';
