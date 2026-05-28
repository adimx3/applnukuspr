import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import path from 'path';

const dbPath = path.join(process.cwd(), 'dev.db');

const adapter = new PrismaLibSql({ url: `file:${dbPath}` });

export const prisma = new PrismaClient({ adapter });
