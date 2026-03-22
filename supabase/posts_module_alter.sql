-- Migration: Posts & Newsletter Module (ALTER SCRIPT)
-- Updates existing tables and creates new ones

-- 1. Alter existing `posts` table to support advanced bilingual fields and media relation
ALTER TABLE public.posts 
  ADD COLUMN IF NOT EXISTS slug_ar text,
  ADD COLUMN IF NOT EXISTS slug_en text,
  ADD COLUMN IF NOT EXISTS cover_image_id uuid REFERENCES public.media(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS status_ar text NOT NULL DEFAULT 'draft' CHECK (status_ar IN ('draft', 'scheduled', 'published')),
  ADD COLUMN IF NOT EXISTS status_en text NOT NULL DEFAULT 'draft' CHECK (status_en IN ('draft', 'scheduled', 'published')),
  ADD COLUMN IF NOT EXISTS published_at_ar timestamp with time zone NULL,
  ADD COLUMN IF NOT EXISTS published_at_en timestamp with time zone NULL,
  ADD COLUMN IF NOT EXISTS seo_title_ar text,
  ADD COLUMN IF NOT EXISTS seo_description_ar text,
  ADD COLUMN IF NOT EXISTS seo_title_en text,
  ADD COLUMN IF NOT EXISTS seo_description_en text;

-- Try to map old posts' status to bilingual fields safely
UPDATE public.posts SET slug_ar = slug, slug_en = slug WHERE slug_ar IS NULL AND slug_en IS NULL AND slug IS NOT NULL;
UPDATE public.posts SET status_ar = status, status_en = status WHERE status IS NOT NULL AND status_ar = 'draft' AND status_en = 'draft';

-- Drop old status and slug columns if you don't need them (optional, keeping them for now to prevent breaking other pages temporarily)

-- 2. Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    email text NOT NULL,
    preferred_locale text NOT NULL DEFAULT 'ar',
    status text NOT NULL DEFAULT 'active',
    created_at timestamp with time zone NULL DEFAULT now(),
    unsubscribed_at timestamp with time zone NULL,
    CONSTRAINT newsletter_subscribers_pkey PRIMARY KEY (id),
    CONSTRAINT newsletter_subscribers_email_key UNIQUE (email),
    CONSTRAINT newsletter_subscribers_locale_check CHECK (preferred_locale IN ('ar', 'en')),
    CONSTRAINT newsletter_subscribers_status_check CHECK (status IN ('active', 'unsubscribed'))
);

-- Enable RLS on newsletter_subscribers
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Content editors can manage subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Content editors can manage subscribers" ON public.newsletter_subscribers FOR ALL TO public USING (public.auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text]));

-- 3. Create newsletter_campaigns table
CREATE TABLE IF NOT EXISTS public.newsletter_campaigns (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    subject_ar text,
    subject_en text,
    body_html_ar text,
    body_html_en text,
    target_locale text NOT NULL DEFAULT 'both',
    status text NOT NULL DEFAULT 'drafting',
    sent_at timestamp with time zone NULL,
    created_at timestamp with time zone NULL DEFAULT now(),
    created_by uuid NULL,
    CONSTRAINT newsletter_campaigns_pkey PRIMARY KEY (id),
    CONSTRAINT newsletter_campaigns_target_locale_check CHECK (target_locale IN ('both', 'ar', 'en')),
    CONSTRAINT newsletter_campaigns_status_check CHECK (status IN ('drafting', 'sending', 'sent')),
    CONSTRAINT newsletter_campaigns_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enable RLS on newsletter_campaigns
ALTER TABLE public.newsletter_campaigns ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Content editors can manage campaigns" ON public.newsletter_campaigns;
CREATE POLICY "Content editors can manage campaigns" ON public.newsletter_campaigns FOR ALL TO public USING (public.auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text]));
