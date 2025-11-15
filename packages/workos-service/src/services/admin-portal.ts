import type { WorkOS } from '@workos-inc/node';
import type { BaseWorkOSService, WorkOSServiceConfig } from '../types';

/**
 * Admin Portal Service
 *
 * Handles WorkOS Admin Portal operations.
 * Feature flag: workos.adminPortal.enabled
 */
export class AdminPortalService implements BaseWorkOSService {
  constructor(
    private client: WorkOS,
    private config: WorkOSServiceConfig,
  ) {}

  isEnabled(): boolean {
    // Check environment variable override
    const envEnabled = process.env.NEXT_PUBLIC_WORKOS_ADMIN_PORTAL_ENABLED;
    if (envEnabled !== undefined) {
      return envEnabled === 'true' || envEnabled === '1';
    }
    return this.config.enabled;
  }

  getClient(): WorkOS {
    return this.client;
  }

  /**
   * Generate admin portal link
   */
  async generateLink(options: {
    organizationId?: string;
    intent?: 'sso' | 'user_management';
    returnUrl?: string;
  }): Promise<string> {
    if (!this.isEnabled()) {
      throw new Error('WorkOS Admin Portal is not enabled');
    }

    return this.client.portal.generateLink(options);
  }
}
