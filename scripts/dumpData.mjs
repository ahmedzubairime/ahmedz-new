import fs from 'fs';
import path from 'path';
import postgres from 'postgres';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const tablesToDump = [
  'roles', 
  'sections', 
  'page_groups', 
  'pages', 
  'role_page_permissions',
  'contact_info',
  'homepage_hero',
  'about_hero',
  'about_company',
  'about_mission',
  'about_seo',
  'homepage_seo',
  'homepage_cta'
];

async function main() {
  const sql = postgres(process.env.DATABASE_URL);
  const outDir = path.join(process.cwd(), 'src', 'db', 'seed-data');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  for (const table of tablesToDump) {
    try {
      const rows = await sql`SELECT * FROM ${sql(table)}`;
      fs.writeFileSync(path.join(outDir, `${table}.json`), JSON.stringify(rows, null, 2));
      console.log(`Dumped ${rows.length} rows to ${table}.json`);
    } catch(err) {
      console.log(`Failed for table ${table}: ${err.message}`);
    }
  }

  // Find storage buckets
  try {
     const buckets = await sql`SELECT * FROM storage.buckets`;
     fs.writeFileSync(path.join(outDir, `buckets.json`), JSON.stringify(buckets, null, 2));
     console.log(`Dumped ${buckets.length} buckets to buckets.json`);
  } catch(e) {}
  
  await sql.end();
}

main().catch(console.error);
