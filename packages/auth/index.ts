/**
 * @repo/auth - WorkOS Authentication Package
 * 
 * This package provides WorkOS authentication for the monorepo.
 * Use this for server-side auth operations.
 */

// Export WorkOS client utilities
export { workosAuth } from "./src/workos-client";

// Export server-side auth helpers
export * from "./src/workos-rsc";

// Export auth components
export { Authenticated } from "./src/components/authenticated";
export { WorkOSProvider } from "./src/components/workos-provider";
export { WorkOSSignForm } from "./src/components/workos-sign-form";

// Export environment keys
export { keys } from "./keys";

