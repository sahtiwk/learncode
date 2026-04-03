import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

if (!process.env.DATABASE_URL) {
  throw new Error(
    "Missing DATABASE_URL environment variable. " +
    "Please set it in your .env file before running drizzle-kit commands."
  );
}

export default defineConfig({
    schema: './config/schema.tsx',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL,
    },
});
