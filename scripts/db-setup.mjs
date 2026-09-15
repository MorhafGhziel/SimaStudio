// Creates the analytics + admin tables in Neon. Run once: `npm run db:setup`
// Reads DATABASE_URL from the environment or from .env.local.
import { readFileSync } from 'node:fs';
import { neon } from '@neondatabase/serverless';

let url = process.env.DATABASE_URL;
if (!url) {
  try {
    const line = readFileSync(new URL('../.env.local', import.meta.url), 'utf8').split(/\r?\n/).find((l) => l.startsWith('DATABASE_URL='));
    url = line?.slice('DATABASE_URL='.length).replace(/^["']|["']$/g, '');
  } catch {}
}
if (!url) {
  console.error('DATABASE_URL is missing. Add it to .env.local first.');
  process.exit(1);
}

// Keep in sync with SCHEMA in src/lib/server/db.ts.
const source = readFileSync(new URL('../src/lib/server/db.ts', import.meta.url), 'utf8');
const statements = [...source.matchAll(/`((?:create table|create index)[\s\S]*?)`/g)].map((m) => m[1]);
const sql = neon(url);
for (const statement of statements) {
  await sql.query(statement);
  console.log('ok:', statement.split('\n')[0].slice(0, 80));
}
console.log(`\nDone. ${statements.length} statements applied.`);
