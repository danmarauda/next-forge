import type { WorkOS } from '@workos-inc/node';

/**
 * WorkOS Service Configuration
 */
export interface WorkOSServiceConfig {
  enabled: boolean;
  clientId?: string;
  apiKey?: string;
  redirectUri?: string;
}

/**
 * WorkOS User (simplified)
 */
export interface WorkOSUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePictureUrl?: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * WorkOS Organization (simplified)
 */
export interface WorkOSOrganization {
  id: string;
  name: string;
  domains?: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * WorkOS Session
 */
export interface WorkOSSession {
  id: string;
  userId: string;
  organizationId?: string;
  expiresAt: number;
  createdAt: number;
}

/**
 * Base service class interface
 */
export interface BaseWorkOSService {
  isEnabled(): boolean;
  getClient(): WorkOS;
}
