import { flag } from "flags/next";

/**
 * Creates an environment-based feature flag that checks the current environment
 */
export const createEnvironmentFlag = (environment: "production" | "staging" | "development") => {
  return flag({
    key: `environment.${environment}`,
    defaultValue: false,
    async decide() {
      const nodeEnv = process.env.NODE_ENV || "development";
      const vercelEnv = process.env.VERCEL_ENV;

      // Check Vercel environment first (more reliable)
      if (vercelEnv) {
        return vercelEnv === environment;
      }

      // Fallback to NODE_ENV
      if (environment === "production") {
        return nodeEnv === "production";
      }
      if (environment === "staging") {
        return nodeEnv === "staging" || nodeEnv === "test";
      }
      if (environment === "development") {
        return nodeEnv === "development" || !nodeEnv;
      }

      return false;
    },
  });
};

