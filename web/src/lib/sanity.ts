import createClient from 'picosanity';

import { env } from './env';

export const sanity = createClient({
  dataset: env.SANITY_DATASET,
  projectId: env.SANITY_PROJECT_ID,
  useCdn: import.meta.env.PROD,
  apiVersion: '2023-10-03',
});
