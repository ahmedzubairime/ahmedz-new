-- Migration: Public Management System (CMS)
-- Strict individual tables architecture requested by user

-- 1. `homepage_hero` (Enforce single row)
CREATE TABLE IF NOT EXISTS public.homepage_hero (
    id integer NOT NULL DEFAULT 1,
    title_ar text NOT NULL DEFAULT '',
    title_en text NOT NULL DEFAULT '',
    subtitle_ar text,
    subtitle_en text,
    cta_primary_text_ar text,
    cta_primary_text_en text,
    cta_primary_link text,
    image_id uuid REFERENCES public.media(id) ON DELETE SET NULL,
    updated_at timestamp with time zone NULL DEFAULT now(),
    CONSTRAINT homepage_hero_pkey PRIMARY KEY (id),
    CONSTRAINT homepage_hero_single_row CHECK (id = 1)
);

-- Init Hero
INSERT INTO public.homepage_hero (id) VALUES (1) ON CONFLICT DO NOTHING;

-- 2. `homepage_features`
CREATE TABLE IF NOT EXISTS public.homepage_features (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    title_ar text NOT NULL,
    title_en text NOT NULL,
    description_ar text,
    description_en text,
    icon_name text, -- String identifier for lucide/sidebar icons
    sort_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone NULL DEFAULT now(),
    CONSTRAINT homepage_features_pkey PRIMARY KEY (id)
);

-- 3. `homepage_partners`
CREATE TABLE IF NOT EXISTS public.homepage_partners (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name_ar text,
    name_en text,
    website_url text,
    logo_id uuid REFERENCES public.media(id) ON DELETE SET NULL,
    sort_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone NULL DEFAULT now(),
    CONSTRAINT homepage_partners_pkey PRIMARY KEY (id)
);

-- 4. `homepage_testimonials`
CREATE TABLE IF NOT EXISTS public.homepage_testimonials (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    author_name_ar text NOT NULL,
    author_name_en text NOT NULL,
    role_ar text,
    role_en text,
    content_ar text NOT NULL,
    content_en text NOT NULL,
    avatar_id uuid REFERENCES public.media(id) ON DELETE SET NULL,
    sort_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone NULL DEFAULT now(),
    CONSTRAINT homepage_testimonials_pkey PRIMARY KEY (id)
);

-- 5. `services_categories`
CREATE TABLE IF NOT EXISTS public.services_categories (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    slug text NOT NULL UNIQUE,
    name_ar text NOT NULL,
    name_en text NOT NULL,
    description_ar text,
    description_en text,
    sort_order integer DEFAULT 0,
    created_at timestamp with time zone NULL DEFAULT now(),
    CONSTRAINT services_categories_pkey PRIMARY KEY (id)
);

-- 6. `services`
CREATE TABLE IF NOT EXISTS public.services (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    category_id uuid REFERENCES public.services_categories(id) ON DELETE SET NULL,
    slug text NOT NULL UNIQUE,
    title_ar text NOT NULL,
    title_en text NOT NULL,
    description_ar text,
    description_en text,
    image_id uuid REFERENCES public.media(id) ON DELETE SET NULL,
    sort_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone NULL DEFAULT now(),
    updated_at timestamp with time zone NULL DEFAULT now(),
    CONSTRAINT services_pkey PRIMARY KEY (id)
);

-- 7. `contact_info` (Enforce single row)
CREATE TABLE IF NOT EXISTS public.contact_info (
    id integer NOT NULL DEFAULT 1,
    email_primary text,
    email_support text,
    phone_primary text,
    phone_secondary text,
    address_ar text,
    address_en text,
    updated_at timestamp with time zone NULL DEFAULT now(),
    CONSTRAINT contact_info_pkey PRIMARY KEY (id),
    CONSTRAINT contact_info_single_row CHECK (id = 1)
);

-- Init Contact
INSERT INTO public.contact_info (id) VALUES (1) ON CONFLICT DO NOTHING;

-- 8. `social_links`
CREATE TABLE IF NOT EXISTS public.social_links (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    platform text NOT NULL, -- e.g. facebook, instagram, x, linkedin
    url text NOT NULL,
    sort_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone NULL DEFAULT now(),
    CONSTRAINT social_links_pkey PRIMARY KEY (id)
);

-- 9. `branches`
CREATE TABLE IF NOT EXISTS public.branches (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name_ar text NOT NULL,
    name_en text NOT NULL,
    address_ar text NOT NULL,
    address_en text NOT NULL,
    phone text,
    email text,
    latitude double precision,
    longitude double precision,
    sort_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone NULL DEFAULT now(),
    CONSTRAINT branches_pkey PRIMARY KEY (id)
);

-- APPLY RLS SECURITY POLICIES --
DO $$ 
DECLARE 
    tbl_name text; 
    tbls text[] := ARRAY[
        'homepage_hero', 'homepage_features', 'homepage_partners', 'homepage_testimonials',
        'services_categories', 'services', 'contact_info', 'social_links', 'branches'
    ];
BEGIN 
    FOREACH tbl_name IN ARRAY tbls LOOP
        -- Attempt to enable RLS (safe)
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', tbl_name);
        
        -- Drop policies if they exist so we can recreate them safely (idempotent)
        EXECUTE format('DROP POLICY IF EXISTS "Public read access for %I" ON public.%I', tbl_name, tbl_name);
        EXECUTE format('DROP POLICY IF EXISTS "Editors can manage %I" ON public.%I', tbl_name, tbl_name);

        -- Recreate policies
        EXECUTE format('CREATE POLICY "Public read access for %I" ON public.%I FOR SELECT TO public USING (true)', tbl_name, tbl_name);
        EXECUTE format('CREATE POLICY "Editors can manage %I" ON public.%I FOR ALL TO public USING (public.auth_has_role(ARRAY[''super-admin''::text, ''admin''::text, ''content-editor''::text]))', tbl_name, tbl_name);
    END LOOP; 
END $$;
