# Task: Multi-Locale Setup (Arabic + English)

## Requirements
- Default locale: `ar` (Arabic)
- URL structure: `/ar/page` and `/en/page` (both prefixed)
- RTL support: `dir="rtl"` on HTML + Tailwind logical properties
- Translation files: per-feature per-locale (`auth.ar.json`, `auth.en.json`, etc.)
- Auto-detect locale via `Accept-Language` header
- Auto-redirect if no locale in URL
- Persist user locale choice via cookie

## Implementation Steps

### Phase 1: Install & Configure
- [x] Install `next-intl`
- [x] Create `src/i18n/routing.ts` — locale list, default locale, pathnames
- [x] Create `src/i18n/request.ts` — server-side locale resolution
- [x] Update `next.config.ts` — add `next-intl` plugin

### Phase 2: Restructure App Directory
- [x] Move `src/app/layout.tsx` → `src/app/[locale]/layout.tsx`
- [x] Move `src/app/page.tsx` → `src/app/[locale]/page.tsx`
- [x] Move `src/app/globals.css` → stays at `src/app/globals.css` (root)
- [x] Create root `src/app/layout.tsx` (minimal, redirects only)

### Phase 3: Middleware & Detection
- [x] Create `src/middleware.ts` — handles locale detection + redirect + cookie

### Phase 4: Translation Files
- [x] Create `src/messages/common.ar.json`
- [x] Create `src/messages/common.en.json`

### Phase 5: Navigation Utilities
- [x] Create `src/i18n/navigation.ts` — locale-aware Link, redirect, useRouter

### Phase 6: RTL Support
- [x] Set `dir` attribute dynamically in layout
- [x] Configure font for Arabic (Noto Sans Arabic / IBM Plex Sans Arabic)

### Phase 7: Locale Switcher Component
- [x] Create `src/components/LocaleSwitcher.tsx`

## Verification
- [ ] `npm run build` passes
- [ ] `/` redirects to `/ar/`
- [ ] `/en/` shows English content
- [ ] Locale switcher works and persists choice
- [ ] RTL layout applied for Arabic
