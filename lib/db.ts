// Prisma 7 singleton — uses the adapter pattern (@prisma/adapter-pg for Postgres).
// Setup required:
//   npm install @prisma/client prisma @prisma/adapter-pg pg
//   npm install -D @types/pg
//   npx prisma generate
//   npx prisma db push
//
// The analyze route imports this via dynamic import + try/catch, so the app
// runs fine without Prisma installed (falls back to in-memory cache only).

// Variable specifiers keep TypeScript from erroring on missing packages.
const PRISMA_PKG = "@prisma/client";
const ADAPTER_PKG = "@prisma/adapter-pg";

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

  if (!process.env.DATABASE_URL) {
    _client = null;
    return _client;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { PrismaClient } = await import(PRISMA_PKG as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { PrismaPg } = await import(ADAPTER_PKG as any);

    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

    _client = new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });

    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.prisma = _client;
    }
  } catch {
    // Package not installed or connection failed — degrade gracefully
    _client = null;
  }

  return _client;
}
