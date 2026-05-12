import { config as loadEnv } from "dotenv";
import path from "node:path";
import { defineConfig } from "prisma/config";

// Load .env.local first (Next.js convention), then .env as fallback
loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

const ADAPTER_PKG = "@prisma/adapter-pg";

// Prisma 7 config: connection URL is no longer in schema.prisma — it lives here
// (for Migrate + db push) and is also passed to the PrismaClient constructor (runtime).
export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    url: process.env.DATABASE_URL!,
  },
  migrations: {
    adapter: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { PrismaPg } = await import(ADAPTER_PKG as any);
      return new PrismaPg({ connectionString: process.env.DATABASE_URL! });
    },
  },
});
