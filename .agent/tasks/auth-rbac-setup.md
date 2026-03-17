# Auth + RBAC + Storage System Setup

## Status: ✅ ALL PHASES COMPLETE

---

## Phase 1: Database Reset & Schema ✅

### 1.1 Reset Supabase ✅
- [x] Drop all existing tables, policies, triggers, functions
- [x] Empty all storage objects (buckets kept - same names needed)
- [x] Remove all auth users

### 1.2 Apply Fresh Schema (Migration: `fresh_schema`) ✅
Tables:
- `accounts` (id UUID PK → auth.users, full_name, avatar_url, phone, status, created_at, updated_at)
- `roles` (id TEXT PK, name_ar, name_en, description_ar, description_en, is_system, created_at)
- `account_roles` (account_id FK, role_id FK, assigned_at)
- `sections` (id TEXT PK, name_ar, name_en, path, icon, sort_order)
- `page_groups` (id TEXT PK, section_id FK, name_ar, name_en, icon, sort_order)
- `pages` (id TEXT PK, group_id FK, section_id FK, parent_id FK?, name_ar, name_en, path, icon, sort_order)
- `role_page_permissions` (role_id FK, page_id FK, can_create, can_read, can_update, can_delete)

### 1.3 Storage Buckets ✅
- `images` bucket (public, 5MB) → JPEG/PNG/WebP/GIF/SVG
- `videos` bucket (private, 100MB) → MP4/WebM
- `documents` bucket (private, 20MB) → PDF/Word/Excel

### 1.4 Seed Data ✅
- 7 Roles: super-admin, admin, branch-manager, team-leader, team-member, content-editor, viewer
- 2 Sections: dashboard, pms
- 6 Page Groups + 14 Pages
- 70 Role-Page Permissions

---

## Phase 2: Supabase Client Setup ✅

### 2.1 Environment Variables (.env.local) ✅
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

### 2.2 Supabase Clients ✅
- Browser client: `src/lib/supabase/client.ts`
- Server client: `src/lib/supabase/server.ts`
- Middleware client: `src/lib/supabase/middleware.ts`

### 2.3 Middleware (`middleware.ts`) ✅
- Refresh Supabase session on every request
- Combined with i18n middleware
- Protects /dashboard and /projects-management routes
- Redirects unauthenticated users to /login
- Redirects authenticated users away from auth pages

---

## Phase 3: Auth Flow Implementation ✅

### 3.1 Server Actions (`src/app/actions/auth.ts`) ✅
- `signUp` - Supabase auth signup
- `signIn` - Login with password → checks account status
- `signOut` - Clear session + redirect
- `verifyOtp` - Confirm email OTP
- `forgotPassword` - Send reset email
- `resetPassword` - Update password
- `setupAccount` - Create account record + assign viewer role

### 3.2 Auth Pages (all functional) ✅
- `/login` - Email + password → signIn action
- `/register` - Registration → signUp → redirect to confirm-account
- `/confirm-account` - 8-digit OTP input with auto-focus, paste, arrow keys
- `/setup-account` - NEW: Profile setup → create account → dashboard
- `/forgot-password` - Email input → send reset link
- `/reset-password` - New password form
- `/not-authorized` - 403 page

### 3.3 Auth Callback Route ✅
- `src/app/auth/callback/route.ts` - Handle Supabase redirects

---

## Phase 4: RLS Policies ✅
- accounts: Users can read/update own account, admins can read all
- roles: Authenticated read, super-admin manage
- account_roles: Users read own, admins read all, super-admin manage
- sections/page_groups/pages: Authenticated read, super-admin manage
- role_page_permissions: Authenticated read, super-admin manage
- Storage: Images public read, authenticated upload; videos/docs authenticated only
- Security: Fixed function search_path warnings

---

## Phase 5: Permission-Aware Dynamic Sidebar ✅

### Files Created:
- `src/lib/permissions.ts` - Server-side getUserAccount() + getUserSidebar(sectionId) 
- `src/components/SidebarIcon.tsx` - 23 SVG icon components matching DB icon names
- `src/components/DynamicSidebar.tsx` - Collapsible groups, active page highlighting, mobile responsive, RTL-aware, sign out
- `src/components/Topbar.tsx` - Shared topbar with theme/locale switchers

### Dashboard Pages (10 routes): ✅
- /dashboard (index)
- /dashboard/accounts, /dashboard/roles, /dashboard/permissions
- /dashboard/posts, /dashboard/media, /dashboard/pages
- /dashboard/products, /dashboard/orders, /dashboard/categories
- /dashboard/settings

### PMS Pages (5 routes): ✅
- /projects-management (index)
- /projects-management/projects, /tasks, /members, /branches

### Layout Behavior:
- Server-side permission check: getUserAccount() + getUserSidebar()
- No account → redirect to /login
- pending_setup status → redirect to /setup-account
- No section permissions → redirect to /not-authorized
- Sidebar groups auto-hidden if no readable pages
- Active page highlighting based on current URL
- Mobile: floating menu button + overlay sidebar
