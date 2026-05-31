import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';
import path from 'path';

const defaultDbPath = `file:${path.join(process.cwd(), 'dev.db')}`;
const url = process.env.DATABASE_URL || defaultDbPath;
const authToken = process.env.DATABASE_AUTH_TOKEN;

const libsql = createClient({
  url,
  authToken,
});

const adapter = new PrismaLibSql(libsql);
export const prisma = new PrismaClient({ adapter });
