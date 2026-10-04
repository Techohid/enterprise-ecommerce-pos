import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
  // eslint-disable-next-line no-var
  var isDbReachableGlobal: boolean | undefined;
}

export const prisma =
  globalThis.prismaGlobal ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}

/**
 * Checks if the primary relational database is currently online and accessible.
 * Caches the connectivity result to prevent TCP timeouts blocking SSR rendering.
 */
let dbReachable = globalThis.isDbReachableGlobal;
let lastCheckTime = 0;

export async function isDatabaseReachable(): Promise<boolean> {
  // If explicitly disabled or in offline dev mode
  if (process.env.DATABASE_AVAILABLE === "false") {
    return false;
  }

  const now = Date.now();
  // Check every 30 seconds
  if (dbReachable !== undefined && now - lastCheckTime < 30000) {
    return dbReachable;
  }

  try {
    // Quick probe with a 500ms timeout
    const probe = prisma.$queryRaw`SELECT 1`;
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("DB probe timeout")), 400)
    );

    await Promise.race([probe, timeout]);
    dbReachable = true;
  } catch {
    dbReachable = false;
  }

  lastCheckTime = now;
  globalThis.isDbReachableGlobal = dbReachable;
  return dbReachable;
}

export default prisma;
