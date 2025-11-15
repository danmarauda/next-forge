import type { WorkOS } from '@workos-inc/node';
import type { BaseWorkOSService, WorkOSServiceConfig } from '../types';

/**
 * Directory Sync Service
 *
 * Handles WorkOS Directory Sync operations (SCIM).
 * Feature flag: workos.directorySync.enabled
 */
export class DirectorySyncService implements BaseWorkOSService {
  constructor(
    private client: WorkOS,
    private config: WorkOSServiceConfig,
  ) {}

  isEnabled(): boolean {
    // Check environment variable override
    const envEnabled = process.env.NEXT_PUBLIC_WORKOS_DIRECTORY_SYNC_ENABLED;
    if (envEnabled !== undefined) {
      return envEnabled === 'true' || envEnabled === '1';
    }
    return this.config.enabled;
  }

  getClient(): WorkOS {
    return this.client;
  }

  /**
   * List directories
   */
  async listDirectories(options?: { organizationId?: string; limit?: number }) {
    if (!this.isEnabled()) {
      throw new Error('WorkOS Directory Sync is not enabled');
    }

    return this.client.directorySync.listDirectories(options);
  }

  /**
   * Get directory by ID
   */
  async getDirectory(directoryId: string) {
    if (!this.isEnabled()) {
      throw new Error('WorkOS Directory Sync is not enabled');
    }

    return this.client.directorySync.getDirectory(directoryId);
  }

  /**
   * List directory groups
   */
  async listGroups(
    directoryId: string,
    options?: {
      limit?: number;
    },
  ) {
    if (!this.isEnabled()) {
      throw new Error('WorkOS Directory Sync is not enabled');
    }

    return this.client.directorySync.listGroups(directoryId, options);
  }

  /**
   * Get directory group by ID
   */
  async getGroup(directoryId: string, groupId: string) {
    if (!this.isEnabled()) {
      throw new Error('WorkOS Directory Sync is not enabled');
    }

    return this.client.directorySync.getGroup(directoryId, groupId);
  }

  /**
   * List directory users
   */
  async listUsers(
    directoryId: string,
    options?: {
      limit?: number;
    },
  ) {
    if (!this.isEnabled()) {
      throw new Error('WorkOS Directory Sync is not enabled');
    }

    return this.client.directorySync.listUsers(directoryId, options);
  }

  /**
   * Get directory user by ID
   */
  async getUser(directoryId: string, userId: string) {
    if (!this.isEnabled()) {
      throw new Error('WorkOS Directory Sync is not enabled');
    }

    return this.client.directorySync.getUser(directoryId, userId);
  }
}
