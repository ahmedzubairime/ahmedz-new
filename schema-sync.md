# Drizzle Schema & Seed Generation Plan

## Goal
Systematically translate a connected Supabase project's remote schema (tables, RLS policies, enums) into a modular local Drizzle configuration, and generate migration scripts to seed the existing row data and storage buckets.

## Tasks
- [x] Task 1: Initialize local Supabase CLI and pull the remote DB schema as raw SQL to capture RLS, Functions, and native settings. → Verify: (Skipped: `drizzle-kit` natively pulled RLS policies and constraints, bypassing the need for Docker via Supabase CLI dump).
- [x] Task 2: Temporarily run `npx drizzle-kit pull` to introspect the remote database and get highly accurate Drizzle-compatible mappings. → Verify: A temporary `out/schema.ts` file is generated.
- [x] Task 3: Extract and define Enums & Global Types into `src/db/schema/enums.ts`. → Verify: (Skipped: No natively exported Postgres enums found).
- [x] Task 4: Translate the Core / Auth Domain (`accounts`, `roles`, etc.) into `src/db/schema/core.ts` & `auth.ts`. → Verify: Tables are defined.
- [x] Task 5: Translate the Pages / CMS / SEO Domain (`pages`, `homepage_hero`, `services`, etc.) into `src/db/schema/cms.ts`. → Verify: Relations to core tables match perfectly.
- [x] Task 6: Translate the Store / E-commerce Domain (`store_products`, `store_orders`, etc.) into `src/db/schema/store.ts`. → Verify: Tables are accurately defined.
- [x] Task 7: Translate the Project Management (PMS) Domain (`pms_projects`, `pms_tasks`, etc.) into `src/db/schema/pms.ts`. → Verify: Tables are accurately defined.
- [x] Task 8: Implement the unified `src/db/schema/index.ts` to export all definitions. → Verify: Database exports all definitions perfectly including `relations.ts`.
- [x] Task 9: Extract existing rows via Supabase MCP (`role_page_permissions`, `pages`, etc.) and Storage Buckets to write a unified `src/db/seed.ts` script using standard Drizzle inserts and REST APIs/SQL for buckets. → Verify: Running the seed script on a freshly spun up database populates the core rows and buckets.

## Done When
- [x] All 69 remote tables are represented nicely in modular `.ts` files inside `src/db/schema`.
- [x] A `seed.ts` script is fully working and contains all baseline required rows for the template.
- [x] Storage buckets (`images`, `videos`, `documents`) are either represented in seed/SQL or configured properly.
