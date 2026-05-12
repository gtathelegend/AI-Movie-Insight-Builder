// Prisma singleton — only active after:
//   npm install @prisma/client prisma
//   npx prisma generate
//   npx prisma db push
//
// The analyze route imports this via dynamic import + try/catch, so the app
// runs fine without Prisma (in-memory cache only until DB is set up).

// Using a variable for the specifier keeps TS from erroring on the missing package.
const PRISMA_PKG = "@prisma/client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalForPrisma = globalThis as unknown as { prisma?: any };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _client: any = null;
let _initialized = false;

export async function getDbClient() {
  if (_initialized) return _client;
  _initialized = true;

  if (globalForPrisma.prisma) {
    _client = globalForPrisma.prisma;
    return _client;
  }

  try {
    // Dynamic import via variable — avoids TS module resolution error at build time.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { PrismaClient } = await import(PRISMA_PKG as any);
    _client = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.prisma = _client;
    }
  } catch {
    // Package not installed or DB_URL missing — degrade gracefully
    _client = null;
  }

  return _client;
}
