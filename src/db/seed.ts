import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as fs from 'fs';
import * as path from 'path';
import * as schema from './schema';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config({ path: '.env.local' });

const _dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(_dirname, 'seed-data');

function readJsonFile(filename: string) {
  const filePath = path.join(dataDir, filename);
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }
  return [];
}

const mapDates = (dataList: any[]) => dataList.map((item: any) => {
  const nextItem = { ...item };
  ['created_at', 'updated_at', 'published_at', 'subscribed_at', 'unsubscribed_at', 'sent_at', 'starts_at', 'expires_at'].forEach(key => {
    if (nextItem[key]) nextItem[key] = new Date(nextItem[key]);
  });
  return nextItem;
});

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) throw new Error('DATABASE_URL is not set in your .env.local file');

  console.log('🌱 Connecting to database...');
  const client = postgres(dbUrl, { max: 1 });
  const db = drizzle(client, { schema });

  try {
    console.log('📥 Loading JSON data...');
    const dataMaps = [
      { name: 'Roles', data: readJsonFile('roles.json'), table: schema.roles },
      { name: 'Sections', data: readJsonFile('sections.json'), table: schema.sections },
      { name: 'Page Groups', data: readJsonFile('page_groups.json'), table: schema.pageGroups },
      { name: 'Pages', data: readJsonFile('pages.json'), table: schema.pages },
      { name: 'Role Page Permissions', data: readJsonFile('role_page_permissions.json'), table: schema.rolePagePermissions },
      { name: 'Contact Info', data: readJsonFile('contact_info.json'), table: schema.contactInfo },
      { name: 'Homepage Hero', data: readJsonFile('homepage_hero.json'), table: schema.homepageHero },
      { name: 'About Hero', data: readJsonFile('about_hero.json'), table: schema.aboutHero },
      { name: 'About Company', data: readJsonFile('about_company.json'), table: schema.aboutCompany },
      { name: 'About Mission', data: readJsonFile('about_mission.json'), table: schema.aboutMission },
      { name: 'About SEO', data: readJsonFile('about_seo.json'), table: schema.aboutSeo },
      { name: 'Homepage SEO', data: readJsonFile('homepage_seo.json'), table: schema.homepageSeo },
      { name: 'Homepage CTA', data: readJsonFile('homepage_cta.json'), table: schema.homepageCta }
    ];

    for (const { name, data, table } of dataMaps) {
      if (data.length > 0 && table) {
        console.log(`Inserting ${data.length} records into ${name}...`);
        await db.insert(table).values(mapDates(data)).onConflictDoNothing();
      }
    }

    const buckets = readJsonFile('buckets.json');
    if (buckets.length > 0) {
      console.log(`Inserting ${buckets.length} storage buckets...`);
      for (const bucket of buckets) {
        // Raw postgres query for buckets 
        await client`INSERT INTO storage.buckets (id, name, public) VALUES (${bucket.id}, ${bucket.name}, ${bucket.public}) ON CONFLICT DO NOTHING`;
      }
    }

    console.log('✅ Seeding completed perfectly!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    console.log('🔌 Closing database connection...');
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
