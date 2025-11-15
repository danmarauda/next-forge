import type { WorkOS } from '@workos-inc/node';
import type { BaseWorkOSService, WorkOSServiceConfig } from '../types';

/**
 * Audit Logs Service
 *
 * Handles WorkOS Audit Logs operations.
 * Feature flag: workos.auditLogs.enabled
 */
export class AuditLogsService implements BaseWorkOSService {
  constructor(
    private client: WorkOS,
    private config: WorkOSServiceConfig,
  ) {}

  isEnabled(): boolean {
    // Check environment variable override
    const envEnabled = process.env.NEXT_PUBLIC_WORKOS_AUDIT_LOGS_ENABLED;
    if (envEnabled !== undefined) {
      return envEnabled === 'true' || envEnabled === '1';
    }
    return this.config.enabled;
  }

  getClient(): WorkOS {
    return this.client;
  }

  /**
   * Create audit log event
   */
  async createEvent(event: {
    action: string;
    actor: {
      type: 'user' | 'api_key';
      id: string;
    };
    target?: {
      type: string;
      id: string;
    };
    context?: {
      location?: string;
      userAgent?: string;
    };
    metadata?: Record<string, unknown>;
  }) {
    if (!this.isEnabled()) {
      throw new Error('WorkOS Audit Logs is not enabled');
    }

    return this.client.auditLogs.createEvent(event);
  }

  /**
   * List audit log events
   */
  async listEvents(options?: {
    organizationId?: string;
    action?: string;
    actorType?: 'user' | 'api_key';
    actorId?: string;
    limit?: number;
  }) {
    if (!this.isEnabled()) {
      throw new Error('WorkOS Audit Logs is not enabled');
    }

    return this.client.auditLogs.listEvents(options);
  }

  /**
   * Get audit log event by ID
   */
  async getEvent(eventId: string) {
    if (!this.isEnabled()) {
      throw new Error('WorkOS Audit Logs is not enabled');
    }

    return this.client.auditLogs.getEvent(eventId);
  }
}
