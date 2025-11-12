import { WorkOS } from '@workos-inc/node';
import { getEnv } from './helpers/getEnv';

// Initialize WorkOS client
let workosClient: WorkOS | null = null;

export const getWorkOS = () => {
  if (!workosClient) {
    const env = getEnv();
    workosClient = new WorkOS(env.WORKOS_API_KEY);
  }
  return workosClient;
};

// Export WorkOS modules for convenience
export const getWorkOSUserManagement = () => getWorkOS().userManagement;
export const getWorkOSSSO = () => getWorkOS().sso;
export const getWorkOSOrganizations = () => getWorkOS().organizations;
export const getWorkOSDirectorySync = () => getWorkOS().directorySync;
export const getWorkOSAuditLogs = () => getWorkOS().auditLogs;
// Note: Feature Flags and Admin Portal are accessed differently in WorkOS SDK
