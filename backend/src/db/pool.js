import pg from "pg";

const { Pool } = pg;

let pool;

export function getPool() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    return null;
  }
  if (!pool) {
    pool = new Pool({ connectionString: url });
  }
  return pool;
}
