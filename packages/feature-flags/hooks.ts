'use client';

import type { Flag } from 'flags/react';
import { use } from 'react';
import * as flags from './index';

/**
 * Hook to check a single feature flag
 */
export function useFeatureFlag<T extends Flag<boolean>>(flag: T): boolean {
  return use(flag);
}

/**
 * Hook to check multiple feature flags
 */
export function useFeatureFlags<T extends Record<string, Flag<boolean>>>(
  flagMap: T,
): Record<keyof T, boolean> {
  const result = {} as Record<keyof T, boolean>;

  for (const [key, flag] of Object.entries(flagMap)) {
    result[key as keyof T] = use(flag);
  }

  return result;
}

/**
 * Hook to check WorkOS feature flags
 */
export function useWorkOSFeatures() {
  return useFeatureFlags(flags.workosFlags);
}

/**
 * Hook to check application feature flags
 */
export function useAppFeatures() {
  return useFeatureFlags(flags.appFlags);
}

/**
 * Hook to check environment flags
 */
export function useEnvironment() {
  return useFeatureFlags(flags.environmentFlags);
}

/**
 * Hook to check if a specific WorkOS feature is enabled
 */
export function useWorkOSFeature(feature: keyof typeof flags.workosFlags) {
  return useFeatureFlag(flags.workosFlags[feature]);
}

/**
 * Hook to check if a specific app feature is enabled
 */
export function useAppFeature(feature: keyof typeof flags.appFlags) {
  return useFeatureFlag(flags.appFlags[feature]);
}
