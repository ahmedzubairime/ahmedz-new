# PLAN: Public Management (Headless CMS) 

## 1. Project Overview
Building a highly performant, fully bilingual "Headless CMS" embedded directly inside the dashboard. This allows administrators to perfectly control the external-facing marketing website, spanning from Homepage configurations (Hero, Features, Partners, Testimonials) to core Services, and dynamic Contact/Branch locations.

## 2. React Best Practices & Performance Strategy
- **Eliminate Waterfalls (Rule #1):** Since a "Homepage" naturally requires 4 different data sets (Hero configs, Features list, Partners, Testimonials), we will absolutely **NOT** fetch them sequentially. We will use `Promise.all([getHero(), getFeatures(), getPartners(), getTestimonials()])` inside the Server Components.
- **Bundle Optimization (Rule #2):** Heavy client-side uploaders (like `<UploadDialog>`) or complex Sortable JS lists (for reordering features/partners) will be imported using `next/dynamic` so the initial page paints instantly.
- **Re-rendering Prevention (Rule #5):** Use aggressive Form State optimizations (React Hook Form) to prevent the entire page rendering when someone types a single letter into a Hero subtitle.

## 3. UI / UX Pro Max Strategy
- **"Live Preview" Splitting:** Instead of making users guess what the Hero section will look like, we can utilize a side-by-side or "View Live" mockup rendering right next to the form fields.
- **Card-centric Reordering:** Features, Partners, and Services will utilize a heavily spaced, elegant drag-and-drop or simple up/down arrow card grid structure. Glassmorphic backgrounds for empty states.
- **Unified Settings Form:** Contact Settings and Social Media will be auto-saved "debounced" fields or utilize a massive floating "Save Changes" sticky footer.

## 4. Database Architecture (Supabase)

Instead of KV stores, prioritizing ultra-strict typings per the user requested "Isolated tables for everything" logic:

### Single Row Configuration Tables
- **`homepage_hero`**: Single row table (enforced by PK='1'). Holds dual-language titles, subtitles, dual CTAs, and a Hero image FK mapping.
- **`contact_info`**: Single row table. Holds global primary/support emails, top-level phone numbers, and physical HQ address.

### Multi-row Repeating/List Content Tables
- **`homepage_features`**: Features array displayed on homepage (title, description, icon name/media string, sort_order).
- **`homepage_partners`**: Simple logo grid for trust (name, external_url, logo_media_id, sort_order).
- **`homepage_testimonials`**: Rich content quotes regarding previous work (author name/role, quote content, avatar_id).
- **`services_categories`**: Hierarchical organizational units (name, slug).
- **`services`**: Master service configurations (belongs to category, rich description, primary image, is_active flag).
- **`social_links`**: Global platform links (Facebook, Twitter, LinkedIn URLs and states).
- **`branches`**: Physical presence instances (Name, Address string, Lat/Lng coordinates, contact phone).

## 5. Work Breakdown Structure

### Phase 1: Database Migration
- [ ] Create `system_settings`, generic `content_blocks` (for features/partners), `service_categories`, and `branches` tables.
- [ ] Define JSONB interfaces for strictly typed singletons (Hero, Contact Setup).

### Phase 2: System Settings Views (Singletons)
- [ ] Build `Contact Settings` & `Social Media` forms mapping to the KV Store.
- [ ] Build `Homepage Hero` section form mapping to the KV Store.

### Phase 3: List Managers (CRUD)
- [ ] Build `Features`, `Partners`, `Testimonials` Datagrids with sorting.
- [ ] Build `Services` & `Services Categories` Manager.
- [ ] Build `Branches` map-integrated manager.

## 6. Verification Checklist
- [ ] Do backend actions retrieve homepage endpoints via `Promise.all`? (No waterfalls).
- [ ] Does the `system_settings` table properly enforce JSON typing through TypeScript interfaces?
- [ ] Can users effortlessly switch locales using the "Zen Toggle" built in the Posts module on these forms?
