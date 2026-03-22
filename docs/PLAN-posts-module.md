# PLAN: Posts & Newsletter Module (God Tier)

## 1. Project Overview
Transforming the traditional Blog/Posts management into a modern, dual-language CMS editing experience, complete with an integrated TipTap Rich Text Editor (directly tied to our `UploadDialog` from the Media Grid), SEO management, post categorization, and an integrated newsletter system to directly email subscribers published articles.

## 2. UI / UX Pro Max (Design Philosophy)
- **Fluid Multi-Locale Editing:** Instead of tedious switching, we'll offer a "Zen Mode" toggle: a split-screen authoring experience (Arabic on the right, English on the left) for simultaneous translation, or elegant animated tabs for smaller screens.
- **TipTap WYSIWYG Editor:** A highly custom, notion-style block editor. When users type `/image`, it will trigger the exact same `UploadDialog` we just built, permanently mapping images to a `post-images` folder in the Supabase bucket!
- **Glassmorphic Floating Action Bar:** A sticky toolbar at the bottom capturing "Save Draft", "Publish", "Schedule", and "SEO Score". 
- **Newsletter Dash:** A stunning heat-map and graph showing subscriber growth, accompanied by a robust template builder that pulls data straight from the published posts.

## 3. Database Architecture (Supabase)

### `post_categories`
- `id` (uuid, pk)
- `slug` (text, unique)
- `name_ar` (text), `name_en` (text)
- `description_ar` (text), `description_en` (text)

### `posts`
- `id` (uuid, pk)
- `category_id` (uuid, fk -> post_categories)
- `slug_ar` (text), `slug_en` (text)
- `title_ar` (text), `title_en` (text)
- `content_ar` (jsonb / text), `content_en` (jsonb / text)
- `excerpt_ar` (text), `excerpt_en` (text)
- `cover_image_id` (uuid, fk -> media)
- `status_ar` (enum: draft, scheduled, published)
- `status_en` (enum: draft, scheduled, published)
- `published_at_ar` (timestamptz), `published_at_en` (timestamptz)
- `seo_title_ar` (text), `seo_title_en` (text)
- `seo_description_ar` (text), `seo_description_en` (text)

### `newsletter_subscribers`
- `id` (uuid, pk)
- `email` (text, unique)
- `preferred_locale` (enum: ar, en)
- `status` (enum: active, unsubscribed)
- `created_at` (timestamptz)

### `newsletter_campaigns`
- `id` (uuid, pk)
- `subject_ar` (text), `subject_en` (text)
- `body_html_ar` (text), `body_html_en` (text)
- `target_locale` (enum: both, ar, en)
- `status` (enum: drafting, sending, sent)
- `sent_at` (timestamptz)

## 4. Work Breakdown Structure

### Phase 1: Database Setup
- [ ] Create `post_categories`, `posts`, `newsletter_subscribers`, and `newsletter_campaigns` schemas via Migration.
- [ ] Implement Row-Level Security (RLS) policies allowing `super-admin`, `admin`, and `content-editor`.

### Phase 2: TipTap & Media Integration
- [ ] Install TipTap core and extensions (`@tiptap/react`, `@tiptap/pm`, `@tiptap/starter-kit`, image/link extensions).
- [ ] Create `RichTextEditor.tsx` component.
- [ ] Intercept the Image upload action to open our proprietary `<UploadDialog bucket="images" defaultFolderId="[post-images-id]" />`.

### Phase 3: Post & Category CRUD Views
- [ ] Build the Posts DataTable with Quick Actions (Publish, Draft, Preview).
- [ ] Build the Post Form (Split-View Locale Editing + SEO Fields).
- [ ] Build the Categories Grid with inline-editing.

### Phase 4: Newsletter Management
- [ ] Build Subscriber Data-Table (Import/Export CSV functionality).
- [ ] Build Campaign Builder (Convert TipTap JSON to raw HTML emails).

## 5. Verification Checklist
- [ ] Does TipTap correctly parse and render English (LTR) and Arabic (RTL) natively?
- [ ] Does the Media grid intercept properly and return the `publicUrl` to insert into the Rich Text canvas?
- [ ] Is SEO metadata handled properly in the Schema?
- [ ] Do row-level security policies strictly prevent `viewer` roles from interacting?
