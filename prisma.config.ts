import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  earlyAccess: true,
  schema: './prisma/schema.prisma',
  datasourceUrl: env('DATABASE_URL'),
  migrate: {
    seed: 'tsx ./prisma/seed.ts',
  },
});