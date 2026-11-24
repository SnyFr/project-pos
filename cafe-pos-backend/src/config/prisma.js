import "dotenv/config";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import pkg from "@prisma/client";

const { PrismaClient } = pkg;

const connectionString = process.env.DATABASE_URL;

// Membuat pool koneksi PostgreSQL
const pool = new pg.Pool({ connectionString });

// Menghubungkan pool PostgreSQL ke adapter Prisma 7
const adapter = new PrismaPg(pool);

// Singleton instance PrismaClient agar koneksi tidak bocor saat nodemon restart
const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}