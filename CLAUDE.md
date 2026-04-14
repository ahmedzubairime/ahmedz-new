# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Quick Start

```bash
npm run dev       # Start development server (localhost:3000)
npm run build     # Production build
npm run start     # Start production server
npm run lint      # ESLint check
```

## Tech Stack

- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript (strict mode, path alias `@/*`)
- **Styling:** Tailwind CSS v4
- **i18n:** next-intl (locales: `ar`, `en` - RTL/LTR support)
- **Backend:** Supabase (SSR via `@supabase/ssr`)
- **Database:** Drizzle ORM with PostgreSQL
- **Rich Text:** TipTap editor
- **Validation:** Zod
- **Forms:** React Hook Form

## Architecture

### Folder Structure
```
src/
├── app/              # App Router with [locale] routing
│   ├── [locale]/     # i18n routes (public pages, dashboard, auth)
│   └── api/          # API routes
├── components/       # Reusable UI (cms, media, pms, posts, ui)
├── db/
│   ├── schema/       # Drizzle schema (auth, storage, accounts, content, pages, media, etc.)
│   └── seed-data/    # Seed JSON files
├── i18n/             # next-intl configuration
├── lib/
│   ├── supabase/     # Supabase client (server, middleware)
│   └── permissions.ts
├── messages/         # Translation JSON files
├── types/            # TypeScript types
└── utils/            # Helper functions
```

### Key Conventions

- **Locale routing:** All user-facing routes prefixed with `[locale]` (e.g., `/ar/dashboard`, `/en/dashboard`)
- **Supabase SSR:** Use `createClient()` from `@/lib/supabase/server` for server components
- **Drizzle schema:** Organized by domain in `src/db/schema/`, exported via `index.ts`
- **Path alias:** `@/*` resolves to `./src/*`

## AI Agent System

This project includes `.agent/` - a modular AI agent toolkit:

- **20 specialist agents** in `.agent/agents/` (frontend, backend, mobile, security, etc.)
- **36 skills** in `.agent/skills/` (domain knowledge modules)
- **Validation scripts** in `.agent/scripts/` (checklist.py, verify_all.py)

Key agents for this Next.js project:
- `frontend-specialist` - Web UI/UX with Tailwind
- `backend-specialist` - API and database operations
- `database-architect` - Drizzle/Supabase schema design

## Database

Drizzle ORM manages PostgreSQL schema. Key domains:
- `auth.ts` - User authentication
- `accounts.ts` - User accounts
- `pages.ts` - Page management
- `content.ts` - CMS content
- `media.ts` - Media library
- `homepage.ts` - Homepage sections
- `services.ts` - Services content
- `marketing.ts` - Marketing data

## i18n (Internationalization)

- **Locales:** Arabic (ar, RTL), English (en, LTR)
- **Config:** `src/i18n/routing.ts`
- **Messages:** `src/messages/ar.json`, `src/messages/en.json`
- **Usage:** Import `useTranslations` from `next-intl`

## Authentication

Supabase Auth with SSR:
- Session cookies managed via middleware
- RLS (Row Level Security) policies on database tables
- Permission system in `src/lib/permissions.ts`

## Testing & Validation

Run comprehensive checks:
```bash
python .agent/scripts/checklist.py .      # Core validation (security, lint, schema, tests, UX, SEO)
python .agent/scripts/verify_all.py .     # Full suite + Lighthouse + E2E
```

## Documentation

Planning docs in `docs/`:
- `PLAN-posts-module.md` - CMS with TipTap editor
- `PLAN-homepage-lists.md` - Homepage content management
- `PLAN-services-lists.md` - Services section
- `PLAN-public-management.md` - Public pages
- `PLAN-external-lists.md` - External integrations
