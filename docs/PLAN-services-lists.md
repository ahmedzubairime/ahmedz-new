# Services Lists (Categories & Services)

## Goal
Build robust, bilingual CRUD Data Grids for the Services System (Categories & Individual Services) using Server Actions and Slide-Out Drawer form interfaces.

## Tasks
- [ ] Task 1: Create `app/actions/services-lists.ts` to manage Categories and Services DML with strictly cascading foreign keys. → Verify: Actions fetch with joined categories.
- [ ] Task 2: Build `<CategoriesGrid>` UI component supporting slugs, sorting, and bilingual descriptions. → Verify: Slugs automatically resolve without spaces.
- [ ] Task 3: Build `<ServicesGrid>` UI component bridging `services` and `services_categories`. It must include `<UploadDialog>` for service cover images and a Dropdown Select for mapping the Service to a specific Category. → Verify: Services correctly relate to their parent category.
- [ ] Task 4: Connect Route Pages (`categories/page.tsx`, `list/page.tsx`) to render the grids. → Verify: User can manage the architecture from the Dashboard.

## Done When
- [ ] Categories can be created and deleted gracefully.
- [ ] Services map exactly to Categories via UUID references.
- [ ] Uploaded images are strictly sent to the `images` bucket via UploadDialog.
