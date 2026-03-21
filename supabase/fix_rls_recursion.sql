-- Fix for "infinite recursion detected in policy for relation 'account_roles'"
-- This creates a SECURITY DEFINER function to bypass RLS when checking roles
-- avoiding the infinite loop triggered by RLS policies checking themselves.

-- 1. Create a secure function to check roles while bypassing RLS
CREATE OR REPLACE FUNCTION auth_has_role(required_roles TEXT[])
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM account_roles
        WHERE account_id = auth.uid()
        AND role_id = ANY(required_roles)
    );
END;
$$;

-- 2. Update media policies
DROP POLICY IF EXISTS "Content editors can manage media" ON media;
CREATE POLICY "Content editors can manage media"
    ON media FOR ALL
    USING (auth_has_role(ARRAY['super-admin', 'admin', 'content-editor']));

-- 3. Update media_folders policies
DROP POLICY IF EXISTS "Content editors can manage folders" ON media_folders;
CREATE POLICY "Content editors can manage folders"
    ON media_folders FOR ALL
    USING (auth_has_role(ARRAY['super-admin', 'admin', 'content-editor']));

-- 4. Update post_categories policies
DROP POLICY IF EXISTS "Admins can manage categories" ON post_categories;
CREATE POLICY "Admins can manage categories"
    ON post_categories FOR ALL
    USING (auth_has_role(ARRAY['super-admin', 'admin', 'content-editor']));

-- 5. Update posts policies
DROP POLICY IF EXISTS "Content editors can manage posts" ON posts;
CREATE POLICY "Content editors can manage posts"
    ON posts FOR ALL
    USING (auth_has_role(ARRAY['super-admin', 'admin', 'content-editor']));

-- 6. Update newsletter_members policies
DROP POLICY IF EXISTS "Admins can manage newsletter" ON newsletter_members;
CREATE POLICY "Admins can manage newsletter"
    ON newsletter_members FOR ALL
    USING (auth_has_role(ARRAY['super-admin', 'admin', 'content-editor']));

-- 7. Update cms_pages policies
DROP POLICY IF EXISTS "Content editors can manage pages" ON cms_pages;
CREATE POLICY "Content editors can manage pages"
    ON cms_pages FOR ALL
    USING (auth_has_role(ARRAY['super-admin', 'admin', 'content-editor']));
