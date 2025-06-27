import type { Config } from 'drizzle-kit';
import { config } from './lib/config';

export default {
  schema: './lib/schema.ts',
  out: './drizzle',
  dialect: "postgresql",
  driver: "pglite",
  dbCredentials: {
    url: config.database.url,
  },
  verbose: true,
  strict: true,
} satisfies Config;