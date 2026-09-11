import { PrismaClient } from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

// 1. Create a native PG connection pool using your POOLED url (port 6543)
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

// 2. Wrap it in Prisma's driver adapter
const adapter = new PrismaPg(pool);

// 3. Pass the adapter to the Prisma Client
export const db = new PrismaClient({ adapter });
