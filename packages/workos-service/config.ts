import type { WorkOSServiceConfig } from "./src/types";

/**
 * WorkOS Service Configuration
 * 
 * Centralized configuration for WorkOS service.
 * Can be overridden via environment variables or passed to service constructor.
 */
export const workosServiceConfig: WorkOSServiceConfig = {
  enabled: process.env.WORKOS_ENABLED !== "false",
  clientId: process.env.WORKOS_CLIENT_ID,
  apiKey: process.env.WORKOS_API_KEY,
  redirectUri: process.env.WORKOS_REDIRECT_URI,
};

