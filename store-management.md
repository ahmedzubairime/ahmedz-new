# Store Management Implementation Plan

## Goal
Implement a complete, production-ready "Store Management" eCommerce engine including database architecture, Server Actions, and "Pro-Max" UI grids spanning Products, Orders, Categories, and Marketing (Offers/Coupons).

## Tasks

### Phase 1: Core Architecture & Database Migration
- [ ] Task 1: Create `store_schema.sql` creating robust, relational tables (`store_categories`, `store_products`, `store_product_variants`, `store_orders`, `store_coupons`, etc.) including all foreign key cascading and Row Level Security (RLS) policies. → Verify: `mcp_supabase_apply_migration` runs successfully and tables appear in Supabase studio.

### Phase 2: Categories (The Foundation)
- [ ] Task 2: Implement server actions for `store-categories`. → Verify: `actions/store-categories.ts` exports CRUD functions.
- [ ] Task 3: Build `StoreCategoriesGrid.tsx` using the new unified Dual-Language Modal, and connect it to `[locale]/dashboard/categories/page.tsx`. → Verify: Can nest categories infinitely (parent-child).

### Phase 3: Products & Attributes Engine
- [ ] Task 4: Implement server actions for `store-products` and `store-attributes`. → Verify: Can save basic products and global attributes (Color, Size).
- [ ] Task 5: Build `AttributesGrid.tsx` (`products/attributes/page.tsx`) to manage global variant properties. → Verify: Can add "Colors" with hex values.
- [ ] Task 6: Build `ProductsGrid.tsx` (`products/page.tsx`) with image uploaders, multi-category selection, and quick-stock toggles. → Verify: Products save fully.
- [ ] Task 7: Build `VariantsManager.tsx` (`products/variants/page.tsx`) to handle multi-dimensional SKU variants dynamically based on assigned attributes. → Verify: SKU matrix generates properly.
- [ ] Task 8: Build `ReviewsGrid.tsx` (`products/reviews/page.tsx`) for review approvals and rating overviews. → Verify: Reviews can be toggled as approved/spam.

### Phase 4: Orders & Operations 
- [ ] Task 9: Implement server actions for `store-orders` and `order-statuses`. → Verify: Backend computes order states securely.
- [ ] Task 10: Build `OrderStatusesGrid.tsx` (`orders/statuses/page.tsx`) allowing custom operational pipeline steps with distinctive tailored Colors. → Verify: Badges render securely.
- [ ] Task 11: Build `OrdersList.tsx` (`orders/page.tsx`) and `OrderTracking.tsx` (`orders/tracking/page.tsx`). We will utilize a robust Data Table for historical lookup and a Kanban/Timeline for active tracking. → Verify: Orders can change pipeline status.
- [ ] Task 12: Build `ReturnsGrid.tsx` (`orders/returns/page.tsx`) to handle user refund tracking. → Verify: Return requests map to Orders.

### Phase 5: Marketing Engine (Offers & Campaigns)
- [ ] Task 13: Implement server actions for `store-marketing`.
- [ ] Task 14: Build `CouponsGrid.tsx` (`offers-coupons/coupons/page.tsx`) supporting absolute/percentage bounds, start/end dates, and logic caps. → Verify: Coupons enforce usage limits.
- [ ] Task 15: Build `CampaignsGrid.tsx` (`offers-coupons/campaigns/page.tsx`) and `OffersGrid.tsx` (`offers-coupons/offers/page.tsx`) for global marketing mapping. → Verify: Flash sales can be toggled.

## Done When
- [ ] 14 fully interactive, localized UI pages perfectly mimic the "Pro-Max" Dual-Language modal logic.
- [ ] Relational DB integrity guarantees products and variants cannot be orphaned.
- [ ] The dashboard `public.pages` routing matrix is wholly satisfied with actual React components running beautifully.
