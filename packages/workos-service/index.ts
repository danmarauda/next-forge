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

// Export WorkOS service
export { WorkOSService } from "./src/workos-service";

// Export individual services
export { UserManagementService } from "./src/services/user-management";
export { SSOService } from "./src/services/sso";
export { DirectorySyncService } from "./src/services/directory-sync";
export { AuditLogsService } from "./src/services/audit-logs";
export { AdminPortalService } from "./src/services/admin-portal";
export { FGAService } from "./src/services/fga";

// Export types
export type {
  WorkOSServiceConfig,
  WorkOSUser,
  WorkOSOrganization,
  WorkOSSession,
} from "./src/types";

// Export hooks (client-side)
export {
  useWorkOSService,
  useWorkOSUser,
  useWorkOSOrganization,
  useWorkOSSSO,
  useWorkOSDirectorySync,
} from "./hooks";

// Export configuration
export { workosServiceConfig } from "./config";

