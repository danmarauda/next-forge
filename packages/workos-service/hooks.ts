'use client';

import { useMemo } from 'react';
import { workosServiceConfig } from './config';
import { createWorkOSService } from './src/workos-service';

/**
 * Hook to get WorkOS service instance
 */
export function useWorkOSService() {
  return useMemo(() => createWorkOSService(workosServiceConfig), []);
}

/**
 * Hook to get WorkOS user management service
 */
export function useWorkOSUser() {
  const service = useWorkOSService();
  return service.userManagement;
}

/**
 * Hook to get WorkOS organization service
 */
export function useWorkOSOrganization() {
  const service = useWorkOSService();
  return service.sso;
}

/**
 * Hook to get WorkOS SSO service
 */
export function useWorkOSSSO() {
  const service = useWorkOSService();
  return service.sso;
}

/**
 * Hook to get WorkOS Directory Sync service
 */
export function useWorkOSDirectorySync() {
  const service = useWorkOSService();
  return service.directorySync;
}
