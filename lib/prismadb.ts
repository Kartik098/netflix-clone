import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prismadb: PrismaClient | undefined;
};

const prismadb = globalForPrisma.prismadb ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prismadb = prismadb;

export default prismadb;
