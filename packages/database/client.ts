/**
 * @repo/database/client - Convex Client Exports
 * 
 * This file exports client-side Convex utilities.
 * Use this in client components and hooks.
 */

"use client";

// Export Convex React hooks and providers
export { ConvexProvider, ConvexReactClient } from "convex/react";

// Export Convex API for client-side usage
export { api } from "./convex/_generated/api";

// Export Convex types
export type { Doc, Id } from "./convex/_generated/dataModel";

// Re-export commonly used Convex utilities
export { ConvexError } from "convex/values";

