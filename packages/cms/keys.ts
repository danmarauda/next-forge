import { createEnv } from '@t3-oss/env-nextjs';
// import { z } from 'zod'; // TODO: Re-enable when adding Sanity CMS

export const keys = () =>
  createEnv({
    server: {
      // TODO: Replace with Sanity CMS
      // BASEHUB_TOKEN: z
      //   .string()
      //   .startsWith('bshb_pk_')
      //   .optional()
      //   .or(z.literal('')),
    },
    runtimeEnv: {
      // BASEHUB_TOKEN: process.env.BASEHUB_TOKEN,
    },
  });
