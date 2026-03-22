# External Lists (Branches & Socials)

## Goal
Build robust, bilingual CRUD Data Grids for the final peripheral datasets: Global Branches (for maps) and Social Links, using React Grids and Drawer modals.

## Tasks
- [ ] Task 1: Create `app/actions/external-lists.ts` to manage Branches and Socials CRUD. → Verify: Actions fetch correctly.
- [ ] Task 2: Build `<SocialGrid>` UI component supporting simple URL inputs and a dropdown for Platform types (facebook, X, linkedin, etc). → Verify: Correct Icon renders in the grid based on string identifier.
- [ ] Task 3: Build `<BranchesGrid>` UI component utilizing advanced forms for dual-language addresses and exact Latitude/Longitude coordinate pairs. → Verify: Float values save cleanly to Postgres.
- [ ] Task 4: Connect Route Pages (`social/page.tsx`, `branches/page.tsx`) to render the grids. → Verify: Pages navigate successfully from the parent hubs.

## Done When
- [ ] Social URLs open instantly and correctly bind to Platform enums.
- [ ] Coordinate grids render map markers logically and store Double Precision exact floats.
