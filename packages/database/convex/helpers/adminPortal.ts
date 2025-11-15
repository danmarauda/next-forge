/**
 * WorkOS Admin Portal Helper Functions
 *
 * Provides utilities for generating WorkOS Admin Portal URLs
 * for organization administrators to manage their organizations.
 *
 * Features:
 * - Generate portal links for org management
 * - Deep links for specific admin tasks
 * - Role-based access validation
 */

import { WorkOS } from '@workos-inc/node';
import { getEnv } from './getEnv';

/**
 * Initialize WorkOS client with API key from environment
 */
function getWorkOSClient(): WorkOS {
  const apiKey = getEnv('WORKOS_API_KEY');
  if (!apiKey || apiKey === 'sk_test_YOUR_WORKOS_API_KEY') {
    throw new Error('WORKOS_API_KEY not configured');
  }
  return new WorkOS(apiKey);
}

/**
 * Get the base site URL for return paths
 */
function getSiteUrl(): string {
  const siteUrl = getEnv('NEXT_PUBLIC_SITE_URL');
  if (!siteUrl) {
    throw new Error('NEXT_PUBLIC_SITE_URL not configured');
  }
  return siteUrl;
}

/**
 * Admin Portal Intent Types
 * Defines specific management tasks admins can perform
 */
export type AdminPortalIntent =
  | 'sso' // Configure Single Sign-On
  | 'dsync' // Configure Directory Sync
  | 'log_streams' // Configure audit log streams
  | 'domain_verification' // Verify organization domains
  | 'settings'; // General organization settings

/**
 * Generate WorkOS Admin Portal URL for organization management
 *
 * @param workosOrgId - WorkOS organization ID
 * @param intent - Specific admin task (optional, defaults to general settings)
 * @param returnPath - Path to return to after admin portal (optional)
 * @returns Admin Portal URL
 *
 * @example
 * ```typescript
 * // General organization settings
 * const settingsUrl = await generateAdminPortalUrl('org_01KA4646H6HSM3ZAHC1N1N01E9');
 *
 * // SSO configuration
 * const ssoUrl = await generateAdminPortalUrl('org_01KA4646H6HSM3ZAHC1N1N01E9', 'sso');
 *
 * // With custom return path
 * const url = await generateAdminPortalUrl(
 *   'org_01KA4646H6HSM3ZAHC1N1N01E9',
 *   'dsync',
 *   '/settings/organization/directory-sync'
 * );
 * ```
 */
export async function generateAdminPortalUrl(
  workosOrgId: string,
  intent?: AdminPortalIntent,
  returnPath?: string
): Promise<string> {
  const workos = getWorkOSClient();
  const siteUrl = getSiteUrl();
  const returnUrl = returnPath ? `${siteUrl}${returnPath}` : `${siteUrl}/settings/organization`;

  const portalUrl = await workos.portal.generateLink({
    organization: workosOrgId,
    intent: intent || undefined,
    returnUrl,
  });

  return portalUrl;
}

/**
 * Generate SSO Configuration Portal URL
 * Specific shortcut for SSO setup
 *
 * @param workosOrgId - WorkOS organization ID
 * @returns SSO configuration portal URL
 */
export async function generateSSOPortalUrl(workosOrgId: string): Promise<string> {
  return generateAdminPortalUrl(workosOrgId, 'sso', '/settings/organization/sso');
}

/**
 * Generate Directory Sync Configuration Portal URL
 * Specific shortcut for Directory Sync setup
 *
 * @param workosOrgId - WorkOS organization ID
 * @returns Directory Sync configuration portal URL
 */
export async function generateDirectorySyncPortalUrl(workosOrgId: string): Promise<string> {
  return generateAdminPortalUrl(workosOrgId, 'dsync', '/settings/organization/directory-sync');
}

/**
 * Generate Domain Verification Portal URL
 * Specific shortcut for domain verification
 *
 * @param workosOrgId - WorkOS organization ID
 * @returns Domain verification portal URL
 */
export async function generateDomainVerificationPortalUrl(workosOrgId: string): Promise<string> {
  return generateAdminPortalUrl(
    workosOrgId,
    'domain_verification',
    '/settings/organization/domains'
  );
}

/**
 * Validate user has admin access to organization
 * Checks if user is owner or admin in the organization
 *
 * @param userId - User ID to check
 * @param orgId - Organization ID
 * @param getMemberRole - Function to get user's role in org
 * @returns true if user is owner or admin
 */
export function validateAdminAccess(
  userId: string,
  orgId: string,
  getMemberRole: (userId: string, orgId: string) => Promise<string | null>
): Promise<boolean> {
  return getMemberRole(userId, orgId).then((role) => role === 'owner' || role === 'admin');
}
