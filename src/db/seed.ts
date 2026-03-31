import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as fs from 'fs';
import * as path from 'path';
import { 
  roles, 
  sections, 
  pageGroups, 
  pages, 
  rolePagePermissions,
  contactInfo,
  homepageHero
} from './schema';
import * as dotenv from 'dotenv';

// Load local environment variables (assumes .env.local holds DATABASE_URL)
dotenv.config({ path: '.env.local' });

// Setup paths to the JSON data
const dataDir = path.join(process.cwd(), 'src/db/seed-data');

function readJsonFile(filename: string) {
  const filePath = path.join(dataDir, filename);
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }
  return [];
}

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error('DATABASE_URL is not set in your .env.local file');
  }

  console.log('🌱 Connecting to database...');
  // Initialize postgres connection
  const client = postgres(dbUrl, { max: 1 });
  const db = drizzle(client);

  try {
    console.log('📥 Loading JSON data...');
    const rolesData = readJsonFile('roles.json');
    const sectionsData = readJsonFile('sections.json');
    const pageGroupsData = readJsonFile('page_groups.json');
    const pagesData = readJsonFile('pages.json');
    const permissionsData = readJsonFile('role_page_permissions.json');
    const contactData = readJsonFile('contact_info.json');
    const heroData = readJsonFile('homepage_hero.json');

    // 1. Roles
    if (rolesData.length > 0) {
      console.log(`Inserting ${rolesData.length} roles...`);
      await db.insert(roles).values(rolesData).onConflictDoNothing();
    }

    // 2. Sections
    if (sectionsData.length > 0) {
      console.log(`Inserting ${sectionsData.length} sections...`);
      await db.insert(sections).values(sectionsData).onConflictDoNothing();
    }

    // 3. Page Groups
    if (pageGroupsData.length > 0) {
      console.log(`Inserting ${pageGroupsData.length} page groups...`);
      await db.insert(pageGroups).values(pageGroupsData).onConflictDoNothing();
    }

    // 4. Pages
    if (pagesData.length > 0) {
      // Need to clean up string dates to actual dates if Drizzle strictly demands it.
      // Postgres-js usually handles ISO strings automatically, but Drizzle prefers JS Date objects for strictness on timestamp fields.
      const parsedPages = pagesData.map((p: any) => ({
        ...p,
        created_at: p.created_at ? new Date(p.created_at) : undefined,
      }));
      console.log(`Inserting ${parsedPages.length} pages...`);
      await db.insert(pages).values(parsedPages).onConflictDoNothing();
    }

    // 5. Role Page Permissions
    if (permissionsData.length > 0) {
      console.log(`Inserting ${permissionsData.length} role_page_permissions...`);
      await db.insert(rolePagePermissions).values(permissionsData).onConflictDoNothing();
    }

    // 6. Contact Info
    if (contactData.length > 0) {
      const parsedContact = contactData.map((c: any) => ({
        ...c,
        updated_at: c.updated_at ? new Date(c.updated_at) : undefined,
      }));
      console.log(`Setting up contact_info...`);
      await db.insert(contactInfo).values(parsedContact).onConflictDoNothing();
    }

    // 7. Homepage Hero
    if (heroData.length > 0) {
      const parsedHero = heroData.map((h: any) => ({
        ...h,
        updated_at: h.updated_at ? new Date(h.updated_at) : undefined,
      }));
      console.log(`Setting up homepage_hero...`);
      await db.insert(homepageHero).values(parsedHero).onConflictDoNothing();
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
