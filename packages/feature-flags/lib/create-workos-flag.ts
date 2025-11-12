import { analytics } from "@repo/analytics/server";
import { auth } from "@repo/auth/server";
import { flag } from "flags/next";

/**
 * Creates a WorkOS-specific feature flag that checks:
 * 1. User authentication status
 * 2. Organization context (if available)
 * 3. PostHog feature flag status
 * 4. Environment variable override
 */
export const createWorkOSFlag = (
  key: string,
  defaultValue: boolean = false
) => {
  return flag({
    key,
    defaultValue,
    async decide() {
      // Check environment variable override first
      const envKey = `NEXT_PUBLIC_${key.replace(/\./g, "_").toUpperCase()}`;
      const envValue = process.env[envKey];
      if (envValue !== undefined) {
        return envValue === "true" || envValue === "1";
      }

      const { userId } = await auth();

      if (!userId) {
        return this.defaultValue as boolean;
      }

      // Check PostHog feature flag
      const isEnabled = await analytics.isFeatureEnabled(key, userId);

      return isEnabled ?? (this.defaultValue as boolean);
    },
  });
};

