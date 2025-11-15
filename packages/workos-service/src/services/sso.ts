import type { WorkOS } from '@workos-inc/node';
import type { BaseWorkOSService, WorkOSServiceConfig } from '../types';

/**
 * SSO Service
 *
 * Handles WorkOS SSO operations (SAML, OIDC, OAuth).
 * Feature flag: workos.sso.enabled
 */
export class SSOService implements BaseWorkOSService {
  constructor(
    private client: WorkOS,
    private config: WorkOSServiceConfig,
  ) {}

  isEnabled(): boolean {
    // Check environment variable override
    const envEnabled = process.env.NEXT_PUBLIC_WORKOS_SSO_ENABLED;
    if (envEnabled !== undefined) {
      return envEnabled === 'true' || envEnabled === '1';
    }
    return this.config.enabled;
  }

  getClient(): WorkOS {
    return this.client;
  }

  /**
   * Get SSO authorization URL
   */
  async getAuthorizationUrl(options: {
    organizationId?: string;
    domain?: string;
    provider?: string;
    redirectUri: string;
    state?: string;
  }): Promise<string> {
    if (!this.isEnabled()) {
      throw new Error('WorkOS SSO is not enabled');
    }

    const env = process.env;
    return this.client.sso.getAuthorizationUrl({
      clientId: env.WORKOS_CLIENT_ID!,
      ...options,
    });
  }

  /**
   * Authenticate with SSO code
   */
  async authenticateWithCode(code: string) {
    if (!this.isEnabled()) {
      throw new Error('WorkOS SSO is not enabled');
    }

    const env = process.env;
    return this.client.sso.authenticateWithCode({
      clientId: env.WORKOS_CLIENT_ID!,
      code,
    });
  }

  /**
   * Get organization by ID
   */
  async getOrganization(organizationId: string) {
    if (!this.isEnabled()) {
      throw new Error('WorkOS SSO is not enabled');
    }

    return this.client.organizations.getOrganization(organizationId);
  }

  /**
   * List organizations
   */
  async listOrganizations(options?: { domains?: string[]; limit?: number }) {
    if (!this.isEnabled()) {
      throw new Error('WorkOS SSO is not enabled');
    }

    return this.client.organizations.listOrganizations(options);
  }

  /**
   * Create organization
   */
  async createOrganization(organization: { name: string; domains?: string[] }) {
    if (!this.isEnabled()) {
      throw new Error('WorkOS SSO is not enabled');
    }

    return this.client.organizations.createOrganization(organization);
  }

  /**
   * Update organization
   */
  async updateOrganization(
    organizationId: string,
    updates: {
      name?: string;
      domains?: string[];
    },
  ) {
    if (!this.isEnabled()) {
      throw new Error('WorkOS SSO is not enabled');
    }

    return this.client.organizations.updateOrganization(
      organizationId,
      updates,
    );
  }

  /**
   * Delete organization
   */
  async deleteOrganization(organizationId: string) {
    if (!this.isEnabled()) {
      throw new Error('WorkOS SSO is not enabled');
    }

    return this.client.organizations.deleteOrganization(organizationId);
  }
}
