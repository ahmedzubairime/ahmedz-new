# Homepage Lists (Features, Partners, Testimonials)

## Goal
Build robust, bilingual CRUD Data Grids for the Homepage repeatable elements (Features, Partners, Testimonials) using Server Actions and visually stunning React grid interfaces.

## Tasks
- [ ] Task 1: Create `app/actions/homepage-lists.ts` to hold 9 Server Actions (Get/Create/Delete for features, partners, testimonials) → Verify: Actions check DB and return data or execute DML.
- [ ] Task 2: Build `<FeaturesGrid>` UI component supporting dual language inputs, Lucide icon names, and inline create/delete. → Verify: Adding a feature appears in the list instantly.
- [ ] Task 3: Build `<PartnersGrid>` UI component integrating `<UploadDialog>` for logos and URL fields. → Verify: Logo uploads map correctly to Supabase bucket and return public URLs.
- [ ] Task 4: Build `<TestimonialsGrid>` UI component utilizing larger text areas for Arabic/English quotes and avatar uploads. → Verify: Quote truncation works visually before expansion.
- [ ] Task 5: Wire up the 3 Next.js Route Pages (`features/page.tsx`, `partners/page.tsx`, `testimonials/page.tsx`) to render their respective grids. → Verify: User can navigate to all 3 from the Homepage Content hub.

## Done When
- [ ] Administrators can visually manage all 3 lists with zero hydration errors.
- [ ] Uploaded images are strictly sent to the `images` Supabase bucket.
- [ ] Deletion actions require a confirmation step to prevent accidental loss.
