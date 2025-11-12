import { createFlag } from "./lib/create-flag";
import { createWorkOSFlag } from "./lib/create-workos-flag";
import { createEnvironmentFlag } from "./lib/create-environment-flag";

// ============================================
// Application Feature Flags
// ============================================

export const showBetaFeature = createFlag("showBetaFeature");

// Collaboration Features
export const collaborationEnabled = createFlag("app.collaboration.enabled");
export const liveblocksEnabled = createFlag("app.liveblocks.enabled");

// Voice AI Features
export const voiceInputEnabled = createFlag("app.voiceInput.enabled");
export const elevenlabsEnabled = createFlag("app.elevenlabs.enabled");

// Analytics Features
export const analyticsEnabled = createFlag("app.analytics.enabled");
export const posthogEnabled = createFlag("app.posthog.enabled");

// ============================================
// WorkOS Feature Flags
// ============================================

// WorkOS Core Features
export const workosAuthEnabled = createWorkOSFlag("workos.auth.enabled", true);
export const workosSSOEnabled = createWorkOSFlag("workos.sso.enabled", false);
export const workosDirectorySyncEnabled = createWorkOSFlag(
  "workos.directorySync.enabled",
  false
);
export const workosAuditLogsEnabled = createWorkOSFlag(
  "workos.auditLogs.enabled",
  false
);
export const workosAdminPortalEnabled = createWorkOSFlag(
  "workos.adminPortal.enabled",
  false
);
export const workosFGAEnabled = createWorkOSFlag("workos.fga.enabled", false);

// WorkOS Provider Flags
export const workosGoogleOAuthEnabled = createWorkOSFlag(
  "workos.providers.googleOAuth.enabled",
  false
);
export const workosMicrosoftOAuthEnabled = createWorkOSFlag(
  "workos.providers.microsoftOAuth.enabled",
  false
);
export const workosMagicCodeEnabled = createWorkOSFlag(
  "workos.providers.magicCode.enabled",
  true
);

// ============================================
// Environment Feature Flags
// ============================================

export const isProduction = createEnvironmentFlag("production");
export const isStaging = createEnvironmentFlag("staging");
export const isDevelopment = createEnvironmentFlag("development");

// ============================================
// Feature Flag Groups (for easier access)
// ============================================

export const workosFlags = {
  auth: workosAuthEnabled,
  sso: workosSSOEnabled,
  directorySync: workosDirectorySyncEnabled,
  auditLogs: workosAuditLogsEnabled,
  adminPortal: workosAdminPortalEnabled,
  fga: workosFGAEnabled,
  providers: {
    googleOAuth: workosGoogleOAuthEnabled,
    microsoftOAuth: workosMicrosoftOAuthEnabled,
    magicCode: workosMagicCodeEnabled,
  },
} as const;

export const appFlags = {
  beta: showBetaFeature,
  collaboration: collaborationEnabled,
  liveblocks: liveblocksEnabled,
  voiceInput: voiceInputEnabled,
  elevenlabs: elevenlabsEnabled,
  analytics: analyticsEnabled,
  posthog: posthogEnabled,
} as const;

export const environmentFlags = {
  production: isProduction,
  staging: isStaging,
  development: isDevelopment,
} as const;
