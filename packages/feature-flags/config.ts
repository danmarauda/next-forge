/**
 * Feature Flags Configuration
 * 
 * Centralized configuration for all feature flags in the application.
 * This file defines the flag hierarchy, default values, and rollout strategies.
 */

export const FEATURE_FLAG_CONFIG = {
  // WorkOS Feature Flags
  workos: {
    auth: {
      key: "workos.auth.enabled",
      defaultValue: true,
      description: "Enable WorkOS authentication",
    },
    sso: {
      key: "workos.sso.enabled",
      defaultValue: false,
      description: "Enable WorkOS SSO (SAML, OIDC, OAuth)",
    },
    directorySync: {
      key: "workos.directorySync.enabled",
      defaultValue: false,
      description: "Enable WorkOS Directory Sync (SCIM)",
    },
    auditLogs: {
      key: "workos.auditLogs.enabled",
      defaultValue: false,
      description: "Enable WorkOS Audit Logs",
    },
    adminPortal: {
      key: "workos.adminPortal.enabled",
      defaultValue: false,
      description: "Enable WorkOS Admin Portal",
    },
    fga: {
      key: "workos.fga.enabled",
      defaultValue: false,
      description: "Enable WorkOS Fine-Grained Authorization",
    },
    providers: {
      magicCode: {
        key: "workos.providers.magicCode.enabled",
        defaultValue: true,
        description: "Enable WorkOS Magic Code authentication",
      },
      googleOAuth: {
        key: "workos.providers.googleOAuth.enabled",
        defaultValue: false,
        description: "Enable Google OAuth via WorkOS",
      },
      microsoftOAuth: {
        key: "workos.providers.microsoftOAuth.enabled",
        defaultValue: false,
        description: "Enable Microsoft OAuth via WorkOS",
      },
    },
  },

  // Application Feature Flags
  app: {
    beta: {
      key: "showBetaFeature",
      defaultValue: false,
      description: "Show beta features to users",
    },
    collaboration: {
      key: "app.collaboration.enabled",
      defaultValue: true,
      description: "Enable collaboration features",
    },
    liveblocks: {
      key: "app.liveblocks.enabled",
      defaultValue: true,
      description: "Enable Liveblocks real-time collaboration",
    },
    voiceInput: {
      key: "app.voiceInput.enabled",
      defaultValue: true,
      description: "Enable voice input features",
    },
    elevenlabs: {
      key: "app.elevenlabs.enabled",
      defaultValue: true,
      description: "Enable ElevenLabs voice AI features",
    },
    analytics: {
      key: "app.analytics.enabled",
      defaultValue: true,
      description: "Enable analytics tracking",
    },
    posthog: {
      key: "app.posthog.enabled",
      defaultValue: true,
      description: "Enable PostHog analytics",
    },
  },

  // Environment Flags
  environment: {
    production: {
      key: "environment.production",
      defaultValue: false,
      description: "Running in production environment",
    },
    staging: {
      key: "environment.staging",
      defaultValue: false,
      description: "Running in staging environment",
    },
    development: {
      key: "environment.development",
      defaultValue: true,
      description: "Running in development environment",
    },
  },
} as const;

/**
 * Get all feature flag keys
 */
export const getAllFlagKeys = (): string[] => {
  const keys: string[] = [];

  const extractKeys = (obj: any) => {
    for (const value of Object.values(obj)) {
      if (value && typeof value === "object") {
        if ("key" in value) {
          keys.push(value.key);
        } else {
          extractKeys(value);
        }
      }
    }
  };

  extractKeys(FEATURE_FLAG_CONFIG);
  return keys;
};

/**
 * Get feature flag configuration by key
 */
export const getFlagConfig = (key: string) => {
  const extractConfig = (obj: any): any => {
    for (const value of Object.values(obj)) {
      if (value && typeof value === "object") {
        if ("key" in value && value.key === key) {
          return value;
        }
        const found = extractConfig(value);
        if (found) return found;
      }
    }
    return null;
  };

  return extractConfig(FEATURE_FLAG_CONFIG);
};

