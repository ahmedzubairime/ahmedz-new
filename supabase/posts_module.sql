-- Migration: Posts & Newsletter Module
-- Generates schema for blogging and newsletter functionality based on edge cases requested by user

-- 1. Create post_categories table
CREATE TABLE public.post_categories (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    slug text NOT NULL,
    name_ar text NOT NULL,
    name_en text NOT NULL,
    description_ar text,
    description_en text,
    created_at timestamp with time zone NULL DEFAULT now(),
    updated_at timestamp with time zone NULL,
    created_by uuid NULL,
    CONSTRAINT post_categories_pkey PRIMARY KEY (id),
    CONSTRAINT post_categories_slug_key UNIQUE (slug),
    CONSTRAINT post_categories_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enable RLS on post_categories
ALTER TABLE public.post_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access for categories" ON public.post_categories FOR SELECT TO public USING (true);
CREATE POLICY "Content editors can manage categories" ON public.post_categories FOR ALL TO public USING (public.auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text]));

-- 2. Create posts table
CREATE TABLE public.posts (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    category_id uuid NULL,
    slug_ar text,
    slug_en text,
    title_ar text,
    title_en text,
    content_ar text,
    content_en text,
    excerpt_ar text,
    excerpt_en text,
    cover_image_id uuid NULL,
    status_ar text NOT NULL DEFAULT 'draft',
    status_en text NOT NULL DEFAULT 'draft',
    published_at_ar timestamp with time zone NULL,
    published_at_en timestamp with time zone NULL,
    seo_title_ar text,
    seo_description_ar text,
    seo_title_en text,
    seo_description_en text,
    created_at timestamp with time zone NULL DEFAULT now(),
    updated_at timestamp with time zone NULL,
    created_by uuid NULL,
    CONSTRAINT posts_pkey PRIMARY KEY (id),
    CONSTRAINT posts_slug_ar_key UNIQUE (slug_ar),
    CONSTRAINT posts_slug_en_key UNIQUE (slug_en),
    CONSTRAINT posts_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.post_categories(id) ON DELETE SET NULL,
    CONSTRAINT posts_cover_image_id_fkey FOREIGN KEY (cover_image_id) REFERENCES public.media(id) ON DELETE SET NULL,
    CONSTRAINT posts_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL,
    CONSTRAINT posts_status_ar_check CHECK (status_ar IN ('draft', 'scheduled', 'published')),
    CONSTRAINT posts_status_en_check CHECK (status_en IN ('draft', 'scheduled', 'published'))
);

-- Enable RLS on posts
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access for published posts" ON public.posts FOR SELECT TO public USING (status_ar = 'published' OR status_en = 'published');
CREATE POLICY "Content editors can manage posts" ON public.posts FOR ALL TO public USING (public.auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text]));

-- 3. Create newsletter_subscribers table
CREATE TABLE public.newsletter_subscribers (
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
CREATE POLICY "Content editors can manage subscribers" ON public.newsletter_subscribers FOR ALL TO public USING (public.auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text]));

-- 4. Create newsletter_campaigns table
CREATE TABLE public.newsletter_campaigns (
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
CREATE POLICY "Content editors can manage campaigns" ON public.newsletter_campaigns FOR ALL TO public USING (public.auth_has_role(ARRAY['super-admin'::text, 'admin'::text, 'content-editor'::text]));
