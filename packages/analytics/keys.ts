import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const keys = () =>
  createEnv({
    client: {
      NEXT_PUBLIC_POSTHOG_KEY: z
        .string()
        .startsWith('phc_')
        .optional()
        .or(z.literal('')),
      NEXT_PUBLIC_POSTHOG_HOST: z.string().url().optional().or(z.literal('')),
      NEXT_PUBLIC_GA_MEASUREMENT_ID: z
        .string()
        .startsWith('G-')
        .optional()
        .or(z.literal('')),
    },
    runtimeEnv: {
      NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
      NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    },
  });
