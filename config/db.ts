import { drizzle } from 'drizzle-orm/neon-http';

function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "Missing DATABASE_URL environment variable. " +
      "Please set it in your .env file or deployment environment."
    );
  }
  return drizzle(url);
}

// Lazy initialization — validates at first runtime access, not at build time
let _db: ReturnType<typeof getDb> | null = null;

export const db = new Proxy({} as ReturnType<typeof getDb>, {
  get(_target, prop, receiver) {
    if (!_db) {
      _db = getDb();
    }
    return Reflect.get(_db, prop, receiver);
  },
});