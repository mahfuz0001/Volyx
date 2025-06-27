import type { Config } from 'drizzle-kit';
import { config } from './lib/config';

export default {
  schema: './lib/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: config.database.url,
  },
  verbose: true,
  strict: true,
} satisfies Config;