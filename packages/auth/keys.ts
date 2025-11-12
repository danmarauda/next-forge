import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const keys = () =>
  createEnv({
    server: {
      WORKOS_API_KEY: z.string().min(1).optional().or(z.literal('')),
      WORKOS_CLIENT_ID: z.string().min(1).optional().or(z.literal('')),
      WORKOS_REDIRECT_URI: z.string().url().optional().or(z.literal('')),
    },
    client: {
      NEXT_PUBLIC_WORKOS_CLIENT_ID: z
        .string()
        .min(1)
        .optional()
        .or(z.literal('')),
      NEXT_PUBLIC_SITE_URL: z.string().url().optional().or(z.literal('')),
    },
    runtimeEnv: {
      WORKOS_API_KEY: process.env.WORKOS_API_KEY,
      WORKOS_CLIENT_ID: process.env.WORKOS_CLIENT_ID,
      WORKOS_REDIRECT_URI: process.env.WORKOS_REDIRECT_URI,
      NEXT_PUBLIC_WORKOS_CLIENT_ID: process.env.NEXT_PUBLIC_WORKOS_CLIENT_ID,
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    },
  });
