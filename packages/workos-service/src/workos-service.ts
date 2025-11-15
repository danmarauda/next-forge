import { getWorkOS } from '@repo/database/convex/workos';
import type { WorkOS } from '@workos-inc/node';
import { AdminPortalService } from './services/admin-portal';
import { AuditLogsService } from './services/audit-logs';
import { DirectorySyncService } from './services/directory-sync';
import { FGAService } from './services/fga';
import { SSOService } from './services/sso';
import { UserManagementService } from './services/user-management';
import type { WorkOSServiceConfig } from './types';

/**
 * Unified WorkOS Service
 *
 * Provides access to all WorkOS features through a single service interface.
 * All features are feature-flag enabled and can be toggled independently.
 */
export class WorkOSService {
  private client: WorkOS;
  private config: WorkOSServiceConfig;

  public readonly userManagement: UserManagementService;
  public readonly sso: SSOService;
  public readonly directorySync: DirectorySyncService;
  public readonly auditLogs: AuditLogsService;
  public readonly adminPortal: AdminPortalService;
  public readonly fga: FGAService;

  constructor(config?: Partial<WorkOSServiceConfig>) {
    this.client = getWorkOS();
    this.config = {
      enabled: config?.enabled ?? true,
      ...config,
    };

    // Initialize services
    this.userManagement = new UserManagementService(this.client, this.config);
    this.sso = new SSOService(this.client, this.config);
    this.directorySync = new DirectorySyncService(this.client, this.config);
    this.auditLogs = new AuditLogsService(this.client, this.config);
    this.adminPortal = new AdminPortalService(this.client, this.config);
    this.fga = new FGAService(this.client, this.config);
  }

  /**
   * Check if WorkOS service is enabled
   */
  isEnabled(): boolean {
    return this.config.enabled;
  }

  /**
   * Get the underlying WorkOS client
   */
  getClient(): WorkOS {
    return this.client;
  }
}

/**
 * Create a WorkOS service instance
 */
export function createWorkOSService(
  config?: Partial<WorkOSServiceConfig>,
): WorkOSService {
  return new WorkOSService(config);
}
