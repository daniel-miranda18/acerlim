import { PrismaClient } from "../../generated/prisma";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { env } from "../config/env";

if (!env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined. Please check your .env file.");
}

const adapter = new PrismaMariaDb(env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

export default prisma;
