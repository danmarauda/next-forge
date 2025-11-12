import type { WorkOS } from "@workos-inc/node";
import type { BaseWorkOSService, WorkOSServiceConfig } from "../types";

/**
 * User Management Service
 * 
 * Handles WorkOS AuthKit user management operations.
 * Feature flag: workos.auth.enabled
 */
export class UserManagementService implements BaseWorkOSService {
  constructor(
    private client: WorkOS,
    private config: WorkOSServiceConfig
  ) {}

  isEnabled(): boolean {
    // Check environment variable override
    const envEnabled = process.env.NEXT_PUBLIC_WORKOS_AUTH_ENABLED;
    if (envEnabled !== undefined) {
      return envEnabled === "true" || envEnabled === "1";
    }
    return this.config.enabled;
  }

  getClient(): WorkOS {
    return this.client;
  }

  /**
   * Get authorization URL for authentication
   */
  async getAuthorizationUrl(options: {
    redirectUri?: string;
    state?: string;
  }): Promise<string> {
    if (!this.isEnabled()) {
      throw new Error("WorkOS User Management is not enabled");
    }

    const env = process.env;
    return this.client.userManagement.getAuthorizationUrl({
      clientId: env.WORKOS_CLIENT_ID!,
      redirectUri: options.redirectUri || env.WORKOS_REDIRECT_URI!,
      state: options.state,
    });
  }

  /**
   * Authenticate user with authorization code
   */
  async authenticateWithCode(code: string) {
    if (!this.isEnabled()) {
      throw new Error("WorkOS User Management is not enabled");
    }

    const env = process.env;
    return this.client.userManagement.authenticateWithCode({
      clientId: env.WORKOS_CLIENT_ID!,
      code,
    });
  }

  /**
   * Get user by ID
   */
  async getUser(userId: string) {
    if (!this.isEnabled()) {
      throw new Error("WorkOS User Management is not enabled");
    }

    return this.client.userManagement.getUser(userId);
  }

  /**
   * List users
   */
  async listUsers(options?: {
    email?: string;
    organizationId?: string;
    limit?: number;
  }) {
    if (!this.isEnabled()) {
      throw new Error("WorkOS User Management is not enabled");
    }

    return this.client.userManagement.listUsers(options);
  }

  /**
   * Create user
   */
  async createUser(user: {
    email: string;
    firstName?: string;
    lastName?: string;
    emailVerified?: boolean;
  }) {
    if (!this.isEnabled()) {
      throw new Error("WorkOS User Management is not enabled");
    }

    return this.client.userManagement.createUser(user);
  }

  /**
   * Update user
   */
  async updateUser(userId: string, updates: {
    firstName?: string;
    lastName?: string;
    emailVerified?: boolean;
    profilePictureUrl?: string;
  }) {
    if (!this.isEnabled()) {
      throw new Error("WorkOS User Management is not enabled");
    }

    return this.client.userManagement.updateUser(userId, updates);
  }

  /**
   * Delete user
   */
  async deleteUser(userId: string) {
    if (!this.isEnabled()) {
      throw new Error("WorkOS User Management is not enabled");
    }

    return this.client.userManagement.deleteUser(userId);
  }
}

