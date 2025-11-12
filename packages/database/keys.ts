import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const keys = () =>
  createEnv({
    server: {
      CONVEX_DEPLOYMENT: z.string().optional(),
    },
    client: {
      NEXT_PUBLIC_CONVEX_URL: z.string().optional(),
    },
    runtimeEnv: {
      CONVEX_DEPLOYMENT: process.env.CONVEX_DEPLOYMENT,
      NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
    },
  });
