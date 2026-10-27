import { Pool } from "pg";

const globalForPg = globalThis as typeof globalThis & {
  pgPool?: Pool;
  enquiriesSchemaReady?: Promise<void>;
};

export async function getPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL must be configured.");
  globalForPg.pgPool ??= new Pool({
    connectionString,
    ssl: connectionString.includes("sslmode=require")
      ? { rejectUnauthorized: false }
      : undefined,
  });
  globalForPg.enquiriesSchemaReady ??= globalForPg.pgPool
    .query(`
      create table if not exists public.enquiries (
        id text primary key default ('TG-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10))),
        name text not null,
        company text not null,
        phone text not null,
        email text not null,
        occasion text not null,
        units integer not null check (units > 0),
        budget text not null,
        delivery_date date,
        products text[] not null default '{}',
        customisations text[] not null default '{}',
        message text not null default '',
        source text not null check (source in ('Website', 'Mobile app')),
        status text not null default 'New' check (status in ('New', 'Contacted', 'Converted', 'Lost')),
        created_at timestamptz not null default now()
      )
    `)
    .then(() => undefined)
    .catch((error) => {
      globalForPg.enquiriesSchemaReady = undefined;
      throw error;
    });
  await globalForPg.enquiriesSchemaReady;
  return globalForPg.pgPool;
}
