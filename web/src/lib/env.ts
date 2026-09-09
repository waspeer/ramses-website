import { z } from 'zod';

const envSchema = z.object({
  SANITY_PROJECT_ID: z.string(),
  SANITY_DATASET: z.string(),
});

export const env = envSchema.parse({
  SANITY_PROJECT_ID: import.meta.env.SANITY_PROJECT_ID,
  SANITY_DATASET: import.meta.env.SANITY_DATASET,
});
