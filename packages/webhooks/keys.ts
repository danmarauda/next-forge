import { createEnv } from '@t3-oss/env-nextjs';
// import { z } from 'zod'; // TODO: Re-enable when webhooks are configured

export const keys = () =>
  createEnv({
    server: {
      // TODO: Re-enable when webhooks are configured
      // SVIX_TOKEN: z
      //   .union([z.string().startsWith('sk_'), z.string().startsWith('testsk_')])
      //   .optional()
      //   .or(z.literal('')),
    },
    runtimeEnv: {
      // SVIX_TOKEN: process.env.SVIX_TOKEN,
    },
  });
